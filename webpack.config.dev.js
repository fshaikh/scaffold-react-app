const merge = require('webpack-merge');
const BaseConfig = require('./webpack.config.base');

module.exports = merge(BaseConfig, {
    mode: 'development',
    devServer: {
        port: 3030
    },
    module: {
        rules: [
            {
                test: /\.(pdf|jpg|png|gif|svg|ico)$/,
                use: [
                    {
                        loader: 'url-loader'
                    },
                ]
            }
        ]

    },
    devtool: 'source-map'
});