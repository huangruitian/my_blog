## React 性能优化
1. 虚拟化长了列表（react-window）

2. shouldComponentUpdate
- 大部分情况下，你可以继承 React.PureComponent 以代替手写 shouldComponentUpdate
- React.PureComponent 中以浅层对比 prop 和 state 的方式来实现了shouldComponentUpdate。
```js
// 默认值
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

3. React.memo 
- 仅检查 props 变更。
- 如果函数组件被 React.memo 包裹，且其实现中拥有 useState 或 useContext 的 Hook，当 context 发生变化时，它仍会重新渲染。
- 默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。
```js
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```
> 与 class 组件中 shouldComponentUpdate() 方法不同的是，如果 props 相等，areEqual 会返回 true；如果 props 不相等，则返回 false。这与 shouldComponentUpdate 方法的返回值相反。

4. React.lazy
- 允许你定义一个动态加载的组件。这有助于缩减 bundle 的体积，并延迟加载在初次渲染时未用到的组件。
```js
import React from 'react';

// 该组件是动态加载的
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // 显示 <Spinner> 组件直至 OtherComponent 加载完成
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

5. 什么是 immutable 数据？它有什么优势？
immutable 数据一种利用结构共享形成的持久化数据结构，一旦有部分被修改，那么将会返回一个全新的对象，并且原来相同的节点会直接共享。

具体点来说，immutable 对象数据内部采用是多叉树的结构，凡是有节点被改变，那么它和与它相关的所有上级节点都更新。

其实也就是ES6的解构赋值：
```js
let oldObj = {
   children:[],
   name:'xiaoming'
}
// 共享没有改变的部分
// 但是我们是手动的，immutable 有 API 更方便操作
// 但如果我们没有更新name，这样的方式会返回不一样的引用；
// immutable 在数据量大的情况下，序列化一次会有性能影响；
let newObj = {
   ...oldObj,
   name:'heihei'
}
```

### diff 算法
由于Diff操作本身也会带来性能损耗，React文档中提到，即使在最前沿的算法中，将前后两棵树完全比对的算法的复杂程度为 O(n 3 )，其中n是树中元素的数量。

如果在React中使用了该算法，那么展示1000个元素所需要执行的计算量将在十亿的量级范围。这个开销实在是太过高昂。

为了降低算法复杂度，React的diff会预设三个限制：
1. 只对同级元素进行Diff。如果一个DOM节点在前后两次更新中跨越了层级，那么React不会尝试复用他。

2. 两个不同类型的元素会产生出不同的树。如果元素由div变为p，React会销毁div及其子孙节点，并新建p及其子孙节点。

3. 开发者可以通过 key prop来暗示哪些子元素在不同的渲染下能保持稳定。

来看个例子：
```js
// 更新前
<div>
  <p key="xiao">xiao</p>
  <h3 key="ming">ming</h3>
</div>

// 更新后
<div>
  <h3 key="ming">ming</h3>
  <p key="xiao">xiao</p>
</div>
```
如果没有key，React会认为div的第一个子节点由p变为h3，第二个子节点由h3变为p。这符合限制2的设定，会销毁并新建。

但是当我们用key指明了节点前后对应关系后，React知道key === "xiao"的p在更新后还存在，所以DOM节点可以复用，只是需要交换下顺序。

这就是React为了应对算法性能瓶颈做出的三条限制。

那如何做diff呢？
可以从同级的节点数量将Diff分为两类：
1. 当newChild类型为object、number、string，代表同级只有一个节点
2. 当newChild类型为Array，同级有多个节点

先来看diff单个节点：
```js
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  
  // 首先判断是否存在对应DOM节点
  while (child !== null) {
    // 上一次更新存在DOM节点，接下来判断是否可复用

    // 首先比较key是否相同
    if (child.key === key) {

      // key相同，接下来比较type是否相同

      switch (child.tag) {
        // ...省略case
        
        default: {
          if (child.elementType === element.type) {
            // type相同则表示可以复用
            // 返回复用的fiber
            return existing;
          }
          
          // type不同则跳出循环
          break;
        }
      }
      // 代码执行到这里代表：key相同但是type不同
      // 将该fiber及其兄弟fiber标记为删除
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // key不同，仅将该fiber标记为删除
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }
  // 创建新Fiber，并返回 ...省略
}
```
从代码可以看出，React通过先判断key是否相同，如果key相同则判断type是否相同，只有都相同时一个DOM节点才能复用。

这里有个细节需要关注下：
- 当child !== null且key相同且type不同时执行deleteRemainingChildren将child及其兄弟fiber都标记删除。
- 当child !== null且key不同时仅将child标记删除。

