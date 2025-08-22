/**
 * Browser-only Transforms Library
 * Exposes window.Transforms with encode/decode helpers
 */
(function () {
  'use strict';

  const Transforms = {
    base64: {
      name: 'Base64',
      encode: function (text) {
        return btoa(unescape(encodeURIComponent(text)));
      },
      decode: function (text) {
        return decodeURIComponent(escape(atob(text)));
      },
    },

    hex: {
      name: 'Hexadecimal',
      encode: function (text) {
        return Array.from(text)
          .map(ch => ch.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('');
      },
      decode: function (text) {
        return (text.match(/.{1,2}/g) || [])
          .map(byte => String.fromCharCode(parseInt(byte, 16)))
          .join('');
      },
    },

    binary: {
      name: 'Binary',
      encode: function (text) {
        return Array.from(text)
          .map(ch => ch.charCodeAt(0).toString(2).padStart(8, '0'))
          .join('');
      },
      decode: function (text) {
        return (text.match(/.{1,8}/g) || [])
          .map(byte => String.fromCharCode(parseInt(byte, 2)))
          .join('');
      },
    },

    rot13: {
      name: 'ROT13',
      encode: function (text) {
        return text.replace(/[a-zA-Z]/g, function (char) {
          const offset = char <= 'Z' ? 65 : 97;
          return String.fromCharCode(((char.charCodeAt(0) - offset + 13) % 26) + offset);
        });
      },
      decode: function (text) {
        return this.encode(text);
      },
    },

    caesar: {
      name: 'Caesar Cipher',
      encode: function (text, shift = 3) {
        return text.replace(/[a-zA-Z]/g, function (char) {
          const offset = char <= 'Z' ? 65 : 97;
          return String.fromCharCode(((char.charCodeAt(0) - offset + shift) % 26) + offset);
        });
      },
      decode: function (text, shift = 3) {
        return this.encode(text, 26 - shift);
      },
    },

    atbash: {
      name: 'Atbash',
      encode: function (text) {
        return text.replace(/[a-zA-Z]/g, function (char) {
          const isUpper = char <= 'Z';
          const offset = isUpper ? 65 : 97;
          const newCode = 25 - (char.charCodeAt(0) - offset) + offset;
          return String.fromCharCode(newCode);
        });
      },
      decode: function (text) {
        return this.encode(text);
      },
    },

    upsideDown: {
      name: 'Upside Down',
      map: {
        a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ',
        j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ',
        s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
        A: '∀', B: 'B', C: 'Ɔ', D: 'D', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I',
        J: 'ſ', K: 'K', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Q', R: 'R',
        S: 'S', T: '┴', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
        0: '0', 1: 'Ɩ', 2: 'ᄅ', 3: 'Ɛ', 4: 'ㄣ', 5: 'ϛ', 6: '9', 7: 'ㄥ', 8: '8', 9: '6',
        '.': '˙', ',': '\'', '?': '¿', '!': '¡', '"': ',,', '\'': ',', '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<',
        '&': '⅋', _: '‾',
      },
      encode: function (text) {
        return [...text].map(c => this.map[c] || c).reverse().join('');
      },
      decode: function (text) {
        const reverseMap = {};
        for (const [k, v] of Object.entries(this.map)) reverseMap[v] = k;
        return [...text].map(c => reverseMap[c] || c).reverse().join('');
      },
    },

    reverse: {
      name: 'Reverse',
      encode: function (text) {
        return text.split('').reverse().join('');
      },
      decode: function (text) {
        return this.encode(text);
      },
    },

    getAll: function () {
      return Object.keys(this).filter(k => !['getAll', 'getByName'].includes(k));
    },
    getByName: function (name) {
      return this[name] || null;
    },
  };

  window.Transforms = Transforms;
})();
