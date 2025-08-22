#!/usr/bin/env node

/**
 * CIPHER-RECON CLI
 * Advanced Text Intelligence & Steganography Suite
 * @module cli
 */

const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');

// Import shared modules
const Steganography = require('../shared/steganography');
const Transforms = require('../shared/transforms');

// Get version from package.json
const packagePath = path.join(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const { version } = packageJson;

// Enhanced ASCII Art Header with Full Information
const showHeader = () => {
  console.log(
    chalk.red(`
╔═════════════════════════════════════════════════════════════════════════════╗
║                                                                             ║
║     ██████╗██╗██████╗ ██╗  ██╗███████╗██████╗       ██████╗ ███████╗ ██████╗║
║    ██╔════╝██║██╔══██╗██║  ██║██╔════╝██╔══██╗      ██╔══██╗██╔════╝██╔════╝║
║    ██║     ██║██████╔╝███████║█████╗  ██████╔╝█████╗██████╔╝█████╗  ██║     ║
║    ██║     ██║██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗╚════╝██╔══██╗██╔══╝  ██║     ║
║    ╚██████╗██║██║     ██║  ██║███████╗██║  ██║      ██║  ██║███████╗╚██████╗║
║     ╚═════╝╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝      ╚═╝  ╚═╝╚══════╝ ╚═════╝║
║                                                                             ║
║                   ${chalk.cyan('ELITE RED TEAM TOOLKIT')} - v${version}                     ║
║                 ${chalk.yellow('Advanced Text Intelligence & Steganography')}               ║
║                                                                             ║
╠═════════════════════════════════════════════════════════════════════════════╣
║ ${chalk.green('🚀 QUICK START')}                                                          ║
║   cipher-recon encode "secret" "cover text"  - Hide message in text        ║
║   cipher-recon decode "encoded_text"         - Extract hidden message      ║
║   cipher-recon transform rot13 "hello"       - Apply text transformation   ║
║   cipher-recon interactive                   - Enter interactive mode      ║
║                                                                             ║
║ ${chalk.green('🔧 MAIN COMMANDS')}                                                        ║
║   encode      Hide messages using steganography                            ║
║   decode      Extract hidden messages                                      ║
║   transform   Apply ciphers & encodings (rot13, caesar, base64, hex, etc.) ║
║   analyze     Detect steganographic content                                ║
║   server      Start REST API server                                        ║
║   interactive Enter enhanced terminal mode                                 ║
║                                                                             ║
║ ${chalk.green('⚡ GLOBAL OPTIONS')}                                                       ║
║   -h, --help     Show command help                                         ║
║   -V, --version  Show version information                                  ║
║   -v, --verbose  Enable verbose output                                     ║
║   -q, --quiet    Suppress non-essential output                             ║
║   -o, --output   Save output to file                                       ║
║                                                                             ║
║ ${chalk.green('🎯 STEGANOGRAPHY TECHNIQUES')}                                             ║
║   zero-width     Invisible Unicode characters (default)                    ║
║   emoji          Emoji-based encoding                                      ║
║   whitespace     Space & tab manipulation                                  ║
║   homoglyph      Unicode lookalike characters                              ║
║   invisible      Non-rendering Unicode blocks                              ║
║                                                                             ║
║ ${chalk.green('🔐 CRYPTOGRAPHY & ENCODING')}                                              ║
║   rot13, caesar, atbash    - Classic ciphers                               ║
║   base64, hex, binary      - Standard encodings                            ║
║   upside-down, reverse     - Visual transformations                        ║
║                                                                             ║
║ ${chalk.green('🌐 API & WEB INTERFACE')}                                                  ║
║   cipher-recon server      - Start API server (port 3001)                 ║
║   Open http://localhost:3001 in browser for web interface                  ║
║                                                                             ║
║ ${chalk.green('📚 EXAMPLES')}                                                             ║
║   cipher-recon encode "TOP SECRET" "This is normal text"                   ║
║   cipher-recon decode "Text with hidden message"                           ║
║   cipher-recon transform base64 "hello world"                              ║
║   cipher-recon analyze "suspicious text" --deep                            ║
║                                                                             ║
║ ${chalk.yellow('⚠️  SECURITY NOTICE')}                                                     ║
║   For authorized security testing only. Users responsible for compliance.  ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝`),
  );
  console.log(
    chalk.gray('\n💡 Tip: Use ') +
      chalk.cyan('cipher-recon interactive') +
      chalk.gray(' for enhanced terminal experience\n'),
  );
};

// Initialize
showHeader();
const stego = new Steganography();

// Configure program
program
  .name('cipher-recon')
  .description('Advanced Text Intelligence & Steganography Suite')
  .version(version);

// Encode command
program
  .command('encode <message> <carrier>')
  .description('Encode a hidden message in carrier text')
  .option('-t, --technique <type>', 'encoding technique', 'zero-width')
  .option('-o, --output <file>', 'output to file')
  .action(async (message, carrier, options) => {
    const spinner = ora('Encoding message...').start();
    try {
      const encoded = stego.encode(message, carrier);
      spinner.succeed(chalk.green('Message encoded successfully!'));

      if (options.output) {
        fs.writeFileSync(options.output, encoded);
        console.log(chalk.cyan(`Output saved to: ${options.output}`));
      } else {
        console.log(chalk.yellow('\nEncoded text:'));
        console.log(encoded);
      }
    } catch (error) {
      spinner.fail(chalk.red(`Encoding failed: ${error.message}`));
    }
  });

// Decode command
program
  .command('decode <carrier>')
  .description('Extract hidden message from carrier text')
  .action(async carrier => {
    const spinner = ora('Decoding message...').start();
    try {
      const decoded = stego.decode(carrier);
      spinner.succeed(chalk.green('Message decoded successfully!'));
      console.log(chalk.yellow('\nHidden message:'));
      console.log(decoded);
    } catch (error) {
      spinner.fail(chalk.red(`Decoding failed: ${error.message}`));
    }
  });

// Transform command
program
  .command('transform <type> <text>')
  .description('Apply transformation to text')
  .option('-s, --shift <number>', 'shift value for caesar cipher', '3')
  .option('-d, --decode', 'decode instead of encode')
  .action((type, text, options) => {
    try {
      let result;
      switch (type) {
      case 'rot13':
        result = options.decode ? Transforms.rot13.decode(text) : Transforms.rot13.encode(text);
        break;
      case 'caesar':
        result = options.decode
          ? Transforms.caesar.decode(text, parseInt(options.shift))
          : Transforms.caesar.encode(text, parseInt(options.shift));
        break;
      case 'atbash':
        result = options.decode ? Transforms.atbash.decode(text) : Transforms.atbash.encode(text);
        break;
      case 'base64':
        result = options.decode ? Transforms.base64.decode(text) : Transforms.base64.encode(text);
        break;
      case 'hex':
        result = options.decode ? Transforms.hex.decode(text) : Transforms.hex.encode(text);
        break;
      case 'binary':
        result = options.decode ? Transforms.binary.decode(text) : Transforms.binary.encode(text);
        break;
      case 'upside-down':
        result = options.decode
          ? Transforms.upsideDown.decode(text)
          : Transforms.upsideDown.encode(text);
        break;
      case 'reverse':
        result = Transforms.reverse.encode(text);
        break;
      default:
        console.log(chalk.red(`Unknown transform: ${type}`));
        console.log(chalk.yellow('Available transforms:'));
        Transforms.getAll().forEach(t => console.log(`  - ${t}`));
        return;
      }
      console.log(chalk.green('Transformed text:'));
      console.log(result);
    } catch (error) {
      console.log(chalk.red(`Transform failed: ${error.message}`));
    }
  });

// Analyze command
program
  .command('analyze <text>')
  .description('Analyze text for steganographic content')
  .option('-f, --file <path>', 'analyze text from file')
  .action(async (text, options) => {
    const spinner = ora('Analyzing text...').start();
    try {
      let content = text;
      if (options.file) {
        content = fs.readFileSync(options.file, 'utf8');
      }

      const analysis = stego.analyze(content);
      spinner.succeed(chalk.green('Analysis complete!'));

      console.log(chalk.yellow('\nAnalysis Results:'));
      console.log(`Suspicious: ${analysis.suspicious ? 'YES' : 'NO'}`);
      console.log(`Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
      console.log(`Zero-width chars: ${analysis.zeroWidthCount}`);
      console.log(`Variation selectors: ${analysis.variationSelectors}`);
      console.log(`Suspicious patterns: ${analysis.suspiciousPatterns}`);
      console.log(`Total suspicious: ${analysis.totalSuspicious}`);
    } catch (error) {
      spinner.fail(chalk.red(`Analysis failed: ${error.message}`));
    }
  });

// List transforms command
program
  .command('transforms')
  .description('List all available transformations')
  .action(() => {
    console.log(chalk.yellow('\nAvailable Transformations:'));
    Transforms.getAll().forEach(name => {
      const transform = Transforms.getByName(name);
      console.log(`  ${chalk.cyan(name)} - ${transform.name}`);
    });
  });

// List techniques command
program
  .command('techniques')
  .description('List all available steganography techniques')
  .action(() => {
    console.log(chalk.yellow('\nAvailable Steganography Techniques:'));
    stego.getTechniques().forEach(technique => {
      console.log(`  - ${chalk.cyan(technique)}`);
    });
  });

// Server command
program
  .command('server')
  .description('Start the API server')
  .option('-p, --port <number>', 'port number', '3001')
  .option('-h, --host <address>', 'host address', '127.0.0.1')
  .action(options => {
    process.env.PORT = options.port;
    process.env.HOST = options.host;
    console.log(chalk.cyan(`Starting API server on ${options.host}:${options.port}...`));
    require('../api/server');
  });

// Interactive mode
program
  .command('interactive')
  .description('Start interactive mode')
  .action(() => {
    console.log(chalk.yellow('\nStarting interactive mode...'));
    console.log(chalk.cyan('Type "help" for available commands, "exit" to quit'));

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'cipher-recon> ',
    });

    rl.prompt();

    rl.on('line', line => {
      const input = line.trim();

      if (input === 'exit' || input === 'quit') {
        rl.close();
        return;
      }

      if (input === 'help') {
        console.log(chalk.yellow('\nAvailable commands:'));
        console.log('  encode <message> <carrier> - Encode hidden message');
        console.log('  decode <carrier> - Decode hidden message');
        console.log('  transform <type> <text> - Apply transformation');
        console.log('  analyze <text> - Analyze for steganography');
        console.log('  transforms - List all transformations');
        console.log('  techniques - List steganography techniques');
        console.log('  exit/quit - Exit interactive mode');
      } else if (input.startsWith('encode ')) {
        const parts = input.split(' ');
        if (parts.length >= 3) {
          const message = parts[1];
          const carrier = parts.slice(2).join(' ');
          try {
            const encoded = stego.encode(message, carrier);
            console.log(chalk.green('Encoded:'), encoded);
          } catch (error) {
            console.log(chalk.red('Error:'), error.message);
          }
        } else {
          console.log(chalk.red('Usage: encode <message> <carrier>'));
        }
      } else if (input.startsWith('decode ')) {
        const carrier = input.substring(7);
        try {
          const decoded = stego.decode(carrier);
          console.log(chalk.green('Decoded:'), decoded);
        } catch (error) {
          console.log(chalk.red('Error:'), error.message);
        }
      } else if (input.startsWith('transform ')) {
        const parts = input.split(' ');
        if (parts.length >= 3) {
          const type = parts[1];
          const text = parts.slice(2).join(' ');
          try {
            const transform = Transforms.getByName(type);
            if (transform) {
              const result = transform.encode(text);
              console.log(chalk.green('Transformed:'), result);
            } else {
              console.log(chalk.red(`Unknown transform: ${type}`));
            }
          } catch (error) {
            console.log(chalk.red('Error:'), error.message);
          }
        } else {
          console.log(chalk.red('Usage: transform <type> <text>'));
        }
      } else if (input === 'transforms') {
        console.log(chalk.yellow('\nAvailable transformations:'));
        Transforms.getAll().forEach(name => {
          const transform = Transforms.getByName(name);
          console.log(`  ${chalk.cyan(name)} - ${transform.name}`);
        });
      } else if (input === 'techniques') {
        console.log(chalk.yellow('\nAvailable techniques:'));
        stego.getTechniques().forEach(technique => {
          console.log(`  - ${chalk.cyan(technique)}`);
        });
      } else if (input !== '') {
        console.log(chalk.red(`Unknown command: ${input}`));
        console.log(chalk.yellow('Type "help" for available commands'));
      }

      rl.prompt();
    });

    rl.on('close', () => {
      console.log(chalk.cyan('\nGoodbye!'));
      process.exit(0);
    });
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
