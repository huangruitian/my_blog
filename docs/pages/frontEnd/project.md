## 面试心得
- 每个点必须要有数据支撑；（如果不知道，去背方案，去背套路）
- 难点要挑些重点的来说；避免给自己挖坑；

### 代码规范、文档；
产生背景：老项目代码，在不断新增功能的同时，互相维护起来非常痛苦；

如何分析：主动要求增加 code review，前期稍微多投入点时间，后期固定一个小时；

如何实施：code review
- 前期 code review 的时间比较多，因为大家需要确定一些具体统一的规则；
- 后期直接按照流程
1. 从 master 拉分支
2. 开发原因（hotfix/feature），直至开发完成；（eslint husky第一道卡口）
3. 开发完成，合往develop分支联调；
4. 调联自测完成，合往test（ci）分支；
5. 简单测试，修改BUG完成；
6. 合到指定的 reviewer 分支，审查者开始审查代码；有问题地方留下comment供被审查着进行代码改进；
7. 被审查者根据comment修改代码，如果有疑问直接问审查者，进行沟通学习；直至 reviewer 通过；
8. 合到release分支，测试进行回归测试，准备上线了；预生产测试；
9. 回归完成，release，合到master分支；
10. 完成之后，各开发分支同步master代码；
```js
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:nowatch && npm run lint"
    }
  },
  "scripts": {
    "lint": "eslint --ext js,less,css src --max-warnings 5 --fix",
  },
```
- 改善了eslint规则，增加 husky + commitlint 规范提交信息和改善代码质量；
- 不带破坏性的改善代码，eslint --fix 自动修复，代码问题需要手动修复；

改进成果：
- commit 信息相对准确有意义，代码质量得到一定的改善；
- 由于公司原因，CI/CD其实没有得到完全的落地；
- 基于此原因，后面子项目全上了TS了，维护得到质的提升；

注意点：
- 充分利用了git hook 生命钩子来做一些检测；
- 不能带有破坏性的改动，eslint --fix 只做基础的代码风格修正；如空格分号那种不带破坏性的；

### 构建速度
背景：打包速度很慢，很不爽；

如何分析：
- speed-measure-webpack-plugin，简称smp分析每个loader的耗时情况；
- 有些loader非常耗时，打包速度很慢；
- 我们要从搜索时间，解析时间，压缩时间三方面进行优化；
1. 搜索时间
- 使用 Loader 时可以通过 test 、 include 、 exclude 三个配置项来命中 Loader 要应用规则的文件；
- 优化 resolve.module 配置
  - 优化 resolve.alias 配置，减少层级``./../../a.js``
  - 优化 resolve.extensions 扩展名配置，默认``js,json``

2. 解析时间
- 开启多进程打包，可以使用thread-loader/happyPack
- 合理的利用缓存，cache-loader加到耗时比较成的loader上；babel-loader 开启cacheDirectory
- dll 把第三方库提取出来；（http/1.1就尽量提取少组，http/2就提取多几组）

3. 压缩时间
- terser 启动多进程 使用多进程并行运行来提高构建速度。并发运行的默认数量为 os.cpus().length - 1。
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

改进成果：
- dev 131ms - 53ms，提升60%左右；
- pro 131ms - 87ms，提升30%左右；

### 项目难点
- 封装的组件不灵活，可扩展性不强；（banner 为例，重新改变封装，然后关注了hooks）
- 组件滥用过期生命钩子，业务代码书写不过分关注性能；
- 有时候处理的数据相对复杂，有扎实的算法功底会很好处理；
- 优化数据量大的业务场景；antd 开启了react-window 虚拟长列表；
```js
场景：弹层从后端持续请求数据返回前端，前端需要修改商品属性；商品可以新增/删除、选择/不选择；
在渲染后端返回的数据存在两个问题：
1. 翻页以id为key。其实是不稳定的；因为翻页react需要消耗的性能更大；（搞清楚diff算法）
2. 在对table页面操作的时候，用户会频繁的操作选和不选：
// 假设现在有50条数据；只操作了一条；
// 存在的商品就选上，用了O（m * n），而且是频繁的（50 * 50 = 2500）；
let result = result.filter((item) => selectArr.includes(item.id));

// 但是用set O（m + n）100 : 2500 = 1:25 了；
let hash = new Set(selectArr)
let result = result.map((item) => hash.has(item.id));
```

