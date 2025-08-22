# 🔐 CIPHER-RECON v2.0.0

**Elite Red Team Toolkit for Advanced Text Intelligence & Steganography**

## 🚀 Quick Start

```bash
# Install
npm install

# Start API Server
npm start

# Run CLI
node src/cli/index.js --help

# Interactive Mode
node src/cli/index.js interactive
```

## 🎯 Features

- **Steganography**: Zero-width characters, emoji encoding, homoglyphs
- **Cryptography**: ROT13, Caesar, Base64, Hex, Binary
- **Analysis**: Detect hidden content, statistical analysis
- **Web Interface**: Modern dark theme with animations
- **CLI Tool**: Full-featured command line interface
- **REST API**: Automation-ready endpoints

## 📁 Structure

```
src/
├── api/      # REST API server
├── cli/      # Command-line tool
├── shared/   # Shared libraries
└── web/      # Web interface
```

## 💻 Usage Examples

```bash
# Encode secret message
node src/cli/index.js encode "secret" "cover text"

# Transform text
node src/cli/index.js transform rot13 "hello"

# Analyze for hidden content
node src/cli/index.js analyze "suspicious text"
```

## 🌐 API Endpoints

- `POST /api/encode` - Hide message
- `POST /api/decode` - Extract message
- `POST /api/transform` - Transform text
- `POST /api/analyze` - Analyze text
- `GET /api/health` - Health check

## ⚠️ Legal

For authorized security testing only. Users responsible for legal compliance.

---

Built with ❤️ by SkinzAI | *"In the shadows of text, secrets find their home"*