考虑如下例子：

当前页面有3个li，我们要全部删除，再插入一个p。
```js
// 当前页面显示的
ul > li * 3

// 这次需要更新的
ul > p
```

由于本次更新时只有一个p，属于单一节点的Diff，会走上面介绍的代码逻辑。

在reconcileSingleElement中遍历之前的3个fiber（对应的DOM为3个li），寻找本次更新的p是否可以复用之前的3个fiber中某个的DOM。

当key相同且type不同时，代表我们已经找到本次更新的p对应的上次的fiber，但是p与li type不同，不能复用。既然唯一的可能性已经不能复用，则剩下的fiber都没有机会了，所以都需要标记删除。

当key不同时只代表遍历到的该fiber不能被p复用，后面还有兄弟fiber还没有遍历到。所以仅仅标记该fiber删除。

再来看多个节点diff：
```js
function List () {
  return (
    <ul>
      <li key="0">0</li>
      <li key="1">1</li>
      <li key="2">2</li>
      <li key="3">3</li>
    </ul>
  )
}

// 他的返回值JSX对象的children属性不是单一节点，而是包含四个对象的数组
{
  $$typeof: Symbol(react.element),
  key: null,
  props: {
    children: [
      {$$typeof: Symbol(react.element), type: "li", key: "0", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "1", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "2", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "3", ref: null, props: {…}, …}
    ]
  },
  ref: null,
  type: "ul"
}
```

这种情况下，reconcileChildFibers的newChild参数类型为Array，在reconcileChildFibers函数内部对应如下情况：
```js
  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...省略
  }
```

这样，就会开启多个节点的diff。
我们不放来把多个节点的更新情况考虑清楚：
1. 节点更新
```js
// 之前
<ul>
  <li key="0" className="before">0<li>
  <li key="1">1<li>
</ul>

// 之后 情况1 —— 节点属性变化
<ul>
  <li key="0" className="after">0<li>
  <li key="1">1<li>
</ul>

// 之后 情况2 —— 节点类型更新
<ul>
  <div key="0">0<li>
  <li key="1">1<li>
</ul>
```

2. 节点新增或减少
```js
// 之前
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
</ul>

// 之后 情况1 —— 新增节点
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
  <li key="2">2<li>
</ul>

// 之后 情况2 —— 删除节点
<ul>
  <li key="1">1<li>
</ul>
```

3. 节点位置变化
```js
// 之前
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
</ul>

// 之后
<ul>
  <li key="1">1<li>
  <li key="0">0<li>
</ul>
```

同级多个节点的Diff，一定属于以上三种情况中的一种或多种。
也就是说所有的情况都是以这三种为基础组合的；

### Diff的思路
该如何设计算法呢？如果让我设计一个Diff算法，我首先想到的方案是：

- 判断当前节点的更新属于哪种情况
- 如果是新增，执行新增逻辑
- 如果是删除，执行删除逻辑
- 如果是更新，执行更新逻辑

按这个方案，其实有个隐含的前提——不同操作的优先级是相同的；

但是React团队发现，在日常开发中，相较于新增和删除，更新组件发生的频率更高。所以Diff会优先判断当前节点是否属于更新。
> 在我们做数组相关的算法题时，经常使用双指针从数组头和尾同时遍历以提高效率，但是这里却不行。
> 虽然本次更新的JSX对象 newChildren为数组形式，但是和newChildren中每个组件进行比较的是current fiber，同级的Fiber节点是由sibling指针链接形成的单链表，即不支持双指针遍历。
> 即 newChildren[0]与fiber比较，newChildren[1]与fiber.sibling比较。所以无法使用双指针优化。

基于以上原因，Diff算法的整体逻辑会经历两轮遍历：

第一轮遍历：处理更新的节点。

第二轮遍历：处理剩下的不属于更新的节点。

### 第一轮遍历步骤如下：
1. let i = 0，遍历newChildren，将newChildren[i]与oldFiber比较，判断DOM节点是否可复用。
2. 如果可复用，i++，继续比较newChildren[i]与oldFiber.sibling，可以复用则继续遍历。
3. 如果不可复用，分两种情况：
- key不同导致不可复用，立即跳出整个遍历，**第一轮遍历结束。**
- key相同type不同导致不可复用，会将oldFiber标记为DELETION，并继续遍历

4. 如果newChildren遍历完（即i === newChildren.length - 1）或者oldFiber遍历完（即oldFiber.sibling === null），跳出遍历，第一轮遍历结束。

