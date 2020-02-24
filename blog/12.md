## 前言
平时进行开发大多数是基于vue-cli或者create-react-app等官方或者公司内部搭建的脚手架。  

我们业务仔做的最多就是npm i和npm run dev或者npm start，然后在router文件夹上添加路由，在views或者pages文件夹中添加业务页面。这种快速开发对公司当然是好事，但对于开发人员来说对项目里的webpack封装和配置了解的不清楚，出问题时很容易会不知如何解决，或者不会通过webpack去扩展新功能和优化编译速度。出去是没多大竞争力的，而且很容易被替代。  

接下来一步一步的演示如何搭建基于TypeScript与React的一个开发环境。

项目代码：https://github.com/zhangwinwin/ts-react-starter  
(会不定时更新)

## 1、搭建webpack的基础环境
[webpack](https://www.webpackjs.com/)是一个开源的JavaScript模块打包工具，其核心是解决模块之间的依赖，把各个模块按照特定的规则和顺序组织在一起，最终合并为一个JS文件（有时会有多个）。这个过程就叫作模块打包。  

Webpack就好比一个模块处理工厂，我们把源代码交给Webpack，由它进行加工、拼装处理，产出最终的资源文件，等待送往客户。  

### 1.1、项目初始化
运行npm init会生成一个package.json文件，里面包含一些项目的基本信息
```
npm init
```

### 1.2、安装webpack4

webpack4将命令行相关的单独拆了出去封装成了webpack-cli。所以得安装webpack与webpack-cli
```
npm install webpack webpack-cli -D
```
ps：在开始之前，请确保安装了Node.js的最新版本。

### 1.2、小试牛刀
webpack4号称零配置。它提供mode配置选项([详情请看文档](https://www.webpackjs.com/concepts/mode/))，告知webpack使用相应模式的内置优化。  

用法如下：
```
// 在webpack配置文件中使用
module.exports = {
  mode: 'production'
};

// 在命令行中使用
webpack --mode=production
```
* 创建src/main.js
```
console.log('hello, world')
```
* 在package.json中配置命令
```
"scripts": {
    "dev": "webpack ./src/main.js --mode development"
},
```
运行 npm run dev。如果出现dist/main.js说明运行成功。

## 2、配置功能
* 在根目录创建一个webpack.config.js   
<img src='https://user-gold-cdn.xitu.io/2020/2/23/170708697c9fbc05?w=796&h=454&f=png&s=46940' width='500'>
* 修改package.json
```
"scripts": {
  "dev": "webpack --config webpack.config.js --mode development"
},
```
### 2.1、配置babel
安装依赖
```
npm install babel-loader @babel/core @babel/cli @babel/preset-env -D
npm install core-js regenerator-runtime -S
```
简单说明一下：
* Babel的核心功能包含在 @babel/core 模块中。
* babel提供的命令行工具@babel/cli，主要是提供babel这个命令。
* @babel/preset-env 主要作用是对我们所使用的并且目标浏览器中缺失的功能进行代码转换和加载 polyfill。在不进行任何配置的情况下，它所包含的插件将支持所有最新的JS特性(ES2015,ES2016等，不包含 stage 阶段)，将其转换成ES5代码。
* core-js和regenerator-runtime可以模拟完整的ES2015+环境。这意味着可以使用诸如Promise和Map之类的新的内置组件、Array.from之类的静态方法、Array.prototype.includes之类的实例方法。  

@babel/preset-env提供了一个useBuiltIns参数，设置值为usage时，就只会包含代码需要的polyfill。有一点需要注意：配置此参数的值为usage，必须要同时设置corejs。  

创建babel.config.js
```
module.exports = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ]
};
```
修改webpack配置
```
module.exports = {
  entry: ...,
  output: ...,
  + module: {
  +  rule: [
  +    {
  +      test: /\.(js|ts)x?$/,  //jsx或者tsx文件
  +      exclude: /(node_modules)/, // 排除node_modules
  +      use: {
  +        loader: 'babel-loader'
  +      }
  +    }
  +  ]
  }
}
```

### 2.2、配置预处理器
```
npm install sass-loader dart-sass css-loader style-loader file-loader -D
```
* 修改webpack配置
```
module.exports = {
  entry: ...,
  output: ...,
  module: {
    rule: [
      ...,
     + {
     +  test: /\.(c|sc|sa)ss$/,
     +   use: [
     +     'style-loader',
     +     'css-loader',
     +     {
     +       loader: 'sass-loader',
     +       options: {
     +         implementation: require('dart-sass')
     +       }
     +     }
     +   ]
     + },
     + {
     +   test: /\.(png|jpg|gif|woff|svg|ttf)$/,
     +   use: [
     +     'file-loader'
     +   ]
     + }
    ]
  }
}
```

### 2.3、配置HtmlWebpackPlugin
HtmlWebpackPlugin简化了HTML文件的创建，以便为你的webpack包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的webpack bundle尤其有用。
```
npm i html-webpack-plugin -D
```
* 修改webpack配置
```
+ const HtmlWebpackPlugin = require('html-webpack-plugin');
...
module.exports = {
  entry: ...,
  output: {...},
  module: {...},
+  plugins: [
+    new HtmlWebpackPlugin({
+      template: path.join(__dirname, 'public/index.html'),
+      title: 'ts-react-starter',
+      filename: 'index.html'
+    }),
+  ]
}
```
* 创建public/index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### 2.4、配置 devServer 热更新功能
webpack-dev-server能够用于快速开发应用程序，可以实现不刷新页面的情况下，更新我们的页面。
```
npm i webpack-dev-server -D
```
* 修改webpack配置
```
module.exports = {
  entry: ...,
  output: {...},
  module: {...},
  plugins: [...],
 + devServer: {
 +   contentBase: path.resolve(__dirname, buildPath),
 +   compress: true,
 +   port: 9000
  }
}
```
* 修改package.json
```
"scripts": {
    "dev": "webpack-dev-server --open"
},
```
## 3、配置react
* 安装依赖
```
npm i react react-dom react-router-dom -S
npm i @babel/preset-react -D
```
* 修改babel.config.js
```
module.exports = {
  presets: [
    ...,
+   '@babel/preset-react'
  ]
};
```
### 3.1、小试牛刀
* 创建src/index.jsx
```
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const Root = document.getElementById('root');

const Test = () => <div className="test">test</div>;

ReactDOM.render(
  <Router>
    <Route path='/' component={Test}>
    </Route>
  </Router>,
  Root
);
```
* 修改webpack.config.js中的entry为src/index.jsx。  

* 运行npm run dev即可看到效果。

## 4、配置TypeScript
社区已经记录了90%的顶级JavaScript库。这意味着，你可以非常高效地使用这些库，而无需在单独的窗口打开相应文档。可以通过npm来安装使用@types
```
npm i @types/react @types/react-dom @types/react-router-dom typescript @babel/preset-typescript -D
```
* 修改babel.config.js
```
module.exports = {
  presets: [
    ...,
+   '@babel/preset-typescript'
  ]
};
```
* 创建[tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
```
{
  "compilerOptions": {
    "target": "ES2016",
    "module": "commonjs", 
    "jsx": "react", 
    "strict": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "inlineSourceMap": true
  },
  "include": [
    "src"
  ]
}
```
* 将.jsx文件改为tsx文件。
* 重新运行npm run dev即可看到效果。

## 5、优化webpack
### 5.1、mini-css-extract-plugin
将css独立拆包最大的好处就是js和css的改动，不会影响对方。比如我改了js文件并不会导致css文件的缓存失效。  

使用方式也很简单，大家看着[文档](https://github.com/webpack-contrib/mini-css-extract-plugin#minimal-example)抄就可以了。
```
npm i mini-css-extract-plugin -D
```
修改webpack.config.js
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
 module: {
    rules: [
        ...
      {
        test: /\.(c|sc|sa)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          ...
        ]
      },
    ]
  },
  plugins: [
    ...
    new MiniCssExtractPlugin({
      filename: 'index.css'
    }),
  ],
}
```
### 5.2、optimize-css-assets-webpack-plugin
打包css之后还需要做css代码压缩，这时候需要使用optimize-css-assets-webpack-plugin这个插件，它不仅能压缩css还能优化代码。  
```
npm i cssnano optimize-css-assets-webpack-plugin -D
```
修改webpack.config.js
```
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
  plugins: [
    ...
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /index\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }]
      },
      canPrint: true
    })
  ],
}
```
优化webpack就介绍到这里，掘金已有很多非常好的优化文章，请自行搜索并实践。

## 总结
到目前为止，已经成功的自己搭建了一个typescript+react的开发环境。在搭建过程中，还是会踩很多坑的。  

世上无难事，只怕有心人。动手试一试，比看半天都要好。 

## 结尾
更多文章请移步[楼主github](https://github.com/zhangwinwin/FEBlog),如果喜欢请点一下star,对作者也是一种鼓励。