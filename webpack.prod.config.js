const path = require('path');

module.exports = {
  entry: './src/web/js/app.js',
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: 'production',
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared/'),
      '@web': path.resolve(__dirname, 'src/web/')
    }
  },
  optimization: {
    minimize: true
  }
};
