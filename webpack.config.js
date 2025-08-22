
/* eslint-env node */
const path = require('path');

module.exports = {
  entry: './src/web/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared/'),
      '@web': path.resolve(__dirname, 'src/web/'),
    },
  },
  optimization: {
    minimize: false,
  },
};