- 发现多处使用 SKU 算法问题，没有进行抽离封装；（抽离封装 回溯算法）
```js
// 源数据， 业务场景，用户动态选择属性，生产一个表格
// let arr = [{
//     id: 'color',
//     value: ['1', '2']
//   },
//   {
//     id: 'storage',
//     value: ['A', 'B']
//   },
//   {
//     id: 'small',
//     value: ['a', 'b']
//   }
// ]
// 排列组合成这样
// let tableData = [{
//     color: "1",
//     storage: "A",
//     small: "a"
//   },
//   {
//     color: "2",
//     storage: "A",
//     small: "a"
//   },
// ]

// 思路
// id:value 抽出来做一个整体。item = 3
// 很明显是回溯算法，满足三个（一个坑挑一个），出现过 map 记录

// 先把数据处理成这样：
// arr = [
//     { color:['1','2'] },
//     { storage:['A','B'] },
//     { small:['a','b'] }
// ]

const getPhoneList = (
   arr = [
     { color:['1','2'] },
     { storage:['A','B'] },
     { small:['a','b'] }
   ] 
  ) => {
  const res = []
  const backtrack = (arr, tempObj, set, idx) => {
    let str = Object.values(tempObj).join('')
    // 加入条件   
    if (str.length === arr.length && !set.has(str)) {
      set.add(str)
      res.push(tempObj)
    } else {
      // 剪枝
      if (idx >= arr.length) {
        return
      }
      // 选到了第几组属性
      for (let i = idx; i < arr.length; i++) {
        let itemObj = arr[i]
        let key = Object.keys(itemObj)[0]
        let valuesArr = itemObj[key]
        for (let j = 0; j < valuesArr.length; j++) {
          let val = valuesArr[j]
          tempObj[key] = val
          // 每组选属性一个
          backtrack(arr, {
            ...tempObj
          }, set, idx + 1)
          // 选完回溯
          delete tempObj[key]
        }
      }
    }
  }
  console.log(arr)
  backtrack(arr, {}, new Set(), 0)
  return res
}

console.log(getPhoneList())
```

### 项目性能优化
产生背景：老项目代码，在不断新增功能的同时，包的体积变得很大，首屏加载很慢；
主要大方向：
1. 减少请求次数
2. 减少单次请求所花费的时间
- 打包出来包总共9.8M，首屏业务包3M，本地开发脚本加载执行都要6秒左右，线上更慢，将近十秒；
- 路由懒加载，分离2.1M；依然很大。基础库和业务包打在一起了；
- 分离公共包，dll一些无需打包的第三方库，业务包变1.4M, dll：567KB，vendors：893KB
- 注意：dll适合一些必须要全用的基础库，如果是一些需要Tree shaking 的适合分包，vendors

如何分析：Performance面板、LightHouse 与性能 API
1. 直接 Performance 的性能面板，小箭头分析大概；
2. npm LightHouse 下载进行分析；
3. Performance.timing  属性分析时间戳；这些时间戳与页面整个加载流程中的关键时间节点有着一一对应的关系；可做性能监控方案；

如何实施：
- webpack-bundle-analyzer 概览模块打包大小，做初次分析；
1. ckplayer引的是未压缩版本201K，min版本138K，直接省了63k
2. 首屏无依赖的第三方插件直接放head标签上；像ckplayer应该按需加载；(减少2秒)
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

3. dll 提取必须的第三方库，与业务代码分离；
```js
  // optimization -> minimizer -> TerserPlugin 进行压缩；
  // splitChunks -> chunks: 'async', cacheGroups 分离出来；
  plugins: [
    new webpack.DllPlugin({
      // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
      path: 'manifest.json', 
      // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
      name: '[name]',
      // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录       
      context: path.join(__dirname), 
    })
  ]
  // 使用：
  plugins = [
    new webpack.DllReferencePlugin({
      context: ROOT_PATH, // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
      manifest: require("./manifest.json") // 指定manifest.json
      //name: 'dll',  // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
    }),
  ]
```
4. dll 分离不彻底（基本不会变的包都给分离出来了），app主包过大；没有很好的利用缓存；（分离部分：361KB，分离全部 567KB）

5. 懒加载路由
```js
// 使用：const Law = (props) => Suspense(props, () => import('src/js/containers/login/Law'));
import React, { lazy, Suspense } from 'react';
import Page from 'components/Page'
export default (props, loader)=> {
  const Component = lazy(loader)
  return (
    <Suspense fallback={<Page loading={true}/>}>
      <Component {...props}></Component>
    </Suspense>
  )
}
``` 

6. 代码写法不利于Tree shaking，随着维护的时间越久，包体积也会越大；
```js
import * as loginAction from 'src/js/actions/Login'
import * as globalAction from 'src/js/actions/global'
```

7. 生产环境和开发环境都用hash，导致浏览器缓存完全失效；

首屏加载速度提升：10秒-5秒；
二次渲染：3秒；