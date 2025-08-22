/**
 * CipherRecon Web Application
 * Browser-only JavaScript for the web interface
 * @module web-app
 */

// Initialize global namespace
window.CipherRecon = window.CipherRecon || {};

// Notification system
const NotificationSystem = {
  show(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.getElementById('notifications').appendChild(notification);

    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  },
};

// Utility functions
const Utils = {
  showOutput(elementId, content, type = 'success') {
    const output = document.getElementById(elementId);
    output.textContent = content;
    output.className = `output show ${type}`;
  },

  hideOutput(elementId) {
    const output = document.getElementById(elementId);
    output.classList.remove('show');
  },

  getInputValue(elementId) {
    return document.getElementById(elementId).value.trim();
  },

  validateInput(value, fieldName) {
    if (!value) {
      throw new Error(`${fieldName} is required`);
    }
    return value;
  },
};

// Steganography functions
const SteganographyHandler = {
  encode() {
    try {
      const message = Utils.validateInput(Utils.getInputValue('encodeMessage'), 'Message');
      const carrier = Utils.validateInput(Utils.getInputValue('encodeCarrier'), 'Carrier text');

      // Use the shared steganography module
      const stego = new window.Steganography();
      const encoded = stego.encode(message, carrier);

      Utils.showOutput('encodeOutput', encoded, 'success');
      NotificationSystem.show('Message encoded successfully!');

      // Copy to clipboard
      navigator.clipboard.writeText(encoded).then(() => {
        NotificationSystem.show('Encoded text copied to clipboard!');
      });
    } catch (error) {
      Utils.showOutput('encodeOutput', `Error: ${error.message}`, 'error');
      NotificationSystem.show(error.message, 'error');
    }
  },

  decode() {
    try {
      const carrier = Utils.validateInput(Utils.getInputValue('decodeCarrier'), 'Carrier text');

      // Use the shared steganography module
      const stego = new window.Steganography();
      const decoded = stego.decode(carrier);

      Utils.showOutput('decodeOutput', decoded, 'success');
      NotificationSystem.show('Message decoded successfully!');

      // Copy to clipboard
      navigator.clipboard.writeText(decoded).then(() => {
        NotificationSystem.show('Decoded message copied to clipboard!');
      });
    } catch (error) {
      Utils.showOutput('decodeOutput', `Error: ${error.message}`, 'error');
      NotificationSystem.show(error.message, 'error');
    }
  },

  analyze() {
    try {
      const text = Utils.validateInput(Utils.getInputValue('analyzeInput'), 'Text to analyze');

      // Use the shared steganography module
      const stego = new window.Steganography();
      const analysis = stego.analyze(text);

      const result = `
Analysis Results:
• Suspicious: ${analysis.suspicious ? 'YES' : 'NO'}
• Confidence: ${(analysis.confidence * 100).toFixed(1)}%
• Zero-width characters: ${analysis.zeroWidthCount}
• Variation selectors: ${analysis.variationSelectors}
• Suspicious patterns: ${analysis.suspiciousPatterns}
• Total suspicious: ${analysis.totalSuspicious}
      `.trim();

      Utils.showOutput('analyzeOutput', result, 'success');
      NotificationSystem.show('Analysis complete!');
    } catch (error) {
      Utils.showOutput('analyzeOutput', `Error: ${error.message}`, 'error');
      NotificationSystem.show(error.message, 'error');
    }
  },
};

// Transformation functions
const TransformHandler = {
  transform() {
    try {
      const text = Utils.validateInput(Utils.getInputValue('transformInput'), 'Input text');
      const type = Utils.getInputValue('transformType');
      const shouldDecode = document.getElementById('transformDecode').checked;

      let result;
      const transform = window.Transforms.getByName(type);

      if (!transform) {
        throw new Error(`Unknown transform: ${type}`);
      }

      if (shouldDecode && transform.decode) {
        result = transform.decode(text);
      } else {
        result = transform.encode(text);
      }

      Utils.showOutput('transformOutput', result, 'success');
      NotificationSystem.show('Transformation completed!');

      // Copy to clipboard
      navigator.clipboard.writeText(result).then(() => {
        NotificationSystem.show('Transformed text copied to clipboard!');
      });
    } catch (error) {
      Utils.showOutput('transformOutput', `Error: ${error.message}`, 'error');
      NotificationSystem.show(error.message, 'error');
    }
  },
};

// Global functions for HTML onclick handlers
window.encode = SteganographyHandler.encode;
window.decode = SteganographyHandler.decode;
window.transform = TransformHandler.transform;
window.analyze = SteganographyHandler.analyze;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  console.log('CipherRecon Web Application initialized');

  // Add keyboard shortcuts
  document.addEventListener('keydown', e => {
    // Ctrl+Enter to submit forms
    if (e.ctrlKey && e.key === 'Enter') {
      const activeElement = document.activeElement;
      if (activeElement.tagName === 'TEXTAREA') {
        const card = activeElement.closest('.tool-card');
        const button = card.querySelector('.btn-primary');
        if (button) {
          button.click();
        }
      }
    }
  });

  // Add copy buttons to outputs
  const outputs = document.querySelectorAll('.output');
  outputs.forEach(output => {
    const copyButton = document.createElement('button');
    copyButton.textContent = '📋 Copy';
    copyButton.className = 'copy-btn';
    copyButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: #333;
      color: #00ff41;
      border: 1px solid #00ff41;
      border-radius: 3px;
      padding: 2px 8px;
      font-size: 10px;
      cursor: pointer;
    `;

    copyButton.onclick = () => {
      navigator.clipboard.writeText(output.textContent);
      NotificationSystem.show('Copied to clipboard!');
    };

    output.style.position = 'relative';
    output.appendChild(copyButton);
  });

  // Add some example text
  document.getElementById('encodeMessage').placeholder = 'Enter your secret message here...';
  document.getElementById('encodeCarrier').placeholder =
    'This is the cover text that will contain your hidden message. Make it look natural and innocent.';
  document.getElementById('transformInput').placeholder =
    'Enter text to transform using various ciphers and encodings...';
  document.getElementById('analyzeInput').placeholder =
    'Paste suspicious text here to analyze for hidden steganographic content...';
});

// Export for testing
if (typeof window !== 'undefined' && window.module && window.module.exports) {
  window.module.exports = {
    NotificationSystem,
    Utils,
    SteganographyHandler,
    TransformHandler,
  };
}
