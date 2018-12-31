const merge = require('webpack-merge');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const BaseConfig = require('./webpack.config.base');

module.exports = merge(BaseConfig, {
    mode: 'production',
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'appBundle_Analyzer.html'
        })
    ]
});