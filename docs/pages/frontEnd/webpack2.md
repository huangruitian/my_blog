# webpack4.0 配置最佳指北
## 分析打包速度
优化 webpack 构建速度的第一步是知道将精力集中在哪里。我们可以通过 speed-measure-webpack-plugin 测量你的 webpack 构建期间各个阶段花费的时间：
```js
// 分析打包时间
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
// ...
module.exports = smp.wrap(prodWebpackConfig)
```
特定的项目，都有自己特定的性能构建瓶颈，下面我们对打包的每一个环节进行优化。

## 分析影响打包速度的环境
1. 开始打包，我们需要获取所有的依赖模块
搜索所有的依赖项，这需要占用一定的时间，即搜索时间，那么我们就确定了：**我们需要优化的第一个时间就是搜索时间**

2. 解析所有的依赖模块（解析成浏览器可运行的代码）
webpack 根据我们配置的 loader 解析相应的文件。日常开发中我们需要使用 loader 对 js ，css ，图片，字体等文件做转换操作，并且转换的文件数据量也是非常大。由于 js 单线程的特性使得这些转换操作不能并发处理文件，而是需要一个个文件进行处理。

**我们需要优化的第二个时间就是解析时间**

3. 将所有的依赖模块打包到一个文件
将所有解析完成的代码，打包到一个文件中，为了使浏览器加载的包更新（减小白屏时间），所以 webpack 会对代码进行优化。

JS 压缩是发布编译的最后阶段，通常 webpack 需要卡好一会，这是因为压缩  JS 需要先将代码解析成 AST 语法树，然后需要根据复杂的规则去分析和处理 AST，最后将 AST 还原成  JS，这个过程涉及到大量计算，因此比较耗时，打包就容易卡住。

**我们需要优化的第三个时间就是压缩时间**

4. 二次打包
当更改项目中一个小小的文件时，我们需要重新打包，所有的文件都必须要重新打包，需要花费同初次打包相同的时间，但项目中大部分文件都没有变更，尤其是第三方库。

**我们需要优化的第四个时间就是二次打包时间**

## 优化解析时间-开启多进程打包
运行在 Node.js 之上的 webpack 是单线程模式的，也就是说，webpack 打包只能逐个文件处理，当 webpack 需要打包大量文件时，打包时间就会比较漫长。

1. thread-loader（webpack4 官方推荐）
把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker【worker pool】 池里运行，一个worker 就是一个nodeJS 进程【node.js proces】，每个单独进程处理时间上限为600ms，各个进程的数据交换也会限制在这个时间内。

thread-loader 使用起来也非常简单，只要把 thread-loader 放置在其他 loader 之前， 那 thread-loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // 创建一个 js worker 池
        use: [ 
          'thread-loader',
          'babel-loader'
        ] 
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        // 创建一个 css worker 池
        use: [
          'style-loader',
          'thread-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
      // ...
    ]
    // ...
  }
  // ...
}
```
注意：thread-loader 放在了 style-loader 之后，这是因为 thread-loader 没法存取文件也没法获取 webpack 的选项设置。

官方上说每个 worker 大概都要花费 600ms ，所以官方为了防止启动 worker 时的高延迟，提供了对 worker 池的优化：预热

```js
// ...
const threadLoader = require('thread-loader');

const jsWorkerPool = {
  // options

  // 产生的 worker 的数量，默认是 (cpu 核心数 - 1)
  // 当 require('os').cpus() 是 undefined 时，则为 1
  workers: 2,

  // 闲置时定时删除 worker 进程
  // 默认为 500ms
  // 可以设置为无穷大， 这样在监视模式(--watch)下可以保持 worker 持续存在
  poolTimeout: 2000
};

const cssWorkerPool = {
  // 一个 worker 进程中并行执行工作的数量
  // 默认为 20
  workerParallelJobs: 2,
  poolTimeout: 2000
};

threadLoader.warmup(jsWorkerPool, ['babel-loader']);
threadLoader.warmup(cssWorkerPool, ['css-loader', 'postcss-loader']);


