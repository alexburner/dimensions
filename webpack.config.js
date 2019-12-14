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
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: 'babel-loader',
                  options: {
                      cacheDirectory: true,
                      presets: ['env'],
                      plugins: [[
                          require('babel-plugin-transform-runtime'),
                          { regenerator: true, polyfill: false },
                      ]],
                  },
              },
              {
                  loader: 'awesome-typescript-loader',
                  options: {
                      transpileOnly: false,
                      logLevel: 'info',
                      useBabel: true,
                      useCache: true,
                  },
              },
          ],
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
      assets: ['style.css?v=2'],
      append: false, // prepend
      // hash: true, // cache busting // doesn't work with gh-pages ???
    }),
  ],
};
