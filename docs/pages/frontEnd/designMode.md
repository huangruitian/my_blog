# 设计模式

为什么要学设计模式？
代码其实都不是一次性的，需要重复的迭代。
设计模式的最终目的，是能让我们的代码更加的健壮，可维护可扩展性更好。
前端并不需要掌握全部的 23 种，只需要掌握常用，且能用的一些
道：五大原则，SOLID 设计原则
术：就像一些固定的公式，例如勾股定理

## SOLID 设计原则

1. 单一功能原则（重点）
2. 开放封闭原则（重点）
3. 里式替换原则
4. 接口隔离原则
5. 依赖反转原则

## 三种类型

1. 创建型
2. 结构型
3. 行为型

## 简单的工厂模式

1. 简单的工厂模式，就是为了实现无脑的传参

```js
function Factory(name, age, career, work) {
  return new User(name, age, career, work)
}

// 不同的工种，所做的事情不一样
function User(name, age, career, work) {
  this.workMap = new Map([
    ["coder", ["写代码", "写系分", "修Bug"]],
    ["productManager", ["订会议室", "写PRD", "催更"]],
    ["boss", ["喝茶", "看报", "见客户"]],
  ])
  this.name = name
  this.age = age
  this.career = career
  this.work = workMap.get(work) || []
}
```

2. 工厂模式其实就是将创建对象的过程单独封装，很像我们点菜，制作过程我们不必关心

## 抽象工厂模式

1. 约束抽象类（Abstract Factory）

```js
// 约定一部手机的组成
class MobilePhoneFactory {
  // 提供操作系统的接口
  createOS() {
    throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！")
  }
  // 提供硬件的接口
  createHardWare() {
    throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！")
  }
}
```

2. 化抽象为具体

```js
// 我们需要生成一个 Android 系统 + 高通硬件的手机
// 具体工厂继承自抽象工厂
class FakeStarFactory extends MobilePhoneFactory {
  createOS() {
    // 提供安卓系统实例
    return new AndroidOS()
  }
  createHardWare() {
    // 提供高通硬件实例
    return new QualcommHardWare()
  }
}
// 那其实软件和硬件是同一个道理
// 定义操作系统这类产品的抽象产品类
class OS {
  controlHardWare() {
    throw new Error("抽象产品方法不允许直接调用，你需要将我重写！")
  }
}

// 定义具体操作系统的具体产品类
class AndroidOS extends OS {
  controlHardWare() {
    console.log("我会用安卓的方式去操作硬件")
  }
}

class AppleOS extends OS {
  controlHardWare() {
    console.log("我会用🍎的方式去操作硬件")
  }
}

// 定义手机硬件这类产品的抽象产品类
class HardWare {
  // 手机硬件的共性方法，这里提取了“根据命令运转”这个共性
  operateByOrder() {
    throw new Error("抽象产品方法不允许直接调用，你需要将我重写！")
  }
}

// 定义具体硬件的具体产品类
class QualcommHardWare extends HardWare {
  operateByOrder() {
    console.log("我会用高通的方式去运转")
  }
}

class MiWare extends HardWare {
  operateByOrder() {
    console.log("我会用小米的方式去运转")
  }
}
// 这样我们就可以很轻松的组装安卓手机了
const myMobile = FakeStarFactory()
// 设备先拥有高通cpu
const myHardWare = myMobile.createHardWare()
// 拥有安卓的操作系统
const myOS = myMobile.createOS()
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder()
// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare()
```

3. 封装抽象的好处

```js
// 关键的时刻来了——假如有一天，FakeStar过气了，我们需要产出一款新机投入市场，这时候怎么办？
// 我们是不是不需要对抽象工厂MobilePhoneFactory做任何修改，只需要拓展它的种类：
class newStarFactory extends MobilePhoneFactory {
  createOS() {
    // 操作系统实现代码
  }
  createHardWare() {
    // 硬件实现代码
  }
}
// 这么个操作，对原有的系统不会造成任何潜在影响 所谓的“对拓展开放，对修改封闭”就这么圆满实现了。
// 前面我们之所以要实现抽象产品类，也是同样的道理。
```

4. 抽象工厂和简单工厂

