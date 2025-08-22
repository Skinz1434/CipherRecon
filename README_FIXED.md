# CIPHER-RECON - Fixed Codebase

## 🎯 **COMPREHENSIVE RECONSTRUCTION COMPLETE**

This codebase has been completely reconstructed with proper separation of concerns, consistent 2-space indentation, and cross-environment compatibility.

## 📁 **New Directory Structure**

```
cipher-recon/
├── src/
│   ├── cli/           # Node.js CLI application
│   │   └── index.js   # CLI entry point
│   ├── web/           # Browser web interface
│   │   ├── js/        # Browser JavaScript
│   │   ├── css/       # Stylesheets
│   │   └── index.html # Landing page
│   ├── shared/        # Shared logic (UMD pattern)
│   │   ├── transforms.js
│   │   ├── steganography.js
│   │   └── emojiLibrary.js
│   └── api/           # API server
│       └── server.js
├── dist/              # Build output
├── tests/             # Test files
├── .eslintrc.json     # ESLint configuration
├── .prettierrc        # Prettier configuration
└── package.json       # NPM configuration
```

## ✅ **Issues Resolved**

- **Indentation**: Fixed from mixed tabs/spaces to consistent 2-space indentation
- **Environment Separation**: Clear separation between Node.js and browser code
- **Module Imports**: Proper UMD pattern for cross-environment compatibility
- **Dependencies**: Added missing packages and proper versioning
- **Code Quality**: ESLint and Prettier configuration for consistent formatting
- **Structure**: Organized code into logical, maintainable modules

## 🚀 **Quick Start**

### 1. Install Dependencies
```bash
npm install
```

### 2. Test CLI Tool
```bash
# Show help
node src/cli/index.js --help

# Test transformation
node src/cli/index.js transform rot13 "Hello World"

# Test steganography
node src/cli/index.js encode "secret" "cover text"
node src/cli/index.js decode "cover text with hidden message"
```

### 3. Start API Server
```bash
# Start server
node src/api/server.js

# Test API
curl http://localhost:3001/api/health
```

### 4. Serve Web Interface
```bash
# Install http-server globally
npm install -g http-server

# Serve web interface
http-server src/web -p 8080

# Open http://localhost:8080 in browser
```

## 🛠️ **Available Commands**

### CLI Commands
- `encode <message> <carrier>` - Hide message in carrier text
- `decode <carrier>` - Extract hidden message
- `transform <type> <text>` - Apply text transformation
- `analyze <text>` - Analyze for steganographic content
- `transforms` - List available transformations
- `techniques` - List steganography techniques
- `server` - Start API server
- `interactive` - Interactive mode

### Transformations Available
- **ROT13** - Self-inverse substitution cipher
- **Caesar Cipher** - Shift cipher with configurable shift
- **Atbash** - Self-inverse substitution cipher
- **Base64** - Base64 encoding/decoding
- **Hexadecimal** - Hex encoding/decoding
- **Binary** - Binary encoding/decoding
- **Upside Down** - Visual text flipping
- **Reverse** - Text reversal

### Steganography Techniques
- **Zero-Width Characters** - Using Unicode variation selectors
- **Variation Selectors** - Unicode presentation forms
- **Unicode Tags** - Invisible Unicode blocks
- **Whitespace** - Space and tab manipulation
- **Homoglyphs** - Similar-looking characters

## 🌐 **Web Interface Features**

- **Modern Dark Theme** - Professional cybersecurity aesthetic
- **Real-time Processing** - Instant encoding/decoding
- **Copy to Clipboard** - Easy result sharing
- **Keyboard Shortcuts** - Ctrl+Enter to submit
- **Responsive Design** - Works on all devices
- **Error Handling** - User-friendly error messages

## 🔧 **Development**

### Code Quality
```bash
# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Building
```bash
# Build web application
npm run build

# Build CLI tool
npm run build:cli
```

## 📊 **API Endpoints**

- `POST /api/encode` - Encode hidden message
- `POST /api/decode` - Decode hidden message
- `POST /api/transform` - Apply transformation
- `POST /api/analyze` - Analyze text
- `GET /api/health` - Server health check
- `GET /api/transforms` - List transformations
- `GET /api/techniques` - List techniques

## 🔒 **Security Features**

- **Rate Limiting** - 100 requests per 15 minutes
- **Security Headers** - Helmet.js protection
- **CORS Configuration** - Controlled cross-origin access
- **Input Validation** - Strict parameter checking
- **Error Handling** - No information leakage

## 🧪 **Testing**

```bash
# Run tests
npm test

# Test specific functionality
node src/cli/index.js transform base64 "test"
node src/cli/index.js encode "test" "carrier"
```

## 📈 **Performance**

- **Optimized Algorithms** - Efficient text processing
- **Memory Management** - Proper cleanup and optimization
- **Async Operations** - Non-blocking I/O
- **Caching** - Intelligent result caching

## 🌟 **Key Improvements Made**

1. **Consistent Indentation**: All files now use 2-space indentation
2. **Environment Separation**: Clear Node.js vs browser code separation
3. **UMD Pattern**: Shared modules work in both environments
4. **Error Handling**: Comprehensive error handling throughout
5. **Code Quality**: ESLint and Prettier for consistent formatting
6. **Documentation**: Clear inline documentation and examples
7. **Modularity**: Well-organized, maintainable code structure
8. **Cross-Platform**: Works on Windows, macOS, and Linux

## 🎉 **Status: PRODUCTION READY**

The codebase is now fully functional with:
- ✅ Working CLI tool
- ✅ Working API server
- ✅ Working web interface
- ✅ Consistent code quality
- ✅ Proper error handling
- ✅ Security best practices
- ✅ Cross-environment compatibility

## 📞 **Support**

For issues or questions:
1. Check the CLI help: `node src/cli/index.js --help`
2. Review the API documentation
3. Check the console for error messages
4. Verify all dependencies are installed

---

**"In the shadows of text, secrets find their home"** - CIPHER-RECON Team
