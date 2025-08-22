/**
 * CipherRecon Steganography Engine
 * Advanced text steganography with multiple techniques
 * @module steganography
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Steganography = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STEG_DEFAULTS = {
    bitZeroVS: '\uFE0E', // VS15 as 0
    bitOneVS: '\uFE0F', // VS16 as 1
    initialPresentation: 'emoji',
    trailingZw: '\u200B',
    interBitZw: null,
    interBitEvery: 1,
    bitOrder: 'msb',
  };

  class Steganography {
    constructor(options = {}) {
      this.config = { ...STEG_DEFAULTS, ...options };
    }

    /**
     * Encode a message into carrier text
     * @param {string} message - Message to hide
     * @param {string} carrier - Carrier text
     * @returns {string} Text with hidden message
     */
    encode(message, carrier) {
      if (!message || !carrier) {
        throw new Error('Message and carrier are required');
      }

      const binary = this.textToBinary(message);
      return this.embedBinary(binary, carrier);
    }

    /**
     * Decode a hidden message from carrier text
     * @param {string} carrier - Text containing hidden message
     * @returns {string} Extracted message
     */
    decode(carrier) {
      if (!carrier) {
        throw new Error('Carrier text is required');
      }

      const binary = this.extractBinary(carrier);
      return this.binaryToText(binary);
    }

    /**
     * Convert text to binary string
     * @param {string} text - Input text
     * @returns {string} Binary representation
     */
    textToBinary(text) {
      return text
        .split('')
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('');
    }

    /**
     * Convert binary string to text
     * @param {string} binary - Binary string
     * @returns {string} Decoded text
     */
    binaryToText(binary) {
      const bytes = binary.match(/.{1,8}/g) || [];
      return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
    }

    /**
     * Embed binary data into carrier text
     * @param {string} binary - Binary data to embed
     * @param {string} carrier - Carrier text
     * @returns {string} Modified carrier text
     */
    embedBinary(binary, carrier) {
      let result = carrier;

      // Add zero-width characters for each bit
      for (let i = 0; i < binary.length; i++) {
        const bit = binary[i];
        const char = bit === '0' ? this.config.bitZeroVS : this.config.bitOneVS;
        result += char;
      }

      return result;
    }

    /**
     * Extract binary data from carrier text
     * @param {string} carrier - Text containing hidden data
     * @returns {string} Extracted binary data
     */
    extractBinary(carrier) {
      const regex = new RegExp(`[${this.config.bitZeroVS}${this.config.bitOneVS}]`, 'g');
      const matches = carrier.match(regex) || [];

      return matches.map(char => (char === this.config.bitZeroVS ? '0' : '1')).join('');
    }

    /**
     * Analyze text for potential steganographic content
     * @param {string} text - Text to analyze
     * @returns {Object} Analysis results
     */
    analyze(text) {
      const zeroWidthCount = (text.match(/[\u200B-\u200D\uFEFF]/g) || []).length;
      const variationSelectors = (text.match(/[\uFE00-\uFE0F]/g) || []).length;
      const suspiciousPatterns = (text.match(/[\uE0000-\uE007F]/g) || []).length;

      const totalSuspicious = zeroWidthCount + variationSelectors + suspiciousPatterns;
      const confidence = Math.min(totalSuspicious / 10, 1.0);

      return {
        suspicious: totalSuspicious > 0,
        confidence: confidence,
        zeroWidthCount: zeroWidthCount,
        variationSelectors: variationSelectors,
        suspiciousPatterns: suspiciousPatterns,
        totalSuspicious: totalSuspicious,
      };
    }

    /**
     * Get available steganography techniques
     * @returns {Array} List of technique names
     */
    getTechniques() {
      return ['zero-width', 'variation-selectors', 'unicode-tags', 'whitespace', 'homoglyphs'];
    }
  }

  return Steganography;
});
