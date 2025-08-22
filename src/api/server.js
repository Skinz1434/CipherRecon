/**
 * CipherRecon API Server
 * Professional REST API for text intelligence and steganography operations
 * @module api-server
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

// Import shared modules
const Steganography = require('../shared/steganography');
const Transforms = require('../shared/transforms');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['\'self\''],
        styleSrc: ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
        fontSrc: ['\'self\'', 'https://fonts.gstatic.com'],
        scriptSrc: ['\'self\'', 'https://cdn.jsdelivr.net'],
        imgSrc: ['\'self\'', 'data:', 'https:'],
      },
    },
  }),
);

// Rate limiting for API endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Try again later.',
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration for security
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com'] // Replace with your domain
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the web directory
app.use(express.static(path.join(__dirname, '../web')));

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Initialize services
const stego = new Steganography();

// API Routes
app.post('/api/encode', (req, res) => {
  try {
    const { message, carrier, technique = 'zero-width' } = req.body;

    if (!message || !carrier) {
      return res.status(400).json({
        success: false,
        error: 'Message and carrier are required',
      });
    }

    const encoded = stego.encode(message, carrier);
    res.json({
      success: true,
      encoded,
      technique,
      metadata: {
        originalLength: message.length,
        carrierLength: carrier.length,
        encodedLength: encoded.length,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

app.post('/api/decode', (req, res) => {
  try {
    const { carrier } = req.body;

    if (!carrier) {
      return res.status(400).json({
        success: false,
        error: 'Carrier text is required',
      });
    }

    const decoded = stego.decode(carrier);
    res.json({
      success: true,
      decoded,
      metadata: {
        carrierLength: carrier.length,
        decodedLength: decoded.length,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

app.post('/api/transform', (req, res) => {
  try {
    const { text, type, options = {} } = req.body;

    if (!text || !type) {
      return res.status(400).json({
        success: false,
        error: 'Text and transformation type are required',
      });
    }

    let result;
    switch (type) {
    case 'rot13':
      result = Transforms.rot13.encode(text);
      break;
    case 'caesar':
      result = Transforms.caesar.encode(text, options.shift || 3);
      break;
    case 'atbash':
      result = Transforms.atbash.encode(text);
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
      throw new Error(`Unknown transform: ${type}`);
    }

    res.json({
      success: true,
      result,
      type,
      metadata: {
        originalLength: text.length,
        resultLength: result.length,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

app.post('/api/analyze', (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text to analyze is required',
      });
    }

    const analysis = stego.analyze(text);
    res.json({
      success: true,
      analysis,
      metadata: {
        textLength: text.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Get available transforms
app.get('/api/transforms', (req, res) => {
  try {
    const transforms = Transforms.getAll();
    res.json({
      success: true,
      transforms: transforms.map(name => ({
        name,
        ...Transforms.getByName(name),
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get available steganography techniques
app.get('/api/techniques', (req, res) => {
  try {
    const techniques = stego.getTechniques();
    res.json({
      success: true,
      techniques,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'POST /api/encode',
      'POST /api/decode',
      'POST /api/transform',
      'POST /api/analyze',
      'GET /api/health',
      'GET /api/transforms',
      'GET /api/techniques',
    ],
  });
});

// Error handler
app.use((error, req, res) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   CIPHER-RECON API Server Started    ║
║   Port: ${PORT}                      ║
║   Mode: ${process.env.NODE_ENV || 'development'}     ║
╚═══════════════════════════════════════╝
  `);
});

module.exports = app;
