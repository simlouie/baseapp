const JavaScriptObfuscator = require('webpack-obfuscator');
const webpack = require('webpack');

module.exports = function override(config, env) {
    if (!config.plugins) {
        config.plugins = [new webpack.DefinePlugin({'process.env.EXPIRATION_TIME': JSON.stringify(process.env.EXPIRATION_TIME)})];
    } else {
        config.plugins.push(new webpack.DefinePlugin({'process.env.EXPIRATION_TIME': JSON.stringify(process.env.EXPIRATION_TIME)}));
    }

    if (process.env.NODE_ENV === 'production') {
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'commons',
                filename: 'commons.js',
                minChunks: module => /node_modules/.test(module.resource)
            })
        );

        const domain = process.env.BUILD_DOMAIN ? process.env.BUILD_DOMAIN.split(',') : [];

        config.plugins.push(
            new JavaScriptObfuscator({rotateUnicodeArray: true, domainLock: domain}, ['commons.js'])
        );
    }

    return config;
};
