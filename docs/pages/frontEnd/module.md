# 模块化
模块化是软件开发的重要概念，可以工程模块化，功能模块化。

## 模块化的理解
1. 什么是模块化
- 将一个复杂的程序依据一定的规则封装成文件，或者块。并进行组合在一起。
- 块的内部数据实现是私有的，只向外部暴露一些接口护着方法进行使用

## 模块化的进化过程
1. 全局的 function 模式：将不同的功能封装成不同的全部函数
- 缺陷：容易污染全部命名空间，容易引起命名冲突或数据不安全，而且模块成员之间看不出直接关系

2. namespace模式 : 简单对象封装
- 作用：减少全局变量的命名和冲突
- 缺陷：数据依然不安全，外部可以直接修改

3. IIFE模式：匿名函数自调用(闭包)
- 作用：数据是私有的，外部只能通过暴露的方法来操作
- 编码：将数据和行为封装到一个匿名函数的内部，通过window添加属性来向外暴露接口
- 缺陷：如果当前这个模块依赖了另一个模块怎么办？
```js
// module.js文件
(function(window) {
  let data = 'www.baidu.com'
  //操作数据的函数
  function foo() {
    //用于暴露有函数
    console.log(`foo() ${data}`)
  }
  function bar() {
    //用于暴露有函数
    console.log(`bar() ${data}`)
    otherFun() //内部调用
  }
  function otherFun() {
    //内部私有的函数
    console.log('otherFun()')
  }
  //暴露行为
  window.myModule = { foo, bar } //ES6写法
})(window)

// 使用，index.html文件
<script type="text/javascript" src="module.js"></script>
<script type="text/javascript">
    myModule.foo()
    myModule.bar()
    console.log(myModule.data) //undefined 不能访问模块内部数据
    myModule.data = 'xxxx' //不是修改的模块内部的data
    myModule.foo() //没有改变
</script>
```

4. IIFE模式增强: 引入依赖（有序引入）
- 上例子通过jquery方法将页面的背景颜色改成红色，所以必须先引入jQuery库，就把这个库当作参数传入。这样做除了保证模块的独立性，还使得模块之间的依赖关系变得明显。
```js
// module.js文件
(function(window, $) {
  let data = 'www.baidu.com'
  //操作数据的函数
  function foo() {
    //用于暴露有函数
    console.log(`foo() ${data}`)
    $('body').css('background', 'red')
  }
  function bar() {
    //用于暴露有函数
    console.log(`bar() ${data}`)
    otherFun() //内部调用
  }
  function otherFun() {
    //内部私有的函数
    console.log('otherFun()')
  }
  //暴露行为
  window.myModule = { foo, bar }
})(window, jQuery)

// index.html文件
// 引入的js必须有一定顺序
  <script type="text/javascript" src="jquery-1.10.1.js"></script>
  <script type="text/javascript" src="module.js"></script>
  <script type="text/javascript">
    myModule.foo()
  </script>
```

## 模块化的好处
1. 避免命名冲突(减少命名空间污染)
2. 更好的分离, 按需加载
3. 更高复用性
4. 高可维护性

## 暴露的问题
1. 请求过多，引入的script会很多
2. 依赖模糊，我们不知道他们的具体依赖关系是什么，也就是说很容易因为不了解他们之间的依赖关系导致加载先后顺序出错。
3. 难以维护，以上两种原因就导致了很难维护，很可能出现牵一发而动全身的情况导致项目出现严重的问题。模块化固然有多个好处，然而一个页面需要引入多个js文件，就会出现以上这些问题。

## 现代化的模块化规范

### CommonJS
1. 概述
- Node 应用由模块组成，采用 CommonJS 模块规范。每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。
- 在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。

2. 特点
- 所有代码都运行在模块作用域，不会污染全局作用域。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。