module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: jsWorkerPool
          },
          'babel-loader'
        ]
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'thread-loader',
            options: cssWorkerPool
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
      // ...
    ]
    // ...
  }
  // ...
}
```
注意，当项目较小时，多进程打包反而会使打包速度变慢。

## 合理利用缓存（缩短连续构建时间，增加初始构建时间）
使用 webpack 缓存的方法有几种，例如使用 cache-loader，HardSourceWebpackPlugin 或 babel-loader 的 cacheDirectory 标志。所有这些缓存方法都有启动的开销。重新运行期间在本地节省的时间很大，但是初始（冷）运行实际上会更慢。

如果你的项目生产版本每次都必须进行初始构建的话，缓存会增加构建时间，减慢你的速度。如果不是，那它们就会大大缩减你二次构建的时间。

1. cache-loader
cache-loader 和 thread-loader 一样，使用起来也很简单，仅仅需要在一些性能开销较大的 loader 之前添加此 loader，以将结果缓存到磁盘里，显著提升二次构建速度。
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ['cache-loader', ...loaders],
        include: path.resolve('src'),
      },
    ],
  },
};
```

## 优化压缩时间
webpack3 启动打包时加上 --optimize-minimize ，这样 Webpack 会自动为你注入一个带有默认配置的 UglifyJSPlugin。

或：
```js
module.exports = {
    optimization: {
        minimize: true,
    },
}
```

压缩 JavaScript 代码需要先把代码解析成用 Object 抽象表示的 AST 语法树，再去应用各种规则分析和处理 AST，导致这个过程计算量巨大，耗时非常多。但 UglifyJsPlugin 是单线程，所以我们可以使用  ParallelUglifyPlugin 。

ParallelUglifyPlugin 插件实现了多进程压缩，ParallelUglifyPlugin 会开启多个子进程，把对多个文件的压缩工作分配给多个子进程去完成，每个子进程其实还是通过 UglifyJS 去压缩代码，但是变成了并行执行。所以 ParallelUglifyPlugin 能更快的完成对多个文件的压缩工作。

webpack4 中 webpack.optimize.UglifyJsPlugin 已被废弃。

也不推荐使用 ParallelUglifyPlugin，项目基本处于没人维护的阶段，issue 没人处理，pr没人合并。

webpack4 默认内置使用 terser-webpack-plugin 插件压缩优化代码，而该插件使用 terser 来缩小  JavaScript 。

所谓 terser，用于 ES6+ 的 JavaScript 解析器、mangler/compressor（压缩器）工具包。

为什么 webpack 选择 terser？

> 不再维护 uglify-es ，并且 uglify-js 不支持 ES6 +。terser 是 uglify-es 的一个分支，主要保留了与 uglify-es 和 uglify-js@3 的 API 和 CLI 兼容性。

terser 启动多进程
使用多进程并行运行来提高构建速度。并发运行的默认数量为 os.cpus().length - 1 。
```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
};
```

**可以显著加快构建速度，因此强烈推荐开启多进程**

## 优化搜索时间- 缩小文件搜索范围 减小不必要的编译工作
webpack 打包时，会从配置的 entry 触发，解析入口文件的导入语句，再递归的解析，在遇到导入语句时 webpack 会做两件事情：

- 根据导入语句去寻找对应的要导入的文件。例如 require('react') 导入语句对应的文件是 ./node_modules/react/react.js，require('./util') 对应的文件是 ./util.js。
- 根据找到的要导入文件的后缀，使用配置中的 Loader 去处理文件。例如使用 ES6 开发的 JavaScript 文件需要使用 babel-loader 去处理。

以上两件事情虽然对于处理一个文件非常快，但是当项目大了以后文件量会变的非常多，这时候构建速度慢的问题就会暴露出来。虽然以上两件事情无法避免，但需要尽量减少以上两件事情的发生，以提高速度。

1. 优化loader配置

使用 Loader 时可以通过 test 、 include 、 exclude 三个配置项来命中 Loader 要应用规则的文件

2. 优化 resolve.module 配置

resolve.modules 用于配置 webpack 去哪些目录下寻找第三方模块，resolve.modules 的默认值是 ['node_modules'] ，含义是先去当前目录下的 ./node_modules 目录下去找想找的模块，如果没找到就去上一级目录 ../node_modules 中找，再没有就去 ../../node_modules 中找，以此类推。

3. 优化 resolve.alias 配置

resolve.alias 配置项通过别名来把原导入路径映射成一个新的导入路径，减少耗时的递归解析操作。

4. 优化 resolve.extensions 配置

在导入语句没带文件后缀时，webpack 会根据 resolve.extension 自动带上后缀后去尝试询问文件是否存在，所以在配置 resolve.extensions 应尽可能注意以下几点：
- resolve.extensions 列表要尽可能的小，不要把项目中不可能存在的情况写到后缀尝试列表中。
- 频率出现最高的文件后缀要优先放在最前面，以做到尽快的退出寻找过程。
- 在源码中写导入语句时，要尽可能的带上后缀，从而可以避免寻找过程。