- 简单工厂的使用场景里，处理的对象是类，并且是一些非常好对付的类——它们的共性容易抽离，同时因为逻辑本身比较简单，故而不苛求代码可扩展性。
- 抽象工厂本质上处理的其实也是类，但是是一帮非常棘手、繁杂的类，这些类中不仅能划分出门派，还能划分出等级，同时存在着千变万化的扩展可能性。
- 抽象工厂模式的定义，是围绕一个超级工厂创建其他工厂。
- 比如手机（抽象工厂）- 安卓手机（具体工厂）- 抽象产品（比如硬件，操作系统）- 小米手机（具体产品）

## 单例模式

1. 定义
   保证一个类仅有一个实例，并且一个访问它的全局访问点。
2. 实现

```js
var Singleton = function (name) {
  this.name = name
  this.instance = null
}
Singleton.prototype.getName = function (name) {
  return this.name
}
// 获取单例
Singleton.prototype.getInstance = function (name) {
  if (!this.instance) {
    this.instance = new Singleton(name)
  }
  return this.instance
}
var a = Singleton.getInstance("a")
var b = Singleton.getInstance("b")
console.log(a === b)

// 闭包实现
Singleton.prototype.getInstance = (function () {
  let instance = null
  return (name) => {
    if (!instance) {
      instance = new Singleton(name)
    }
    return instance
  }
})()
```

## 原型模式

1. 在原型模式下，当我们想要创建一个对象时，会先找到一个对象作为原型，然后通过克隆原型的方式来创建出一个与原型一样（共享一套数据/方法）的对象。在 JavaScript 里，Object.create 方法就是原型模式的天然实现——准确地说，只要我们还在借助 Prototype 来实现对象的创建和原型的继承，那么我们就是在应用原型模式。

## 装饰器

1. 装饰器模式，又名装饰者模式。它的定义是“在不改变原对象的基础上，通过对其进行包装拓展，使原有对象可以满足用户的更复杂需求”。

2. 实现

```js
// 想象这里有一坨屎山，它虽然实现了业务功能，但代码乱七八糟
// 如果直接修改原来的代码，直接违背了开放封闭原则
var falsebbb = "rld",
  aaatrue = "hel",
  shit = "lo wo",
  dsadq2 = aaatrue + shit + falsebbb
// 我们把屎山的逻辑抽离出来，包装成函数
function oldShit() {
  // 屎山，也就是上面的代码
}
// 老板让我们加一个新功能，我们把新功能写在新函数里
function newShit() {
  // 自己写的新屎山
}
// 把新旧功能合并包装一下
function moreShit() {
  oldShit()
  newShit()
}
// 这种“只添加，不修改”的模式就是装shi器模式，newShit即装shi器
// react 最长用的hoc就是装饰器的运用，es7已经成为了标准
```

## 适配器(adapter)

1. 适配器模式通过把一个类的接口变换成客户端所期待的另一种接口，可以帮我们解决不兼容的问题。

2. 适配器的核心——把变化留给自己，把统一留给用户。在 axios 上，所有关于 http 模块、关于 xhr 的实现细节，全部被 Adapter 封装进了自己复杂的底层逻辑里，暴露给用户的都是十分简单的统一的东西——统一的接口，统一的入参，统一的出参，统一的规则。

## 代理模式

## 观察者模式

- 观察者模式定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个目标对象，当这个目标对象的状态发生变化时，会通知所有观察者对象，使它们能够自动更新。

1. 发布者类，订阅者

```js
// 定义发布者类
class Publisher {
  constructor() {
    this.observers = []
    console.log("Publisher created")
  }
  // 增加订阅者
  add(observer) {
    console.log("Publisher.add invoked")
    this.observers.push(observer)
  }
  // 移除订阅者
  remove(observer) {
    console.log("Publisher.remove invoked")
    this.observers.forEach((item, i) => {
      if (item === observer) {
        this.observers.splice(i, 1)
      }
    })
  }
  // 通知所有订阅者
  notify() {
    console.log("Publisher.notify invoked")
    this.observers.forEach((observer) => {
      observer.update(this)
    })
  }
}

// 定义订阅者类
class Observer {
  constructor() {
    console.log("Observer created")
  }

  update() {
    console.log("Observer.update invoked")
  }
}
```

2. 扩展

