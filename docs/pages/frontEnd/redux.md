## 什么是redux？
首先，在学习之前，要说明一点，react和redux没有任何关系，没有任何关系，没有任何关系；重要的事情说三遍。那redux是什么呢？是一个管理数据的仓库。

## 为什么需要redux？
原因是因为前端数据的复杂度没有人来管理，因为react当初的定位也是为了解决中大型项目，项目一旦复杂起来，需要共享的数据就会很庞大复杂。

1. 在控制台上记录用户的每个动作
不知道您是否有后端的开发经验，后端一般会有记录访问日志的中间件
例如，在 Express 中实现一个简单的 Logger 如下：
```js
var loggerMiddleware = function(req, res, next) {
  console.log('[Logger]', req.method, req.originalUrl)
  next()
}
app.use(loggerMiddleware)
```
每次访问的时候，都会在控制台中留下类似下面的日志便于追踪调试：
```js
[Logger] GET  /
[Logger] POST /login
[Logger] GET  /user?uid=10086
```

如果我们把场景转移到前端，请问该如何实现用户的动作跟踪记录？

我们可能会这样写：
```js
/** jQuery **/
$('#loginBtn').on('click', function(e) {
  console.log('[Logger] 用户登录')
  ...
})
$('#logoutBtn').on('click', function() {
  console.log('[Logger] 用户退出登录')
  ...
})

/** MVC / MVVM 框架（这里以纯 Vue 举例） **/
methods: {
  handleLogin () {
    console.log('[Logger] 用户登录')
    ...
  },
  handleLogout () {
    console.log('[Logger] 用户退出登录')
    ...
  }
}
```
上述 jQuery 与 MV* 的写法并没有本质上的区别
记录用户行为代码的侵入性极强，可维护性与扩展性堪忧

2. 在上述需求的基础上，记录用户的操作时间
显然地，前端的童鞋又得一个一个去改（当然 编辑器 / IDE 都支持全局替换）：
```js
/** jQuery **/
$('#loginBtn').on('click', function(e) {
  console.log('[Logger] 用户登录', new Date())
  ...
})
$('#logoutBtn').on('click', function() {
  console.log('[Logger] 用户退出登录', new Date())
  ...
})

/** MVC / MVVM 框架（这里以 Vue 举例） **/
methods: {
  handleLogin () {
    console.log('[Logger] 用户登录', new Date())
    ...
  },
  handleLogout () {
    console.log('[Logger] 用户退出登录', new Date())
    ...
  }
}
```

而后端的童鞋只需要稍微修改一下原来的中间件即可：
```js
var loggerMiddleware = function(req, res, next) {
  console.log('[Logger]', new Date(), req.method, req.originalUrl)
  next()
}
app.use(loggerMiddleware)
```

3. 正式上线的时候，把控制台中有关 Logger 的输出全部去掉

难道您以为有了 UglifyJS，配置一个 drop_console: true 就好了吗？图样图森破，拿衣服！
请看清楚了，仅仅是去掉有关 Logger 的 console.log，其他的要保留哦亲~~~
于是前端的童鞋又不得不乖乖地一个一个注释掉（当然也可以设置一个环境变量判断是否输出，甚至可以重写 console.log）

而我们后端的童鞋呢？只需要注释掉一行代码即可：
```// app.use(loggerMiddleware)```
真可谓是不费吹灰之力

4. 组件之间共享的状态数据很复杂很多怎么管理？

为何前后端对于这类需求的处理竟然大相径庭？后端为何可以如此优雅？
原因在于，后端具有统一的入口与统一的状态管理（数据库），因此可以引入中间件机制来统一实现某些功能

多年来，前端工程师忍辱负重，操着卖白粉的心，赚着买白菜的钱，一直处于程序员鄙视链的底层
于是有大牛就把后端 MVC 的开发思维搬到前端，将应用中所有的动作与状态都统一管理，让一切有据可循

## Store
首先要区分 store 和 state

state 是应用的状态，一般本质上是一个普通对象
例如，我们有一个 Web APP，包含 计数器 和 待办事项 两大功能
那么我们可以为该应用设计出对应的存储数据结构（应用初始状态）：
```js
/** 应用初始 state，本代码块记为 code-1 **/
{
  counter: 0,
  todos: []
}
```

store 是应用状态 state 的管理者，包含下列四个函数：
- getState() 获取整个 state
- dispatch(action) 触发 state 改变的【唯一途径】
- subscribe(listener) 可以理解成是 DOM 中的 addEventListener
- replaceReducer(nextReducer) 一般在 Webpack Code-Splitting 按需加载的时候用

二者的关系是：state = store.getState()

Redux 规定，一个应用只应有一个单一的 store，其管理着唯一的应用状态 state
Redux 还规定，不能直接修改应用的状态 state，也就是说，下面的行为是不允许的：
```js
var state = store.getState()
state.counter = state.counter + 1 // 禁止在业务逻辑中直接修改 state
```

若要改变 state，必须 dispatch 一个 action，这是修改应用状态的唯一途径：
> 现在您只需要记住 action 只是一个包含 type 属性的普通对象即可，例如 { type: 'INCREMENT' }

上面提到，state 是通过 store.getState() 获取，那么 store 又是怎么来的呢？
想生成一个 store，我们需要调用 Redux 的 createStore：
```js
import { createStore } from 'redux'
const store = createStore(reducer, initialState) // store 是靠传入 reducer 生成的哦！
```
> 现在您只需要记住 reducer 是一个纯函数，负责更新并返回一个新的 state

## Action
上面提到，action（动作）实质上是包含 type 属性的普通平面对象，这个 type 是我们实现用户行为追踪的关键