当遍历结束后，会有两种结果：

1. 步骤3跳出的遍历

此时newChildren没有遍历完，oldFiber也没有遍历完（key不同导致不可复用）。

举个例子，考虑如下代码：
```js
// 之前
<li key="0">0</li>
<li key="1">1</li>
<li key="2">2</li>
            
// 之后
<li key="0">0</li>
<li key="2">1</li>
<li key="1">2</li>
```

第一个节点可复用，遍历到key === 2的节点发现key改变，不可复用，跳出遍历，等待第二轮遍历处理。

此时oldFiber剩下key === 1、key === 2未遍历，newChildren剩下key === 2、key === 1未遍历。

2. 步骤4跳出的遍历

可能newChildren遍历完，或oldFiber遍历完，或他们同时遍历完。

举个例子，考虑如下代码：
```js
// 之前
<li key="0" className="a">0</li>
<li key="1" className="b">1</li>
            
// 之后 情况1 —— newChildren与oldFiber都遍历完
<li key="0" className="aa">0</li>
<li key="1" className="bb">1</li>
            
// 之后 情况2 —— newChildren没遍历完，oldFiber遍历完
// newChildren剩下 key==="2" 未遍历
<li key="0" className="aa">0</li>
<li key="1" className="bb">1</li>
<li key="2" className="cc">2</li>
            
// 之后 情况3 —— newChildren遍历完，oldFiber没遍历完
// oldFiber剩下 key==="1" 未遍历
<li key="0" className="aa">0</li>
```

带着第一轮遍历的结果，我们开始第二轮遍历。

### 第二轮遍历
对于第一轮遍历的结果，我们分别讨论：

1. newChildren与oldFiber同时遍历完
- 那就是最理想的情况：只需在第一轮遍历进行组件更新。此时Diff结束。

2. newChildren没遍历完，oldFiber遍历完（新增节点）
- 已有的DOM节点都复用了，这时还有新加入的节点，意味着本次更新有新节点插入，我们只需要遍历剩下的newChildren为生成的workInProgress fiber依次标记Placement。

3. newChildren遍历完，oldFiber没遍历完（删除节点）
- 意味着本次更新比之前的节点数量少，有节点被删除了。所以需要遍历剩下的oldFiber，依次标记Deletion。

4. newChildren与oldFiber都没遍历完；（有节点改变位置）
- 这意味着有节点在这次更新中改变了位置。
- 这是Diff算法最精髓也是最难懂的部分。我们接下来会重点讲解。

由于有节点改变了位置，所以不能再用位置索引i对比前后的节点，那么如何才能将同一个节点在两次更新中对应上呢？

我们需要使用key。

为了快速的找到key对应的oldFiber，我们将所有还未处理的oldFiber存入；以oldFiber的 key 为key，oldFiber为value的Map中。
```js
const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
```

接下来遍历剩余的newChildren，通过newChildren[i].key就能在existingChildren中找到key相同的oldFiber。

那移动节点呢？

既然我们的目标是寻找移动的节点，那么我们需要明确：节点是否移动是以什么为参照物？

我们的参照物是：**最后一个可复用的节点在oldFiber中的位置索引（用变量lastPlacedIndex表示）。**

由于本次更新中节点是按newChildren的顺序排列。在遍历newChildren过程中，每个遍历到的可复用节点一定是当前遍历到的所有可复用节点中最靠右的那个，即一定在lastPlacedIndex对应的可复用的节点在本次更新中位置的后面。

那么我们只需要比较遍历到的可复用节点在上次更新时是否也在lastPlacedIndex对应的oldFiber后面，就能知道两次更新中这两个节点的相对位置改变没有。

我们用变量oldIndex表示遍历到的可复用节点在oldFiber中的位置索引。如果oldIndex < lastPlacedIndex，代表本次更新该节点需要向右移动。

**lastPlacedIndex 初始为0，每遍历一个可复用的节点，如果oldFiber >= lastPlacedIndex（不需要移动），则lastPlacedIndex = oldFiber。**

