const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new WorkboxWebpackPlugin.GenerateSW(),
    ],
})