# 设计模式

为什么要学设计模式？
代码其实都不是一次性的，需要重复的迭代。
设计模式的最终目的，是能让我们的代码更加的健壮，可维护可扩展性更好。

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