5. 优化 resolve.mainFields 配置
有一些第三方模块会针对不同环境提供几分代码。例如分别提供采用 ES5 和 ES6 的2份代码，这2份代码的位置写在 package.json 文件里，如下：
```js
{
  "jsnext:main": "es/index.js",// 采用 ES6 语法的代码入口文件
  "main": "lib/index.js" // 采用 ES5 语法的代码入口文件
}
```

webpack 会根据 mainFields 的配置去决定优先采用那份代码，mainFields 默认如下：
```js
mainFields: ['browser', 'main']
```

webpack 会按照数组里的顺序去 package.json 文件里寻找，只会使用找到的第一个。

假如你想优先采用 ES6 的那份代码，可以这样配置：
```js
mainFields: ['jsnext:main', 'browser', 'main']
```

6. 优化 module.noParse 配置
module.noParse 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析处理，这样做的好处是能提高构建性能。原因是一些库，例如 jQuery 、ChartJS， 它们庞大又没有采用模块化标准，让 Webpack 去解析这些文件耗时又没有意义。

最后再来一份详细的配置：
```js
// 编译代码的基础配置
module.exports = {
  // ...
  module: {
    // 项目中使用的 jquery 并没有采用模块化标准，webpack 忽略它
    noParse: /jquery/,
    rules: [
      {
        // 这里编译 js、jsx
        // 注意：如果项目源码中没有 jsx 文件就不要写 /\.jsx?$/，提升正则表达式性能
        test: /\.(js|jsx)$/,
        // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
        use: ['babel-loader?cacheDirectory'],
        // 排除 node_modules 目录下的文件
        // node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    // 设置模块导入规则，import/require时会直接在这些目录找文件
    // 可以指明存放第三方模块的绝对路径，以减少寻找
    modules: [
      path.resolve(`${project}/client/components`), 
      path.resolve('h5_commonr/components'), 
      'node_modules'
    ],
    // import导入时省略后缀
    // 注意：尽可能的减少后缀尝试的可能性
    extensions: ['.js', '.jsx', '.react.js', '.css', '.json'],
    // import导入时别名，减少耗时的递归解析操作
    alias: {
      '@compontents': path.resolve(`${project}/compontents`),
    }
  },
};
```

## webpack 最佳配置指北
对于入门选手来讲，webpack 配置项很多很重，如何快速配置一个可用于线上环境的 webpack 就是一件值得思考的事情。其实熟悉 webpack 之后会发现很简单，基础的配置可以分为以下几个方面：entry 、 output 、 mode 、 resolve 、 module 、 optimization 、 plugin 、 source map 、 performance 等，就来重点分析下这些部分。

### 配置入口 entry
将源文件加入到 webpack 构建流程，可以是单入口:
```js
module.exports = {
  entry: `./index.js`,
}
```
构建包名称 [name]为 main ；

也可以是多入口：
```js
module.exports = {
  entry: { 
    "index": `./index.js`,
  },
}
```
key:value 键值对的形式：
- key：构建包名称，即 [name] ，在这里为 index
- value：入口路径

入口决定 webapck 从哪个模块开始生成依赖关系图（构建包），每一个入口文件都对应着一个依赖关系图。

2. 动态配置入口文件

动态打包所有子项目

当构建项目包含多个子项目时，每次增加一个子系统都需要将入口文件写入 webpack 配置文件中，其实我们让webpack 动态获取入口文件，例如：
```js
// 使用 glob 等工具使用若干通配符，运行时获得 entry 的条目
module.exports = {
  entry: glob.sync('./project/**/index.js').reduce((acc, path) => {
    const entry = path.replace('/index.js', '')
    acc[entry] = path
    return acc
  }, {}),
}
```

则会将所有匹配 ./project/**/index.js 的文件作为入口文件进行打包，如果你想要增加一个子项目，仅仅需要在 project 创建一个子项目目录，并创建一个 index.js 作为入口文件即可。

这种方式比较适合入口文件不集中且较多的场景。

动态打包某一子项目

在构建多系统应用或组件库时，我们每次打包可能仅仅需要打包某一模块，此时，可以通过命令行的形式请求打印某一模块，例如：
```js
npm run build --project components
```

在打包的时候解析命令行参数：
```js
// 解析命令行参数
const argv = require('minimist')(process.argv.slice(2))
// 项目
const project = argv['project'] || 'index'
```

然后配置解析入口：
```js
module.exports = {
  entry: { 
    "index": `./${project}/index.js`,
  } 
}
```

相当于：
```js
module.exports = {
  entry: { 
    "index": `./components/index.js`,
  } 
}
```