在Demo中我们简化下书写，每个字母代表一个节点，字母的值代表节点的key
```js
// 之前
abcd

// 之后
acdb

===第一轮遍历开始===
a（之后）vs a（之前）  
key不变，可复用
此时 a 对应的oldFiber（之前的a）在之前的数组（abcd）中索引为0
所以 lastPlacedIndex = 0;

继续第一轮遍历...

c（之后）vs b（之前）  
key改变，不能复用，跳出第一轮遍历
此时 lastPlacedIndex === 0;
===第一轮遍历结束===

===第二轮遍历开始===
newChildren === cdb，没用完，不需要执行删除旧节点
oldFiber === bcd，没用完，不需要执行插入新节点

将剩余oldFiber（bcd）保存为map

// 当前oldFiber：bcd
// 当前newChildren：cdb

继续遍历剩余newChildren

key === c 在 oldFiber中存在
const oldIndex = c（之前）.index;
此时 oldIndex === 2;  // 之前节点为 abcd，所以c.index === 2
比较 oldIndex 与 lastPlacedIndex;

如果 oldIndex >= lastPlacedIndex 代表该可复用节点不需要移动
并将 lastPlacedIndex = oldIndex;
如果 oldIndex < lastplacedIndex 该可复用节点之前插入的位置索引小于这次更新需要插入的位置索引，代表该节点需要向右移动

在例子中，oldIndex 2 > lastPlacedIndex 0，
则 lastPlacedIndex = 2;
c节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：bd
// 当前newChildren：db

key === d 在 oldFiber中存在
const oldIndex = d（之前）.index;
oldIndex 3 > lastPlacedIndex 2 // 之前节点为 abcd，所以d.index === 3
则 lastPlacedIndex = 3;
d节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：b
// 当前newChildren：b

key === b 在 oldFiber中存在
const oldIndex = b（之前）.index;
oldIndex 1 < lastPlacedIndex 3 // 之前节点为 abcd，所以b.index === 1
则 b节点需要向右移动
===第二轮遍历结束===

最终acd 3个节点都没有移动，b节点被标记为移动
```

再来看一个demo
```js
// 之前
abcd

// 之后
dabc

===第一轮遍历开始===
d（之后）vs a（之前）  
key改变，不能复用，跳出遍历
===第一轮遍历结束===

===第二轮遍历开始===
newChildren === dabc，没用完，不需要执行删除旧节点
oldFiber === abcd，没用完，不需要执行插入新节点

将剩余oldFiber（abcd）保存为map

继续遍历剩余newChildren

// 当前oldFiber：abcd
// 当前newChildren dabc

key === d 在 oldFiber中存在
const oldIndex = d（之前）.index;
此时 oldIndex === 3; // 之前节点为 abcd，所以d.index === 3
比较 oldIndex 与 lastPlacedIndex;
oldIndex 3 > lastPlacedIndex 0
则 lastPlacedIndex = 3;
d节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：abc
// 当前newChildren abc

key === a 在 oldFiber中存在
const oldIndex = a（之前）.index; // 之前节点为 abcd，所以a.index === 0
此时 oldIndex === 0;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 0 < lastPlacedIndex 3
则 a节点需要向右移动

继续遍历剩余newChildren

// 当前oldFiber：bc
// 当前newChildren bc

key === b 在 oldFiber中存在
const oldIndex = b（之前）.index; // 之前节点为 abcd，所以b.index === 1
此时 oldIndex === 1;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 1 < lastPlacedIndex 3
则 b节点需要向右移动

继续遍历剩余newChildren

// 当前oldFiber：c
// 当前newChildren c

key === c 在 oldFiber中存在
const oldIndex = c（之前）.index; // 之前节点为 abcd，所以c.index === 2
此时 oldIndex === 2;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 2 < lastPlacedIndex 3
则 c节点需要向右移动

===第二轮遍历结束===
```

可以看到，我们以为从 abcd 变为 dabc，只需要将d移动到前面。

但实际上React保持d不变，将abc分别移动到了d的后面。

从这点可以看出，考虑性能，我们要尽量减少将节点从后面移动到前面的操作。

### diff总结

diff算法实际上就是对比 current fiber 和组件 render 返回的JSX，生产WIP树；

会结合 React 预设的三个规则来把 n 个节点的fiber树以两次遍历把O（n^3）降纬到O（n）

- 第一轮遍历：处理更新的节点（会有四种情况）。
1. oldFiber 和 newFiber 刚好都遍历完，diff提前结束了；
2. oldFiber 遍历完，newFiber 没遍历完，说明有新节点插入；
3. newFiber 遍历完，oldFiber 没遍历完，说明有旧节点删除；
4. oldFiber 和 newFiber 都没遍历完，跳出准备进行第二轮遍历；

- 第二轮遍历：处理剩下的不属于更新的节点。
1. 第一次遍历以后，其实该更新的节点都处理完了；剩下主要处理移动的节点；
- 对于处理移动的节点，我们如何能快速定位节点在哪里呢？
- 答案是使用hash Map，用key = oldKey, value = oldFiber 来存一个map对象；