```js
// 定义一个具体的需求文档（prd）发布类
class PrdPublisher extends Publisher {
  constructor() {
    super()
    // 初始化需求文档
    this.prdState = null
    // 韩梅梅还没有拉群，开发群目前为空
    this.observers = []
    console.log("PrdPublisher created")
  }

  // 该方法用于获取当前的prdState
  getState() {
    console.log("PrdPublisher.getState invoked")
    return this.prdState
  }

  // 该方法用于改变prdState的值
  setState(state) {
    console.log("PrdPublisher.setState invoked")
    // prd的值发生改变
    this.prdState = state
    // 需求文档变更，立刻通知所有开发者
    this.notify()
  }
}

// 订阅者
class DeveloperObserver extends Observer {
    constructor() {
        super()
        // 需求文档一开始还不存在，prd初始为空对象
        this.prdState = {}
        console.log('DeveloperObserver created')
    }

    // 重写一个具体的update方法
    update(publisher) {
        console.log('DeveloperObserver.update invoked')
        // 更新需求文档
        this.prdState = publisher.getState()
        // 调用工作函数
        this.work()
    }

    // work方法，一个专门搬砖的方法
    work() {
        // 获取需求文档
        const prd = this.prdState
        // 开始基于需求文档提供的信息搬砖。。。
        ...
        console.log('996 begins...')
    }
}

// 创建订阅者：前端开发李雷
const liLei = new DeveloperObserver()
// 创建订阅者：服务端开发小A（sorry。。。起名字真的太难了）
const A = new DeveloperObserver()
// 创建订阅者：测试同学小B
const B = new DeveloperObserver()
// 韩梅梅出现了
const hanMeiMei = new PrdPublisher()
// 需求文档出现了
const prd = {
    // 具体的需求内容
    ...
}
// 韩梅梅开始拉群
hanMeiMei.add(liLei)
hanMeiMei.add(A)
hanMeiMei.add(B)
// 韩梅梅发送了需求文档，并@了所有人
hanMeiMei.setState(prd)
```

## 发布 - 订阅模式

1. 观察者模式与发布-订阅模式的区别是什么？

```js
// 观察者模式（没有事件中心）
// 被观察者（Publisher） -（通知变化）-> 观察者（Observer）
// 被观察者（Publisher） <-（订阅事件）- 观察者（Observer）

// 发布-订阅
// 发布者 -（通知变化）-> 事件中心（EventEmitter） -（通知变化）-> 订阅者
// 发布者 --> 事件中心（EventEmitter） -（订阅事件）-> 订阅者

// 总结：发布-订阅模式，事件的注册和触发发生在独立于双方的第三方平台。观察者模式：发布者会直接触及到订阅者。
```

2. 实现发布-订阅

```js
class EventEmitter {
  constructor() {
    // handlers是一个map，用于存储事件与回调之间的对应关系
    this.handlers = {}
  }

  // on方法用于安装事件监听器，它接受目标事件名和回调函数作为参数
  on(eventName, cb) {
    // 先检查一下目标事件名有没有对应的监听函数队列
    if (!this.handlers[eventName]) {
      // 如果没有，那么首先初始化一个监听函数队列
      this.handlers[eventName] = []
    }

    // 把回调函数推入目标事件的监听函数队列里去
    this.handlers[eventName].push(cb)
  }

  // emit方法用于触发目标事件，它接受事件名和监听函数入参作为参数
  emit(eventName, ...args) {
    // 检查目标事件是否有监听函数队列
    if (this.handlers[eventName]) {
      // 这里需要对 this.handlers[eventName] 做一次浅拷贝，主要目的是为了避免通过 once 安装的监听器在移除的过程中出现顺序问题
      const handlers = this.handlers[eventName].slice()
      // 如果有，则逐个调用队列里的回调函数
      handlers.forEach((callback) => {
        callback(...args)
      })
    }
  }

  // 移除某个事件回调队列里的指定回调函数
  off(eventName, cb) {
    const callbacks = this.handlers[eventName]
    // cb 避免使用匿名函数
    const index = callbacks.indexOf(cb)
    if (index !== -1) {
      callbacks.splice(index, 1)
    }
  }

  // 为事件注册单次监听器
  once(eventName, cb) {
    // 对回调函数进行包装，使其执行完毕自动被移除
    const wrapper = (...args) => {
      cb(...args)
      this.off(eventName, wrapper)
    }
    this.on(eventName, wrapper)
  }
}
```
