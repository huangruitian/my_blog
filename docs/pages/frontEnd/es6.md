## let 和 const
1. 不会被提升，也就是穿透{}
```js
if (false) {
    let value = 1;
}
console.log(value); // Uncaught ReferenceError: value is not defined
```
2. 重复声明报错
```js
var value = 1;
let value = 2; // Uncaught SyntaxError: Identifier 'value' has already been declared
```
3. 不绑定全局作用域
```js
var value = 1;
console.log(window.value); // 1

let value = 1;
console.log(window.value); // undefined
```
4. const 会琐死内存地址，也就是说不允许修改地址
```js
const data = {
    value: 1
}

// 没有问题
data.value = 2;
data.num = 3;

// 报错
data = {}; // Uncaught TypeError: Assignment to constant variable.
```
5. TDZ 暂时性死去
```js
console.log(typeof value); // Uncaught ReferenceError: value is not defined
let value = 1;
```
看一个例子：
```js
// 结果是 'c';
// 那如果把 var 改成 let 或者 const 呢？
// 使用 let，结果自然会是 'a'，const 呢？ 报错还是 'a'?
// 结果是正确打印 'a'，这是因为在 for in 循环中，每次迭代不会修改已有的绑定，而是会创建一个新的绑定。
var funcs = [], object = {a: 1, b: 1, c: 1};
for (var key in object) {
    funcs.push(function(){
        console.log(key)
    });
}

funcs[0]()
```

# 模版字符串
1. 基础用法
```js
let message = `Hello World`;
console.log(message);
```
2. 如果遇到一些特别的符号，可以利用反斜杠\转移
```js
// 转移反撇号
let message = `Hello \` World`;
console.log(message);
```
3. 嵌入表达式
```js
let x = 1, y = 2;
let message = `<ul><li>${x}</li><li>${x + y}</li></ul>`;
console.log(message); // <ul><li>1</li><li>3</li></ul>
```
4. 值得一提的是，模板字符串支持嵌套
```js
let arr = [{value: 1}, {value: 2}];
let message = `
	<ul>
		${arr.map((item) => {
			return `
				<li>${item.value}</li>
			`
		})}
	</ul>
`;
console.log(message);
```
## 箭头函数
主要是箭头函数和普通函数的区别，箭头函数的功能定义的非常准确，就是一个普通的函数表达式或者方法；

1. 箭头函数没有 this，所以需要通过查找作用域链来确定 this 的值。
- 这就意味着如果箭头函数被非箭头函数包含，this 绑定的就是最近一层非箭头函数的 this。
- 因为箭头函数没有 this，所以也不能用 call()、apply()、bind() 这些方法改变 this 的指向，可以看一个例子：
```js
var value = 1;
var result = (() => this.value).bind({value: 2})();
console.log(result); // 1
```

2. 不能通过 new 关键字调用
3. 没有 arguments
4. 没有 new.target
5. 没有原型
6. 没有 super

一个值得注意的例子：
```js
// 箭头函数没有 this，所以需要通过查找作用域链来确定 this 的值。
var obj = {
  i: 10,
  b: () => console.log(this.i, this),
  c: function() {
    console.log( this.i, this)
  }
}
obj.b();
// undefined Window
obj.c();
// 10, Object {...}
```

## Symbol
1. Symbol 值通过 Symbol 函数生成，使用 typeof，结果为 "symbol"
2. Symbol 函数前不能使用 new 命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。
3. instanceof 的结果为 false
```js
var s = Symbol('foo');
console.log(s instanceof Symbol); // false
```
4. Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
5. 如果 Symbol 的参数是一个对象，就会调用该对象的 toString 方法，将其转为字符串，然后才生成一个 Symbol 值。
6. Symbol 函数的参数只是表示对当前 Symbol 值的描述，相同参数的 Symbol 函数的返回值是不相等的。
7. Symbol 值不能与其他类型的值进行运算，会报错。
8. Symbol 值可以显式转为字符串。
9. Symbol 值可以作为标识符，用于对象的属性名，可以保证不会出现同名的属性。
10. Symbol 作为属性名，该属性不会出现在 for...in、for...of 循环中，也不会被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify() 返回。但是，它也不是私有属性，有一个 Object.getOwnPropertySymbols 方法，可以获取指定对象的所有 Symbol 属性名。
```js
var obj = {};
var a = Symbol('a');
var b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

var objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols);
// [Symbol(a), Symbol(b)]
```
11. 如果我们希望使用同一个 Symbol 值，可以使用 Symbol.for。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。
```js
var s1 = Symbol.for('foo');
var s2 = Symbol.for('foo');

console.log(s1 === s2); // true
```

12. Symbol.keyFor 方法返回一个已登记的 Symbol 类型值的 key。
```js
var s1 = Symbol.for("foo");
console.log(Symbol.keyFor(s1)); // "foo"

var s2 = Symbol("foo");
console.log(Symbol.keyFor(s2) ); // undefined
```

## 迭代器与 for of
1. 迭代器
```js
function createIterator(items) {
    var i = 0;
    return {
        next: function() {
            var done = i >= item.length;
            var value = !done ? items[i++] : undefined;

            return {
                done: done,
                value: value
            };
        }
    };
}

// iterator 就是一个迭代器对象
var iterator = createIterator([1, 2, 3]);

console.log(iterator.next()); // { done: false, value: 1 }
console.log(iterator.next()); // { done: false, value: 2 }
console.log(iterator.next()); // { done: false, value: 3 }
console.log(iterator.next()); // { done: true, value: undefined }
```
2. for of
ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性，或者说，一个数据结构只要具有 Symbol.iterator 属性，就可以认为是"可遍历的"（iterable）。就可以使用for of;

由此，我们也可以发现 for of 遍历的其实是对象的 Symbol.iterator 属性。

举个例子：
```js
const obj = {
    value: 1
};

for (value of obj) {
    console.log(value);
}

// TypeError: iterator is not iterable
```
我们直接 for of 遍历一个对象，会报错，然而如果我们给该对象添加 Symbol.iterator 属性：
```js
const obj = {
    value: 1
};

obj[Symbol.iterator] = function() {
    return createIterator([1, 2, 3]);
};

for (value of obj) {
    console.log(value);
}

