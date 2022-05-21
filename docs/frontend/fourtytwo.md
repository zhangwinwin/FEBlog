---
theme: condensed-night-purple
highlight: atom-one-dark
---
## 前言
最近我在公司开发一个组件库，组件库中有自己的图片、icon和字体等静态资源。打包出去之后，在项目上使用时发现组件库的静态资源加载不了。

在这个组件库盛行的时代，这个问题应该是具有普遍性的，但在搜索引擎上却寥寥无几（估计是开发组件库的大神们不觉得这是一个问题）。所以我记录下来分享给大家，避免踩坑。

## loader
webpack是一个现代的JavaScript的静态模块打包器，webpack打包时只能直接处理JavaScript之间的依赖关系。所以任何非JavaScript文件都必须被预先处理转换为JavaScript代码，这样才能参与打包。

而实现这一功能的就是**loader**。

### file-loader
file-loader的作用是指示webpack将所需的对象作为文件发出并返回其公共URL。默认情况下，生成的文件的文件名就是文件内容的MD5哈希值并会保留所引用资源的原始扩展名。

file-loader还可以指定要复制和放置资源文件的位置，以及使用hashName为图片命名以获得更好的缓存。
```js
import img from './file.png'
```
在webpack.config.js中配置
```js
module.exports = {
  module: {
    rules: [
      {
        test: /.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  }
}
```
生成文件file.png，输出到输出目录并返回公共URL。
```js
"/publicPath/0dcbbaa7013869e351f.png"
```

**深入原理**  
在使用`import/require`引入图片是为了得到图片的路径，并且同时把图片放到打包文件夹中。webpack使用`fs.readFile`同步读取文件中的内容做相应的解析处理，默认只支持js和json文件类型，所以导入其他的文件类型就会发生错误。

有了file-loader后，wepback就会读取配置`/.(png|jpg|gif)$/`将`.png\jpg\gif`结尾的文件使用file-loader来处理，那么就会把`import('./file.png')`通过特定的语法解析成一个路径`0dcbbaa7013869e351f.png`

**publicPath**  
从输出的url结构来看：
```js
"/publicPath/0dcbbaa7013869e351f.png"
```
有两部分组成：
* publicPath
* file.png经过file-loader处理之后的路径：0dcbbaa7013869e351f.png
**问题：为什么要加上publicPath？**

一般而言，我们使用webpack打包通常会将不同类型的文件打包到不同的文件夹中，比如静态资源通常会放在assets文件夹中，如果不配置publicPath，那么就会直接访问`/0dcbbaa7013869e351f.png`，这时会找不到这个图片资源。

通过配置
```js
output.publicPath = './assets'
```
最终会访问`./assets/0dcbbaa7013869e351f.png`，才能访问到正确的图片资源。

**问题解决了吗**  
对于项目开发而言，一般配置到这就可以正确的访问到静态资源。这也是网上对于静态资源配置的绝大部分解决方案。

但现在的问题是，在项目中加载第三方组件库时，找不到第三方组件库的静态资源。单独访问组件库时，是可以正常加载（也就是使用上面说的配置），但在项目中加载组件库时，却无法正常加载！
  
原因猜测：在项目中引用的组件库文件是已经打包后的文件，也就是说图片资源已经经过了`import/require`处理之后的路径，所以在项目中引用时路径是没有变化的。

## 解决方案1: url-loader
`import('./file.png')`只是得到图片的路径，并非将图片加载到js文件中。所以第一个可行的方法就是：将图片内嵌进js文件中，这时候就用到`url-loader`。

url-loader的作用是允许有条件的将文件转换为内联的base64编码的URL（当文件小于给定的阈值）。如果文件大于该阈值，则交给file-loader处理。所以url-loader是一个有特殊功能的file-loader。
```js
import img from './image.png'
```
在webpack.config.js中配置如下：
```js
rules: [
  {
    test: /.(png|jpg|gif)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      }
    ]
  }
]
```
配置也和file-loader类似，加多了一个配置项：limit。如果文件大于限制（也就是limit的值，单位是字节），则默认使用file-loader并将查询参数传递给它，默认是无限制。

只要设置一个大的limit阈值，将所有图片都变成base64编码格式。这样就能够在项目上加载组件库的图片资源，同时可以减少http请求，一举两得！

缺点就是一些大的图片转换时间变长，而且会导致文件的体积变大，因为大图片的base64编码是相当大的。

上述的解决方法是针对wepback5之前的。file-loader与url-loader如此实用，以至于wepback5已经将两个loader内置在webpack中了。

### webpack5
webpack5添加了4中新的模块类型，来替换file-loader、row-loader和url-loader。
* assets/resource发送一个单独的文件并导出URL-也就是file-loader的功能
* assets/inline导出一个资源的dataURI-也就是url-loader的功能。
* assets/source导出资源的源代码-也就是raw-loader的功能
* assets在导出一个dataURI和发送一个单独的文件之间自动选择-也就是配置

**使用assets/inline**  
```js
rules: [
  {
    test: /.svg/,
    type: 'asset/inline',
  }
]
```
将所有svg文件都转换为base64格式的URL。  

如果要使用自定义编码算法，则可以指定一个自定义函数来编码文件内容：
```js
const svgToMiniDataURI = require('mini-svg-data-uri');

module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.svg/,
        type: 'asset/inline',
        generator: {
          dataUrl: content => {
            content = content.toString();
            return svgToMiniDataURI(content);
          }
        }
      }
    ]
  },
};
```
**使用assets**  
webpack会自动地在resource和inline之间进行选择，默认阈值是8kb。小于8kb的文件，将视为inline模块类型，否则会被视为resource模块类型。

当然阈值可以通过`Rule.parser.dataUrlCondition.maxSize`选项来修改此条件。
```js
rules: [
  {
    test: /.(png|jpg|gif)$/,
    type: 'asset',
    parser: {
        dataUrlCondition: {
            maxSize: 10 * 1024 // 10kb
        }
  }
]
```

## 解决方案2: mini-css-extract-plugin
第二种解决方案：分离组件库css文件，在项目中引用组件库的css文件。这样一来就项目的webpack就能知道静态资源的依赖路径。

该插件只能用于webpack4及之后的版本，功能是将css提取到单独的文件中，为每个包含css的js文件创建一个css文件，并且支持css和SourceMaps的按需加载。

所以该插件是于`style-loader`的作用是相反的，而且配置也有点特殊，需要同时配置loader和plugin

使用`mini-css-extract-plugin`需要注意两点：
* 注意版本：如果在webpack4使用最新版本会报错`Invaild value used in weak set`，这是因为最新版本为2.+，是配合webpack5使用的。在webpack4使用需要降低版本到1.+。
* 不将`style-loader`和`mini-css-extract-plugin`同时使用。在生产模式下使用`mini-css-extract-plugin`，在开发模式下使用`style-loader`。
配置如下：
```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
};
```

## 总结
以上两种方法都能解决这个问题，如果还有其他方法，请在评论区告知！

创作不易，烦请动动手指点一点赞。

[楼主github](https://github.com/zhangwinwin/FEBlog/), 如果喜欢请点一下star,对作者也是一种鼓励。