当然，你可以传入其它参数，也可以应用于多个地方，例如 resolve.alias 中。

### 配置出口 output
用于告知 webpack 如何构建编译后的文件，可以自定义输出文件的位置和名称:
```js
module.exports = {
  output: { 
    // path 必须为绝对路径
    // 输出文件路径
    path: path.resolve(__dirname, '../../dist/build'),
    // 包名称
    filename: "[name].bundle.js",
    // 或使用函数返回名(不常用)
    // filename: (chunkData) => {
    //   return chunkData.chunk.name === 'main' ? '[name].js': '[name]/[name].js';
    // },
    // 块名，公共块名(非入口)
    chunkFilename: '[name].[chunkhash].bundle.js',
    // 打包生成的 index.html 文件里面引用资源的前缀
    // 也为发布到线上资源的 URL 前缀
    // 使用的是相对路径，默认为 ''
    publicPath: '/', 
  }
}
```

在 webpack4 开发模式下，会默认启动 output.pathinfo ，它会输出一些额外的注释信息，对项目调试非常有用，尤其是使用 eval devtool 时。

filename ：[name] 为 entry 配置的 key，除此之外，还可以是 [id] （内部块 id ）、 [hash]、[contenthash] 等。

1. 浏览器缓存与hash值

对于我们开发的每一个应用，浏览器都会对静态资源进行缓存，如果我们更新了静态资源，而没有更新静态资源名称（或路径），浏览器就可能因为缓存的问题获取不到更新的资源。在我们使用 webpack 进行打包的时候，webpack 提供了 hash 的概念，所以我们可以使用 hash 来打包。

在定义包名称（例如 chunkFilename 、 filename），我们一般会用到哈希值，不同的哈希值使用的场景不同：

- hash，build-specific， 哈希值对应每一次构建（ Compilation ），即每次编译都不同，即使文件内容都没有改变，并且所有的资源都共享这一个哈希值，此时，浏览器缓存就没有用了，可以用在开发环境，生产环境不适用。

- chunkhash，chunk-specific， 哈希值对应于 webpack 每个入口点，每个入口都有自己的哈希值。如果在某一入口文件创建的关系依赖图上存在文件内容发生了变化，那么相应入口文件的 chunkhash 才会发生变化，适用于生产环境

- contenthash，content-specific，根据包内容计算出的哈希值，只要包内容不变，contenthash 就不变，适用于生产环境

但我们会发现，有时内容没有变更，打包时 [contenthash] 反而变更了的问题，

webpack 也允许哈希的切片。如果你写 [hash:8] ，那么它会获取哈希值的前 8 位。

注意：
- 尽量在生产环境使用哈希

- 按需加载的块不受 filename 影响，受 chunkFilename 影响

- 使用 hash/chunkhash/contenthash 一般会配合 html-webpack-plugin （创建 html ，并捆绑相应的打包文件） 、clean-webpack-plugin （清除原有打包文件） 一起使用。

2. 打包成库
当使用webpack构建一个可以被其它模块引用的库时：
```js
module.exports = {
  output: { 
    // path 必须为绝对路径
    // 输出文件路径
    path: path.resolve(__dirname, '../../dist/build'),
    // 包名称
    filename: "[name].bundle.js",
    // 块名，公共块名(非入口)
    chunkFilename: '[name].[chunkhash].bundle.js',
    // 打包生成的 index.html 文件里面引用资源的前缀
    // 也为发布到线上资源的 URL 前缀
    // 使用的是相对路径，默认为 ''
    publicPath: '/', 
    // 一旦设置后该 bundle 将被处理为 library
    library: 'webpackNumbers',
    // export 的 library 的规范，有支持 var, this, commonjs,commonjs2,amd,umd
    libraryTarget: 'umd',
  }
}
```

### 配置模式 mode（webpack4）
设置 mode ，可以让 webpack 自动调起相应的内置优化。
```js
module.exports = {
  // 可以是 none、development、production
  // 默认为 production
  mode: 'production'
}
```
或在命令行里配置：
```js
"build:prod": "webpack --config config/webpack.prod.config.js --mode production"
```

在设置了 mode 之后，webpack4 会同步配置 process.env.NODE_ENV 为 development 或 production 

webpack4 最引人注目的主要是：
- 减小编译时间
  - 打包时间减小了超过 60%

- 零配置
  - 我们可以在没有任何配置文件的情况下将 webpack 用于各种项目

webpack4 支持零配置使用，这里的零配置就是指，mode 以及 entry （默认为 src/index.js）都可以通过入口文件指定，并且 webpack4 针对对不同的 mode 内置相应的优化策略。