// 1
// 2
// 3
```
有一些数据结构默认部署了Symbol.iterator 属性。
- 数组
- Set
- Map
- 类数组对象，如 arguments 对象、DOM NodeList 对象
- Generator 对象
- 字符串

## WeakMap
在 JavaScript 中，一般我们创建一个对象，都是建立一个强引用：
```js
var obj = new Object();
```
只有当我们手动设置 obj = null 的时候，才有可能回收 obj 所引用的对象。

而如果我们能创建一个弱引用的对象：
```js
// 假设可以这样创建一个
var obj = new WeakObject();
```
我们什么都不用做，只用静静的等待垃圾回收机制执行，obj 所引用的对象就会被回收。

## Promise
1. 难以复用
- 回调的顺序确定下来之后，想对其中的某些环节进行复用也很困难，牵一发而动全身。

2. 堆栈信息被断开

我们知道，JavaScript 引擎维护了一个执行上下文栈，当函数执行的时候，会创建该函数的执行上下文压入栈中，当函数执行完毕后，会将该执行上下文出栈。

如果 A 函数中调用了 B 函数，JavaScript 会先将 A 函数的执行上下文压入栈中，再将 B 函数的执行上下文压入栈中，当 B 函数执行完毕，将 B 函数执行上下文出栈，当 A 函数执行完毕后，将 A 函数执行上下文出栈。

这样的好处在于，我们如果中断代码执行，可以检索完整的堆栈信息，从中获取任何我们想获取的信息。

可是异步回调函数并非如此，比如执行 fs.readdir 的时候，其实是将回调函数加入任务队列中，代码继续执行，直至主线程完成后，才会从任务队列中选择已经完成的任务，并将其加入栈中，此时栈中只有这一个执行上下文，如果回调报错，也无法获取调用该异步操作时的栈中的信息，不容易判定哪里出现了错误。

此外，因为是异步的缘故，使用 try catch 语句也无法直接捕获错误。(不过 Promise 并没有解决这个问题)

3. 借助外层变量

当多个异步计算同时进行，比如这里遍历读取文件信息，由于无法预期完成顺序，必须借助外层作用域的变量，比如这里的 count、errored、stats 等，不仅写起来麻烦，而且如果你忽略了文件读取错误时的情况，不记录错误状态，就会接着读取其他文件，造成无谓的浪费。此外外层的变量，也可能被其它同一作用域的函数访问并且修改，容易造成误操作。

**之所以单独讲讲回调地狱，其实是想说嵌套和缩进只是回调地狱的一个梗而已，它导致的问题远非嵌套导致的可读性降低而已。**

### Promise
Promise 使得以上绝大部分的问题都得到了解决。
1. 嵌套问题
```js
request(url)
.then(function(result) {
    return writeFileAsynv('1.txt', result)
})
.then(function(result) {
    return request(url2)
})
.catch(function(e){
    handleError(e)
});
```

Promise 局限性：

1. 错误被吃掉
```js
let promise = new Promise(() => {
    throw new Error('error')
});
console.log(2333333);
```
Promise 链中的错误很容易被忽略掉，这也是为什么会一般推荐在 Promise 链的最后添加一个 catch 函数，因为对于一个没有错误处理函数的 Promise 链，任何错误都会在链中被传播下去，直到你注册了错误处理函数。

2. 单一值

Promise 只能有一个完成值或一个拒绝原因，然而在真实使用的时候，往往需要传递多个值，一般做法都是构造一个对象或数组，然后再传递，then 中获得这个值后，又会进行取值赋值的操作，每次封装和解封都无疑让代码变得笨重。

说真的，并没有什么好的方法，建议是使用 ES6 的解构赋值：
```js
Promise.all([Promise.resolve(1), Promise.resolve(2)])
.then(([x, y]) => {
    console.log(x, y);
});
```

3. 无法取消

Promise 一旦新建它就会立即执行，无法中途取消。


4. 无法得知 pending 状态

当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

**细节**
1. 未决阶段的处理函数是同步的，会立即执行

2. thenable和catchable函数是异步的，就算是立即执行，也会加入到事件队列中等待执行，并且，加入的队列是微队列

3. pro.then可以只添加thenable函数，pro.catch可以单独添加catchable函数

4. 在未决阶段的处理函数中，如果发生未捕获的错误，会将状态推向rejected，并会被catchable捕获

5. 一旦状态推向了已决阶段，无法再对状态做任何更改

6. **Promise并没有消除回调，只是让回调变得可控**

Promise对象中，无论是then方法还是catch方法，它们都具有返回值，返回的是一个全新的Promise对象，它的状态满足下面的规则：

1. 如果当前的Promise是未决的，得到的新的Promise是挂起状态
2. 如果当前的Promise是已决的，会运行响应的后续处理函数，并将后续处理函数的结果（返回值）作为resolved状态数据，应用到新的Promise中；如果后续处理函数发生错误，则把返回值作为rejected状态数据，应用到新的Promise中。
3. 如果后续的处理出错了，出错信息的会传递到下个Promise 的 resolved 中
4. Promise并没有减少代码，而是让回调地狱消除，可控了

**后续的Promise一定会等到前面的Promise有了后续处理结果后，才会变成已决状态**

如果前面的Promise的后续处理，返回的是一个Promise，则返回的新的Promise状态和后续处理返回的Promise状态保持一致。

### Promise API
1. 原型成员（实例成员）
- then：注册一个后续处理函数，当Promise为resolved状态时运行该函数
- catch：注册一个后续处理函数，当Promise为rejected状态时运行该函数
- finally：[ES2018]注册一个后续处理函数（无参），当Promise为已决时运行该函数

2. 构造函数成员 （静态成员）
- resolve(数据)：该方法返回一个resolved状态的Promise，传递的数据作为状态数据
  - 特殊情况：如果传递的数据是Promise，则直接返回传递的Promise对象

- reject(数据)：该方法返回一个rejected状态的Promise，传递的数据作为状态数据

- all(iterable)：这个方法返回一个新的promise对象，该promise对象在iterable参数对象里所有的promise对象都成功的时候才会触发成功，一旦有任何一个iterable里面的promise对象失败则立即触发该promise对象的失败。这个新的promise对象在触发成功状态以后，会把一个包含iterable里所有promise返回值的数组作为成功回调的返回值，顺序跟iterable的顺序保持一致；如果这个新的promise对象触发了失败状态，它会把iterable里第一个触发失败的promise对象的错误信息作为它的失败错误信息。Promise.all方法常被用于处理多个并行的promise对象的状态集合。

- 注意: all必须全部完成，才会触发then，有一个失败，都会触发catch

- race(iterable)：当iterable参数里的任意一个子promise被成功或失败后，父promise马上也会用子promise的成功返回值或失败详情作为参数调用父promise绑定的相应句柄，并返回该promise对象

一道并发数题目：
```js
// 最大并发数maxNum
// 每当有一个请求返回，就留下一个空位，可以增加新的请求
// 所有请求完成之后，按照 urls 顺序依次打印结果
// 这题如果maxNum 为无限大，其实就是在让你实现Promise.all
// 如果是有一个失败就返回 就是Promise.race  
function multiRequest(urls = [], maxNum) {
    let result = new Array(urls.length).fill(false)
    let sum = urls.length; //总数
    let count = 0;         //已完成数
    return new Promise((resolve, reject) => {
        //先请求maxNum个呗    
        while (count < maxNum) {
            next()
        }
        // 递归next函数
        function next() {
            let current = count++
            // 边界
            if (current >= sum) {
                !result.includes(false) && resolve(result)
                return
            }
            let url = urls[current];
            console.log("开始：" + current, new Date().toLocaleString());
            fetch(url).then((res) => {
                console.log("结束：" + current, new Date().toLocaleString());
                result[current] = res
                //还有未完成，递归；
                if (current < sum) {
                    next()
                }
            }).catch((err) => {
                console.log("结束：" + current, new Date().toLocaleString());
                result[current] = err
                if (current < sum) {
                    next()
                }
            })
        }
    })
}
let url2 = `https://api.github.com/search/users?q=d`;
let arr = new Array(100).fill(url2)
multiRequest(arr, 10).then((res) => {
    console.log(res)
})
```

## Generator


## Async

ES2017 标准引入了 async 函数，使得异步操作变得更加方便。

在异步处理上，async 函数就是 Generator 函数和 Promise 的语法糖。

async 用于修饰函数（无论是函数字面量还是函数表达式），放置在函数最开始的位置，被修饰函数的返回结果一定是 Promise 对象。

```js
async function test(){
    console.log(1);
    return 2;
}

