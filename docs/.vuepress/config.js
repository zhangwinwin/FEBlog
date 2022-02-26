const path = require('path');
const fs = require('fs');

// const webglFolder = path.join(__dirname, '../webgl');

// const webgl = fs.readdirSync(webglFolder).filter(md => md !== 'README.md');

const frontendFolder = path.join(__dirname, '../frontend')

const networkFolder = path.join(__dirname, '../network')

const frontend = fs.readdirSync(frontendFolder).filter(md => md !== 'README.md')

const network = fs.readdirSync(networkFolder).filter(md => md !== 'README.md')

module.exports = {
    title: "zhangwinwin's blog",
    description: 'some technical articles on programming, especially webgl',
    head: [
        ['link', {rel:'stylesheet', href:'https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css'}],
        ['link', {rel:'stylesheet', href:'https://gitcdn.xyz/cdn/goessner/markdown-it-texmath/master/texmath.css'}],
        ['script', {src: 'https://github.com/markdown-it/markdown-it/blob/master/bin/markdown-it.js'}],
        ['script', {src: 'https://gitcdn.xyz/cdn/goessner/markdown-it-texmath/master/texmath.js'}],
        ['script', {src: 'https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.js'}],
    ],
    markdown: {
        lineNumbers: true,
        anchor: { permalink: false },
        toc: {includeLevel: [1,2]},
        extendMarkdown: md => {
          md.use(require('markdown-it-texmath'))
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                vue: 'vue/dist/vue.common.js'
            }
        }
    },
    themeConfig: {
        sidebar: {
            '/webgl/': [
                'one',
                'two',
                'three',
                'four'
            ],
        },
        nav: [
            { text: 'Intro', link: '/'},
            { text: 'Webgl', link: '/webgl/' },
            { text: 'Frontend', link: '/frontend/' },
            { text: 'Network', link: '/network/' },
            { text: 'github', link: 'https://github.com/zhangwinwin/FEBlog'}
        ]
    }
}