1. production
配置：
```js
// webpack.prod.config.js
module.exports = {
  mode: 'production',
}
```

相当于默认内置了：
```js
// webpack.prod.config.js
module.exports = {
  performance: {
    // 性能设置,文件打包过大时，会报警告
    hints: 'warning'
  },
  output: {
    // 打包时，在包中不包含所属模块的信息的注释
    pathinfo: false
  },
  optimization: {
    // 不使用可读的模块标识符进行调试
    namedModules: false,
    // 不使用可读的块标识符进行调试
    namedChunks: false,
    // 设置 process.env.NODE_ENV 为 production
    nodeEnv: 'production',
    // 标记块是否是其它块的子集
    // 控制加载块的大小（加载较大块时，不加载其子集）
    flagIncludedChunks: true,
    // 标记模块的加载顺序，使初始包更小
    occurrenceOrder: true,
    // 启用副作用
    sideEffects: true,
    // 确定每个模块的使用导出，
    // 不会为未使用的导出生成导出
    // 最小化的消除死代码
    // optimization.usedExports 收集的信息将被其他优化或代码生成所使用
    usedExports: true,
    // 查找模块图中可以安全的连接到其它模块的片段
    concatenateModules: true,
    // SplitChunksPlugin 配置项
    splitChunks: {
      // 默认 webpack4 只会对按需加载的代码做分割
      chunks: 'async',
      // 表示在压缩前的最小模块大小,默认值是30kb
      minSize: 30000,
      minRemainingSize: 0,
      // 旨在与HTTP/2和长期缓存一起使用 
      // 它增加了请求数量以实现更好的缓存
      // 它还可以用于减小文件大小，以加快重建速度。
      maxSize: 0,
      // 分割一个模块之前必须共享的最小块数
      minChunks: 1,
      // 按需加载时的最大并行请求数
      maxAsyncRequests: 6,
      // 入口的最大并行请求数
      maxInitialRequests: 4,
      // 界定符
      automaticNameDelimiter: '~',
      // 块名最大字符数
      automaticNameMaxLength: 30,
      cacheGroups: { // 缓存组
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    // 当打包时，遇到错误编译，将不会把打包文件输出
    // 确保 webpack 不会输入任何错误的包
    noEmitOnErrors: true,
    checkWasmTypes: true,
    // 使用 optimization.minimizer || TerserPlugin 来最小化包
    minimize: true,
  },
  plugins: [
    // 使用 terser 来优化 JavaScript
    new TerserPlugin(/* ... */),
    // 定义环境变量
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
    // 预编译所有模块到一个闭包中，提升代码在浏览器中的执行速度
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。
    // 这样可以确保输出资源不会包含错误
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
```

2. development
配置：
```js
// webpack.dev.config.js
module.exports = {
  mode: 'development',
}
```

相当于默认内置了：
```js
// webpack.dev.config.js
module.exports = {
  devtool: 'eval',
  cache: true,
  performance: {
    // 性能设置,文件打包过大时，不报错和警告，只做提示
    hints: false
  },
  output: {
    // 打包时，在包中包含所属模块的信息的注释
    pathinfo: true
  },
  optimization: {
    // 使用可读的模块标识符进行调试
    namedModules: true,
    // 使用可读的块标识符进行调试
    namedChunks: true,
    // 设置 process.env.NODE_ENV 为 development
    nodeEnv: 'development',
    // 不标记块是否是其它块的子集
    flagIncludedChunks: false,
    // 不标记模块的加载顺序
    occurrenceOrder: false,
    // 不启用副作用
    sideEffects: false,
    usedExports: false,
    concatenateModules: false,
    splitChunks: {
      hidePathInfo: false,
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
    },
    // 当打包时，遇到错误编译，仍把打包文件输出
    noEmitOnErrors: false,
    checkWasmTypes: false,
    // 不使用 optimization.minimizer || TerserPlugin 来最小化包
    minimize: false,
    removeAvailableModules: false
  },
  plugins: [
    // 当启用 HMR 时，使用该插件会显示模块的相对路径
    // 建议用于开发环境
    new webpack.NamedModulesPlugin(),
    // webpack 内部维护了一个自增的 id，每个 chunk 都有一个 id。
    // 所以当增加 entry 或者其他类型 chunk 的时候，id 就会变化，
    // 导致内容没有变化的 chunk 的 id 也发生了变化
    // NamedChunksPlugin 将内部 chunk id 映射成一个字符串标识符（模块的相对路径）
    // 这样 chunk id 就稳定了下来
    new webpack.NamedChunksPlugin(),
    // 定义环境变量
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
  ]
}
```