//等效于
function test(){
    return new Promise((resolve, reject)=>{
        console.log(1);
        resolve(2);
    })
}
```

**await关键字必须出现在async函数中！！！！**

await用在某个表达式之前，如果表达式是一个Promise，则得到的是thenable中的状态数据。

```js
async function test1(){
    console.log(1);
    return 2;
}
async function test2(){
    const result = await test1();
    console.log(result);
}
test2();
```

等效于

```js
function test1(){
    return new Promise((resolve, reject)=>{
        console.log(1);
        resolve(2);
    })
}

function test2(){
    return new Promise((resolve, reject)=>{
        test1().then(data => {
            const result = data;
            console.log(result);
            resolve();
        })
    })
}

test2();

```

如果await的表达式不是Promise，则会将其使用Promise.resolve包装后按照规则运行

更准确来说，await xxx 其实就相当于new 一个promise 之后进行resolved(xxx)

```js
// 复习一道经典的event lop
console.log(1)
setTimeout(()=>{console.log(2)}, 1000)
async function fn(){
    console.log(3)
    setTimeout(()=>{console.log(4)}, 20)
    return Promise.reject()
}
async function run(){
    console.log(5)
    await fn()
    console.log(6)
}
run()
//需要执行150ms左右
for(let i=0; i<90000000; i++){}
setTimeout(()=>{
    console.log(7)
    new Promise(resolve=>{
        console.log(8)
        resolve()
    }).then(()=>{console.log(9)})
}, 0)
console.log(10)
// 1 5 3 10 -> 4 7 8 9 -> 2
```

## 装饰器
装饰器主要用于:装饰类、装饰方法或属性

1. 装饰类
参考：https://juejin.im/post/59f1c484f265da431c6f8940#heading-0