- 对于处理移动的节点，我们如何来选参照物呢？使用动态的 lastPlacedIndex 挡板；
- lastPlacedIndex 其实可以理解成一个动态的挡板，挡板左边是已处理的，右边是待处理的；
- lastPlacedIndex 挡板初始为0，利用它和 oldIndex 对比来判断 oldFiber 需不需要移动；

2. 当 oldIndex >= lastPlacedIndex 新节点在旧节点的前面，不需要移动；
- 同时更新参照物（挡板）索引 lastPlacedIndex = oldIndex，以便后面比较节点按照新的参照物更新移动
- 动态更新这个挡板 lastPlacedIndex，就是为了保证左边已处理的 Fiber 不用管了；
3. 当 oldIndex < lastPlacedIndex 新节点在旧节点的后面，需要往右移动；（具体移动用map的key）

## key的正确使用方式

首先我们得明确，diff 算法在比较的时候，会先比较key，然后再比较type；

### 使用index做key存在的问题
1. 虽然key和type都相同，但是内容react认为变了；会造成li的重新渲染；
```js
// ['张三','李四','王五']=>
<ul>
    <li key="0">张三</li>
    <li key="1">李四</li>
    <li key="2">王五</li>
</ul>
// 数组重排 -> ['王五','张三','李四'] =>
<ul>
    <li key="0">王五</li>
    <li key="1">张三</li>
    <li key="2">李四</li>
</ul>
```
如果我们使用稳定的id来做key，react认为只是移动了节点；不会造成重新渲染；
```js
// ['张三','李四','王五']=>
<ul>
    <li key="000">张三</li>
    <li key="111">李四</li>
    <li key="222">王五</li>
</ul>
// 数组重排 -> ['王五','张三','李四'] =>
<ul>
    <li key="222">王五</li>
    <li key="000">张三</li>
    <li key="111">李四</li>
</ul>
```

2. 推荐使用index的情况（分页渲染）
```js
// 第一页
<ul>
    <li key="000">张三</li>
    <li key="111">李四</li>
    <li key="222">王五</li>
</ul>
// 第二页
<ul>
    <li key="333">张三三</li>
    <li key="444">李四四</li>
    <li key="555">王五五</li>
</ul>
```

由于key不同，react会全部都删除创新创建fiber并渲染；造成了很严重的性能损耗；

```js
// 第一页
<ul>
    <li key="0">张三</li>
    <li key="1">李四</li>
    <li key="2">王五</li>
</ul>
// 第二页
<ul>
    <li key="0">张三三</li>
    <li key="1">李四四</li>
    <li key="2">王五五</li>
</ul>
```
由于key不变，会复用fiber，只会重新渲染；

所以，大多数情况下，使用唯一id作为子组件的key是不会有任何问题的。

这个id一定要是唯一，并且稳定的，意思是这条记录对应的id一定是独一无二的，并且永远不会发生改变。

不推荐使用math.random或者其他的第三方库来生成唯一值作为key。

因为当数据变更后，相同的数据的key也有可能会发生变化，从而重新渲染，引起不必要的性能浪费。

如果数据源不满足我们这样的需求，我们可以在渲染之前为数据源手动添加唯一id，而不是在渲染时添加。

### 不要滥用 Context
其实 Context 的用法和响应式数据正好相反。笔者也看过不少滥用 Context API 的例子, 说到底还是没有处理好‘状态的作用域问题’.

首先要理解 Context API 的更新特点，它是可以穿透React.memo或者shouldComponentUpdate的比对的，也就是说，一旦 Context 的 Value 变动，所有依赖该 Context 的组件会全部 forceUpdate.

这个和 Mobx 和 Vue 的响应式系统不同，Context API 并不能细粒度地检测哪些组件依赖哪些状态，所以说上节提到的‘精细化渲染’组件模式，在 Context 这里就成为了‘反模式’.

总结一下使用 Context API 要遵循一下原则:
1. 明确状态作用域, Context 只放置必要的，关键的，被大多数组件所共享的状态。比较典型的是鉴权状态
2. 粗粒度地订阅 Context；细粒度的 Context 订阅会导致不必要的重新渲染, 所以这里推荐粗粒度的订阅. 比如在父级订阅 Context，然后再通过 props 传递给下级。
3. 传递给 Context 的 value 最好做一下缓存:
```js
export function ThemeProvider(props) {
  const [theme, switchTheme] = useState(redTheme);
  const value = useMemo(() => ({ theme, switchTheme }), [theme]);
  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
```









