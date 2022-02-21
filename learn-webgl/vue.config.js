module.exports = {
    chainWebpack: config => {
        config.module
        .rule('webgl')
        .test(/\.(glsl|vs|fs|vert|frag)$/)
        .exclude
            .add(/node_modules/)
            .end()
        .use('raw-loader')
            .loader('raw-loader')
            .end()
        .use('glslify-loader')
            .loader('glslify-loader')
            .end()
    }
}