3. none
不进行任何默认优化选项。

配置：
```js
// webpack.com.config.js
module.exports = {
  mode: 'none',
}
```

相当于默认内置了：
```js
// webpack.com.config.js
module.exports = {
  performance: {
   // 性能设置,文件打包过大时，不报错和警告，只做提示
   hints: false
  },
  optimization: {
    // 不标记块是否是其它块的子集
    flagIncludedChunks: false,
    // 不标记模块的加载顺序
    occurrenceOrder: false,
    // 不启用副作用
    sideEffects: false,
    usedExports: false,
    concatenateModules: false,
    splitChunks: {
      hidePathInfo: false,
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
    },
    // 当打包时，遇到错误编译，仍把打包文件输出
    noEmitOnErrors: false,
    checkWasmTypes: false,
    // 不使用 optimization.minimizer || TerserPlugin 来最小化包
    minimize: false,
  },
  plugins: []
}
```

4. 环境变量 process.env.NODE_ENV
第三方框架或库，以及我们的业务代码，都会针对不同的环境配置，执行不同的逻辑代码，例如：

我们可以通过以下方式定义环境变量：

方法一：webpack4 中 mode: 'production' 已经默认配置了 process.env.NODE_ENV = 'production' ，所以 webapck4 可以不定义

尽管 webpack4 中定义 mode 会自动配置 process.env.NODE_ENV ，那么我们就不需要手动配置环境变量了吗？

其实不然，mode 只可以定义成 development 或 production ，而在项目中，我们不仅仅只有开发或生产环境，很多情况下需要配置不同的环境（例如测试环境），此时我们就需要手动配置其它环境变量（例如测试环境，就需要定义 process.env.NODE_ENV 为 'test' ），你可以采取以下方式：

方法二：webpack.DefinePlugin
```js
// webpack编译过程中设置全局变量process.env
new webpack.DefinePlugin({
  'process.env': require('../config/dev.env.js')
}
```

config/prod.env.js ：
```js
module.exports ={
  // 或  '"production"' ，环境变量的值需要是一个由双引号包裹的字符串
  NODE_ENV: JSON.stringify('production') 
}
```

方法三：webpack 命令时， NODE_ENV=development

在 window 中配置 NODE_ENV=production 可能会卡住，所以使用 cross-env：
```js
cross-env NODE_ENV=production webpack --config webpack.config.prod.js
```

方法四：使用 new webpack.EnvironmentPlugin(['NODE_ENV'])

EnvironmentPlugin 是一个通过 webpack.DefinePlugin 来设置 process.env 环境变量的快捷方式。
```js
new webpack.EnvironmentPlugin({
  NODE_ENV: 'production',
});
```

注意：上面其实是给 NODE_ENV 设置一个默认值 'production' ，如果其它地方有定义 process.env.NODE_ENV ，则该默认值无效。

### 配置解析策略  resolve
自定义寻找依赖模块时的策略（例如 import _ from 'lodash'）:
```js
module.exports = {
  resolve: {
    // 设置模块导入规则，import/require时会直接在这些目录找文件
    // 可以指明存放第三方模块的绝对路径，以减少寻找，
    // 默认 node_modules
    modules: [path.resolve(`${project}/components`), 'node_modules'],
    // import导入时省略后缀
    // 注意：尽可能的减少后缀尝试的可能性
    extensions: ['.js', '.jsx', '.react.js', '.css', '.json'],
    // import导入时别名，减少耗时的递归解析操作
    alias: {
      '@components': path.resolve(`${project}/components`),
      '@style': path.resolve('asset/style'),
    },
    // 很多第三方库会针对不同的环境提供几份代码
    // webpack 会根据 mainFields 的配置去决定优先采用那份代码
    // 它会根据 webpack 配置中指定的 target 不同，默认值也会有所不同
    mainFields: ['browser', 'module', 'main'],
  },
}
```

### 配置解析和转换文件的策略 module
决定如何处理项目中不同类型的模块，通常是配置 module.rules 里的 Loader:
```js
module.exports = {
  module: {
    // 指明 webpack 不去解析某些内容，该方式有助于提升 webpack 的构建性能
    noParse: /jquery/,
    rules: [
      {
        // 这里编译 js、jsx
        // 注意：如果项目源码中没有 jsx 文件就不要写 /\.jsx?$/，提升正则表达式性能
        test: /\.(js|jsx)$/,
        // 指定要用什么 loader 及其相关 loader 配置
        use: {
          loader: "babel-loader",
          options: {
            // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
            // 使用 cacheDirectory 选项将 babel-loader 的速度提高2倍
              cacheDirectory: true,
              // Save disk space when time isn't as important
              cacheCompression: true,
              compact: true,     
          }
        },
        // 排除 node_modules 目录下的文件
        // node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
        exclude: /node_modules/
        // 也可以配置 include：需要引入的文件
      }
    ]
  }
}
```

