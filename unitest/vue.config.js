const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir: 'dist',
    productionSourceMap: false,
    runtimeCompiler: true,
    chainWebpack: config => {
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item
            .use('sass-resources-loader')
            .loader('sass-resources-loader')
            .options({
                // Provide path to the file with resources
                resources: './src/styles/base/_mixins.scss'
            })
            .end()
        })
    },
    devServer: {
        port: 8080,
        host: '0.0.0.0',
        https: false,
        open: true
        // proxy: proxyConfig
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@views': path.resolve(__dirname, 'src/views'),
                '@store': path.resolve(__dirname, 'src/store'),
                '@assets': path.resolve(__dirname, 'src/assets'),
            }
        },
    },
};
