/**
 * Interactive Mode for CIPHER-RECON CLI
 * Enhanced terminal interface with autocomplete and history
 */

const readline = require('readline');
const chalk = require('chalk');
const ora = require('ora');

class InteractiveMode {
  constructor(stego, transforms) {
    this.stego = stego;
    this.transforms = transforms;
    this.history = [];
    this.commands = {
      help: this.showHelp,
      encode: this.encode,
      decode: this.decode,
      transform: this.transform,
      analyze: this.analyze,
      clear: this.clear,
      history: this.showHistory,
      exit: this.exit,
      quit: this.exit,
    };
  }

  start() {
    console.log(chalk.cyan('\n🚀 Starting CIPHER-RECON Interactive Mode...'));
    console.log(chalk.gray('Type "help" for commands, "exit" to quit\n'));

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.green('cipher-recon> '),
      completer: (line) => this.autocomplete(line),
    });

    this.rl.prompt();

    this.rl.on('line', (line) => {
      this.processCommand(line.trim());
    });

    this.rl.on('close', () => {
      console.log(chalk.cyan('\n👋 Goodbye! Stay stealthy.'));
      process.exit(0);
    });
  }

  processCommand(input) {
    if (!input) {
      this.rl.prompt();
      return;
    }

    this.history.push(input);
    const [command, ...args] = input.split(' ');
    const handler = this.commands[command.toLowerCase()];

    if (handler) {
      handler.call(this, args.join(' '));
    } else {
      console.log(chalk.red(`Unknown command: ${command}`));
      console.log(chalk.gray('Type "help" for available commands'));
    }

    this.rl.prompt();
  }

  autocomplete(line) {
    const completions = Object.keys(this.commands);
    const hits = completions.filter((c) => c.startsWith(line));
    return [hits.length ? hits : completions, line];
  }

  showHelp() {
    console.log(chalk.yellow('\n📚 Available Commands:\n'));
    console.log(chalk.white('  encode <message> <carrier>') + chalk.gray(' - Hide a message'));
    console.log(chalk.white('  decode <carrier>') + chalk.gray(' - Extract hidden message'));
    console.log(chalk.white('  transform <type> <text>') + chalk.gray(' - Apply transformation'));
    console.log(chalk.white('  analyze <text>') + chalk.gray(' - Analyze for steganography'));
    console.log(chalk.white('  history') + chalk.gray(' - Show command history'));
    console.log(chalk.white('  clear') + chalk.gray(' - Clear screen'));
    console.log(chalk.white('  help') + chalk.gray(' - Show this help'));
    console.log(chalk.white('  exit/quit') + chalk.gray(' - Exit interactive mode\n'));
  }

  encode(args) {
    const parts = args.match(/["']([^"']+)["']|(\S+)/g);
    if (!parts || parts.length < 2) {
      console.log(chalk.red('Usage: encode "message" "carrier text"'));
      return;
    }

    const message = parts[0].replace(/["']/g, '');
    const carrier = parts.slice(1).join(' ').replace(/["']/g, '');

    const spinner = ora('Encoding message...').start();
    try {
      const encoded = this.stego.encode(message, carrier);
      spinner.succeed(chalk.green('Message encoded successfully!'));
      console.log(chalk.cyan('Encoded text:'));
      console.log(encoded);
    } catch (error) {
      spinner.fail(chalk.red(`Encoding failed: ${error.message}`));
    }
  }

  decode(args) {
    if (!args) {
      console.log(chalk.red('Usage: decode "carrier text with hidden message"'));
      return;
    }

    const carrier = args.replace(/["']/g, '');
    const spinner = ora('Decoding message...').start();

    try {
      const decoded = this.stego.decode(carrier);
      spinner.succeed(chalk.green('Message decoded successfully!'));
      console.log(chalk.cyan('Hidden message:'));
      console.log(decoded);
    } catch (error) {
      spinner.fail(chalk.red(`Decoding failed: ${error.message}`));
    }
  }

  transform(args) {
    const parts = args.split(' ');
    if (parts.length < 2) {
      console.log(chalk.red('Usage: transform <type> <text>'));
      console.log(chalk.gray('Available: rot13, caesar, base64, hex, binary, reverse'));
      return;
    }

    const type = parts[0];
    const text = parts.slice(1).join(' ');

    try {
      const transform = this.transforms.getByName(type);
      if (!transform) {
        console.log(chalk.red(`Unknown transform: ${type}`));
        return;
      }

      const result = transform.encode(text);
      console.log(chalk.green(`${transform.name} result:`));
      console.log(result);
    } catch (error) {
      console.log(chalk.red(`Transform failed: ${error.message}`));
    }
  }

  analyze(args) {
    if (!args) {
      console.log(chalk.red('Usage: analyze "text to analyze"'));
      return;
    }

    const text = args.replace(/["']/g, '');
    const spinner = ora('Analyzing text...').start();

    try {
      const analysis = this.stego.analyze(text);
      spinner.succeed(chalk.green('Analysis complete!'));

      console.log(chalk.yellow('\n📊 Analysis Results:'));
      console.log(`  Suspicious: ${analysis.suspicious ? chalk.red('YES') : chalk.green('NO')}`);
      console.log(`  Confidence: ${chalk.cyan((analysis.confidence * 100).toFixed(1) + '%')}`);
      console.log(`  Zero-width chars: ${chalk.white(analysis.zeroWidthCount)}`);
      console.log(`  Variation selectors: ${chalk.white(analysis.variationSelectors)}`);
      console.log(`  Suspicious patterns: ${chalk.white(analysis.suspiciousPatterns)}`);
      console.log(`  Total suspicious: ${chalk.white(analysis.totalSuspicious)}\n`);
    } catch (error) {
      spinner.fail(chalk.red(`Analysis failed: ${error.message}`));
    }
  }

  showHistory() {
    if (this.history.length === 0) {
      console.log(chalk.gray('No command history'));
      return;
    }

    console.log(chalk.yellow('\n📜 Command History:\n'));
    this.history.forEach((cmd, index) => {
      console.log(chalk.gray(`  ${index + 1}.`) + ' ' + cmd);
    });
    console.log();
  }

  clear() {
    console.clear();
    console.log(chalk.cyan('CIPHER-RECON Interactive Mode'));
    console.log(chalk.gray('Type "help" for commands\n'));
  }

  exit() {
    this.rl.close();
  }
}

module.exports = InteractiveMode;