1. noParse
指明 webpack 不去解析某些内容，该方式有助于提升 webpack 的构建性能。

2. rules 还有常见的loader

### 配置优化 optimization（webpack4）
webapck4 会根据你所选择的 mode 进行优化，你可以手动配置，它将会覆盖自动优化，详细配置请见 Optimization 。

主要涉及两方面的优化：
- 最小化包
- 拆包

1. 最小化包
- 使用 optimization.removeAvailableModules 删除已可用模块

- 使用 optimization.removeEmptyChunks 删除空模块

- 使用 optimization.occurrenceOrder 标记模块的加载顺序，使初始包更小

- 使用 optimization.providedExports 、 optimization.usedExports 、concatenateModules 、optimization.sideEffects 删除死代码

- 使用 optimization.splitChunks 提取公共包

- 使用 optimization.minimizer || TerserPlugin 来最小化包

2. 拆包
当包过大时，如果我们更新一小部分的包内容，那么整个包都需要重新加载，如果我们把这个包拆分，那么我们仅仅需要重新加载发生内容变更的包，而不是所有包，有效的利用了缓存。

拆分 node_modules

很多情况下，我们不需要手动拆分包，可以使用 optimization.splitChunks ：
```js
const path = require('path');
module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
  },
  optimization: {
    splitChunks: {
      // 对所有的包进行拆分
      chunks: 'all',
    },
  },
};
```

我们不必制定拆包策略，chunks: all 会自动将 node_modules 中的所有内容放入一个名为 vendors〜main.js 的文件中。

拆分业务代码
```js
module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src/index.js'),
    ProductList: path.resolve(__dirname, 'src/ProductList/ProductList.js'),
    ProductPage: path.resolve(__dirname, 'src/ProductPage/ProductPage.js'),
    Icon: path.resolve(__dirname, 'src/Icon/Icon.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
  },
};
```

采用多入口的方式，当有业务代码更新时，更新相应的包即可

拆分第三方库
```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // 获取第三方包名
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm 软件包名称是 URL 安全的，但是某些服务器不喜欢@符号
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
};
```

当第三方包更新时，仅更新相应的包即可。

注意，当包太多时，浏览器会发起更多的请求，并且当文件过小时，对代码压缩也有影响。

动态加载

现在我们已经对包拆分的很彻底了，但以上的拆分仅仅是对浏览器缓存方面的优化，减小首屏加载时间，实际上我们也可以使用按需加载的方式来进一步拆分，减小首屏加载时间：
```js
import React, { useState, useEffect } from 'react';
import './index.scss'

function Main() {
  const [NeighborPage, setNeighborPage] = useState(null)

  useEffect(() => {
    import('../neighbor').then(({ default: component }) => {
      setNeighborPage(React.createElement(component))
    });
  }, [])

  return NeighborPage
    ? NeighborPage
    : <div>Loading...</div>;
}

export default Main
```

### 配置 plugin
配置 Plugin 去处理及优化其它的需求，
```js
module.exports = {
  plugins: [
    // 优化 require
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh/),
    // 用于提升构建速度
    createHappyPlugin('happy-babel', [{
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', "@babel/preset-react"],
        plugins: [
          ['@babel/plugin-proposal-class-properties', {
            loose: true
          }]
        ],
        // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
        cacheDirectory: true,
        // Save disk space when time isn't as important
        cacheCompression: true,
        compact: true,
      }
    }])
  ]
}
```
常用 plugins：
- html-webpack-plugin：生成 html 文件，并将包添加到 html 中

- webpack-parallel-uglify-plugin：压缩 js（多进程并行处理压缩）

- happypack：多线程loader，用于提升构建速度

- hard-source-webpack-plugin：为模块提供中间缓存步骤，显著提高打包速度

- webpack-merge：合并 webpack 配置

- mini-css-extract-plugin：抽离 css

- optimize-css-assets-webpack-plugin：压缩 css

- add-asset-html-webpack-plugin：将 JavaScript 或 CSS 资产添加到 html-webpack-plugin 生成的 HTML 中

