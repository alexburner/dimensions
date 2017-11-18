const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {

    entry: './src/index.tsx',
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, 'docs'),
    },

    devtool: 'cheap-module-source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        modules: [
            path.resolve(__dirname),
            'node_modules',
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
        }),
    ],

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
        ],
    },

};
