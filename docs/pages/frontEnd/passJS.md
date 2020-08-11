# 必须掌握的js核心
## js 数据类型
1. 原始数据类型
- string
- boolean
- number
- undefined
- null
- symbool
- bigInt

2. 引用数据类型
- object
- function(其实也是object) 

如何具体的判断一个类型？
Object.prototype.toString.call(type)

还有啥办法如何判断一个数组？
Array.isArray()

## new 原理
```js
function newObject(fn){
   let obj = {}
   let Constructor = [].shift.call(arguments)
   obj.__proto__ = Constructor.prototype
   let result = Constructor.apply(obj, arguments)
   return result instanceof Object ? result : obj
}
```

## call 和 apply、bind
- 将函数设置为对象的属性
- 执行该函数
- 删除该函数
```js
Function.prototype.call2 = function(context){
    var context = context || window;
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++){
        args.push('arguments['+ i +']');
    }
    var result = eval('context.fn(' + args + ')');
    delete context.fn;
    return result;
}
```

```js
Function.prototype.apply2 = function(context, arr = []){
    var context =  Object(context) || window;
    context.fn = this;
   
    var args = [];
    for(var i = 0, len = arr.length; i < len; i++){
      args.push('arr['+ i +']');
    }
    var result = eval('context.fn(' + args + ')');
    delete context.fn;
    return result;
}
```
```js
Function.prototype.bind2 = function(context){
  if(typeof this != 'function'){
     throw new Error('bind is not a function') 
  }
  // 拿到bind的参数   
  var args = [].slice.call(arguments, 1)
  // 当前的函数this
  var self = this;

  var fNOP = function(){}
  var fBind = function (){
     var bindArgs = Array.prototype.slice.call(arguments);
     // 如果是new的话，this instanceof fNOP === true
     return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs))
  }

  // 接原型 Object.create(this.prototype)   
  fNOP.prototype = this.prototype
  fBind.prototype = new fNOP()
  return fBind
}
```
## 深拷贝
```js
function deepClone(obj, hash = new WeakMap()){
   if(obj === null) return obj;
   if(obj instanceof Date) return new Date(obj);
   if(obj instanceof RegExp) return new RegExp(obj);
   // 函数和原始值不需要深拷贝    
   if(typeof obj !== 'object') return obj;
   // 先找循环引用 
   if(hash.has(obj)) return hash.get(obj);
   // 对对象克隆   
   let cloneObj = new obj.constructor()
   // 避免循环引用   
   hash.set(obj, cloneObj);
   for(let key in obj){
       // 避免原型链上的属性；    
       if(obj.hasOwnProperty(key)){
         cloneObj[key] = deepClone(obj[key], hash)
       }
   }
   return cloneObj
}
```
## 继承
1. 传统的原型链继承
- 过多的继承了无用的属性
2. 借用构造函数call apply
- 不能继承借用构造函数的原型
- 每次构造函数都要多走一个函数（浪费性能）
3. 共享原型
- 不能随便改动原型
4. 圣杯模式
```js
function inherit(Target, Origin){
   function F(){} 
   F.prototype = Origin.prototype
   Target.prototype = new F()
   Target.prototype.constuctor = Target;
   Target.prototype.uber = Origin.prototype
}
```
5. 寄生组合继承
```js
  function Parent5 () {
    this.name = 'parent5';
    this.play = [1, 2, 3];
  }
  function Child5() {
    Parent5.call(this);
    this.type = 'child5';
  }
  Child5.prototype = Object.create(Parent5.prototype);
  Child5.prototype.constructor = Child5;
```

## 防抖节流
1. 防抖，你尽管触发；我n秒后才执行；
```js
function debounce(func, wait){
   var time = null;
   return function(){
      var context = this;
      var args = [].slice.call(arguments)
      clearTimeout(time);
      time = setTimeout(() => {
         func.apply(context, args)
      }, wait) 
   } 
}
```
2. 到时间了我再发车
```js
const throttle = function(fn, wait){
    let last = 0;
    return function(){
       let args = [].slice.call(arguments);
       let now = + new Date();
       if(now - last < wait){
           return;
       }
       last = now;
       fn.apply(this, args)
    }
}
```
debounce 会有一个问题，就是一直点击；事件就不会触发（利用节流来优化防抖）
```js
function debounce(func, wait){
   var time = null, last = 0;
   return function(){
      var context = this;
      var args = [].slice.call(arguments)
      var now = +new Date()

      if(now - last < wait){
        clearTimeout(time);
        time = setTimeout(() => {
           last = now
           func.apply(context, args)
        }, wait) 
      }else{
           last = now
           func.apply(context, args)
      }
   } 
}
```
