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
```