例如，增加一个待办事项 的 action 可能是像下面一样：
```js
{
  type: 'ADD_TODO', //必须包含这个type字段即可
  payload: {
    id: 1,
    content: '待办事项1',
    completed: false
  }
}
```
刨根问底，action 是谁生成的呢？

## Action Creator
> Action Creator 可以是同步的，也可以是异步的

顾名思义，Action Creator 是 action 的创造者，本质上就是一个函数，返回值是一个 action（对象）
例如下面就是一个 “新增一个待办事项” 的 Action Creator：
```js
var id = 1
function addTodo(content) {
  return {
    type: 'ADD_TODO',
    payload: {
      id: id++,
      content: content, // 待办事项内容
      completed: false  // 是否完成的标识
    }
  }
}
```

将该函数应用到一个表单（假设 store 为全局变量，并引入了 jQuery ）：
```js
<input type="text" id="todoInput" />
<button id="btn">提交</button>

<script>
$('#btn').on('click', function() {
  var content = $('#todoInput').val() // 获取输入框的值
  var action = addTodo(content) // 执行 Action Creator 获得 action
  store.dispatch(action) // 改变 state 的不二法门：dispatch 一个 action！！！
})
</script>
```
> 通俗点讲，Action Creator 用于绑定到用户的操作（点击按钮等），其返回值 action 用于之后的 dispatch(action)

刚刚提到过，action 明明就没有强制的规范，为什么 store.dispatch(action) 之后，
Redux 会明确知道是提取 action.payload，并且是对应写入到 state.todos 数组中？
又是谁负责“写入”的呢？

## Reducer
> Reducer 必须是同步的纯函数

用户每次 dispatch(action) 后，都会触发 reducer 的执行
reducer 的实质是一个函数，根据 action.type 来更新 state 并返回 nextState
最后会用 reducer 的返回值 nextState 完全替换掉原来的 state

> 注意：上面的这个 “更新” 并不是指 reducer 可以直接对 state 进行修改
Redux 规定，须先复制一份 state，在副本 nextState 上进行修改操作
例如，可以使用 lodash 的 cloneDeep，也可以使用 Object.assign / map / filter/ ... 等返回副本的函数

在上面 Action Creator 中提到的 待办事项的 reducer 大概是长这个样子 (为了容易理解，在此不使用 ES6 / Immutable.js)：
```js
var initState = {
  counter: 0,
  todos: []
}

function reducer(state, action) {
  // ※ 应用的初始状态是在第一次执行 reducer 时设置的 ※
  if (!state) state = initState
  
  switch (action.type) {
    case 'ADD_TODO':
      var nextState = _.cloneDeep(state) // 用到了 lodash 的深克隆
      nextState.todos.push(action.payload) 
      return nextState

    default:
    // 由于 nextState 会把原 state 整个替换掉
    // 若无修改，必须返回原 state（否则就是 undefined）
      return state
  }
}
```
> 通俗点讲，就是 reducer 返回啥，state 就被替换成啥

## 总结
- store 由 Redux 的 createStore(reducer) 生成
- state 通过 store.getState() 获取，本质上一般是一个存储着整个应用状态的对象
- action 本质上是一个包含 type 属性的普通对象，由 Action Creator (函数) 产生
- 改变 state 必须 dispatch 一个 action
- reducer 本质上是根据 action.type 来更新 state 并返回 nextState 的函数
- reducer 必须返回值，否则 nextState 即为 undefined
- 实际上，state 就是所有 reducer 返回值的汇总（本教程只有一个 reducer，主要是应用场景比较简单）
> Action Creator => action => store.dispatch(action) => reducer(state, action) => 原 state state = nextState

## Redux 进阶
1. compose
```js
function compose(...func) {
    let len = func.length
    if (len === 0) {
        return args => args;
    } else if (len === 1) {
        return func[0]
    }
    // fn3 -> fn2 -> fn1
    return func.reduce((a, b) => (...args) => a(b(...args)))
}
```

2. createStore
```js
/**
 * createStore 返回一个对象
 * dispatch:分发一个action
 * getState:得到当前的 state
 * subscribe:订阅一个监听器, 分发一个action后会自动执行，会返回一个函数，可以取消监听器
 * Symbol('observable'): 提案，暂时用不到
 * @param {function} reducer reducer，一个总的reducer
 * @param {any} defaultState 默认值
 * @param {any} enhanced 表示applyMiddleware 返回的函数
 */

import * as util from './util'
import * as actionType from './actionType'
export default function createStore(reducer, defaultState, enhanced){
  if(typeof defaultState === 'function'){
    //第二个是中间件函数
    enhanced = defaultState
    defaultState = undefined
  }
  if(typeof enhanced === 'function'){
    //进入applyMiddleware处理逻辑
    return enhanced(createStore)(reducer, defaultState)
  }

  let curReducer = reducer,
      curState = defaultState
  const listeners = []

  const dispatch = (action) => {
    //先判断action是不是平面对象
    if(!util.isPlainObject(action)){
       throw new TypeError('action must be an plain-object')
    }
    if(action.type === undefined){
      throw new TypeError('action must has a type property')
    }
    curState = curReducer(curState, action)
    listeners.forEach((d) => d())
  }

  const getState = () => curState;

  //订阅一个监听器，返回一个函数可以取消订阅
  const subscribe = (listener) => {
    listeners.push(listener)
    let isRemove = false
    return () => {
      if(!isRemove){
        let idx = listeners.indexOf(listener)
        listeners.splice(idx, 1)
        isRemove = true
      }
      return isRemove
    }
  }

  // 创建仓库时候需要dispatch初始化数据
  dispatch({
    type:actionType.INIT()
  })
  
  return {
    dispatch,
    getState,
    subscribe,
  }
}
```
> 详细分析移步url: https://juejin.im/post/6844904021442953224

