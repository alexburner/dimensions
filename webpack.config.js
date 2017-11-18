const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.[hash].js',
    path: path.resolve(__dirname, 'docs'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [
      path.resolve(__dirname),
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/static/', to: '' },
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/static/index.html',
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['style.css'],
      append: false, // prepend
      // hash: true, // cache busting // doesn't work with gh-pages ???
    }),
  ],
};
