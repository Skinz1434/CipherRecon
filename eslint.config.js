module.exports = [
  // Default config (applies to all files unless overridden)
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        module: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      semi: ['error', 'always'],
      'no-console': 'warn',
      'no-trailing-spaces': 'error',
      indent: ['error', 2],
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
    },
  },

  // Node.js (CLI and API)
  {
    files: ['src/cli/**/*.js', 'src/api/**/*.js', 'webpack*.js', 'scripts/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        // Node globals
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
  },

  // Browser (Web)
  {
    files: ['src/web/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        ClipboardItem: 'readonly',
        TextEncoder: 'readonly',
        atob: 'readonly',
        btoa: 'readonly',
        Intl: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        alert: 'readonly',
        MutationObserver: 'readonly',
        switchTab: 'writable',
        showAbout: 'writable',
        showHelp: 'writable',
      },
    },
  },

  // Shared (UMD-compatible)
  {
    files: ['src/shared/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        // UMD / cross-env globals
        define: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        require: 'readonly',
        self: 'readonly',
        window: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        Intl: 'readonly',
        console: 'readonly',
        atob: 'readonly',
        btoa: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
  },
];