### 配置devtool：source map
配置 webpack 如何生成 Source Map，用来增强调试过程。不同的值会明显影响到构建(build)和重新构建(rebuild)的速度：

生产环境：默认为 null ，一般不设置（ none ）或 nosources-source-map

开发环境：默认为 eval ，一般设置为 eval 、 cheap-eval-source-map 、cheap-module-eval-source-map

策略为：
- 使用 cheap 模式可以大幅提高 souremap 生成的效率。 没有列信息（会映射到转换后的代码，而不是映射到原始代码），通常我们调试并不关心列信息，而且就算 source map 没有列，有些浏览器引擎（例如 v8） 也会给出列信息。

- 使用 eval 方式可大幅提高持续构建效率。参考官方文档提供的速度对比表格可以看到 eval 模式的编译速度很快。

- 使用 module 可支持 babel 这种预编译工具（在 webpack 里做为 loader 使用）。

如果默认的 webpack minimizer 已经被重定义(例如 terser-webpack-plugin )，你必须提供 sourceMap：true 选项来启用 source map 支持。

### 配置性能 performance
当打包是出现超过特定文件限制的资产和入口点，performance 控制 webpack 如何通知：
```js
module.exports = {
  // 配置如何显示性能提示
  performance: {
    // 可选 warning、error、false
    // false：性能设置,文件打包过大时，不报错和警告，只做提示
    // warning：显示警告，建议用在开发环境
    // error：显示错误，建议用在生产环境，防止部署太大的生产包，从而影响网页性能
    hints: false
  }
}
```

### 配置其它
1. watch 与 watchOptions
监视文件更新，并在文件更新时重新编译：
```js
module.export = {
  // 启用监听模式
  watch: true,
}
```
在 webpack-dev-server 和 webpack-dev-middleware 中，默认启用了监视模式。

或者我们可以在命令行里启动监听（ --watch ）：
```js
webpack --watch --config webpack.config.dev.js
```

watchOptions:
```js
module.export = {
  watch: true,
  // 自定义监视模式
  watchOptions: {
    // 排除监听
    ignored: /node_modules/,
    // 监听到变化发生后，延迟 300ms（默认） 再去执行动作，
    // 防止文件更新太快导致重新编译频率太高
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
    // 默认 1000ms 询问一次
    poll: 1000
  }
}
```

2. externals
排除打包时的依赖项，不纳入打包范围内，例如你项目中使用了 jquery ，并且你在 html 中引入了它，那么在打包时就不需要再把它打包进去：

排除打包时的依赖项，不纳入打包范围内，例如你项目中使用了 jquery ，并且你在 html 中引入了它，那么在打包时就不需要再把它打包进去：
```js
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous">
</script>
```

配置：
```js
module.exports = {
  // 打包时排除 jquery 模块
  externals: {
    jquery: 'jQuery'
  }
};
```

3. target
构建目标，用于为 webpack 指定一个环境：
```js
module.exports = {
  // 编译为类浏览器环境里可用（默认）
  target: 'web'
};
```

4. cache
缓存生成的 webpack 模块和块以提高构建速度。在开发模式中，缓存设置为 type: 'memory' ，在生产模式中禁用。cache: true 是 cache: {type: 'memory'} 的别名。要禁用缓存传递 false ：
```js
module.exports = {
  cache: false
}
```

在内存中，缓存仅在监视模式下有用，并且我们假设你在开发中使用监视模式。在不进行缓存的情况下，内存占用空间较小。

## 复盘
1. webpack 构建流程
- 初始化参数：通过配置文件和shell命令的参数得到一个最终的参数；

- 开始编译：用上一步得到的参数创建compiler编译对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；

- 确定入口：根据配置中的 entry 找出所有的入口文件

- 编译模块：从入口文件出发，调用所有配置的loader翻译模块文件，再找出该模块依赖的模块；递归本步骤至所有的模块被翻译分析出来；

- 完成编译：在经过“编译模块”使用loader翻译出所有的模块后，得到了每个模块被翻译后的最终内容以及它们的依赖关系；

- 输出资源：根据模块之间的关系，组装成一个个包含多个模块的chunk，再把每个chunk转换成一个单独的文件输出到列表，这一步是修改输出内容的最后机会；

- 输出完成：在确定好输出内容后，根据配置确定的输出路径和文件名，把文件写入到文件系统；

2. webpack 插件原理

webpack 在编译代码过程中，会触发一系列 Tapable 钩子事件，插件所做的，就是找到相应的钩子，往上面挂上自己的任务，也就是注册事件，这样，当 webpack 构建的时候，插件注册的事件就会随着钩子的触发而执行了。


