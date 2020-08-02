## 水平居中
- 对于行内元素，text-align: center; 进行文本居中即可；
- 对于确定宽度的块级元素，margin: 0 auto;
- 对于宽度未知的块级元素

1. table标签配合margin左右auto实现水平居中。使用table标签（或直接将块级元素设值为display:table），再通过给该标签添加左右margin为auto。

2. inline-block实现水平居中方法。display：inline-block和text-align:center实现水平居中。

3. 绝对定位+transform，translateX可以移动本身元素的50%。

4. flex布局使用justify-content:center

## 垂直居中
1. 利用line-height实现居中，这种方法适合纯文字类

2. 通过设置父容器相对定位，子级设置绝对定位，标签通过margin实现自适应居中

3. 弹性布局flex:父级设置display: flex; 子级设置margin为auto实现自适应居中

4. 父级设置相对定位，子级设置绝对定位，并且通过位移transform实现

5. table布局，父级通过转换成表格形式，然后子级设置vertical-align实现。（需要注意的是：vertical-align: middle使用的前提条件是内联元素以及display值为table-cell的元素）。

## 浮动布局
- 尽量少用浮动，如果可以，就不要用；

- 清除浮动的方式
1. 添加额外的标签
```js
<div class="parent">
    //添加额外标签并且添加clear属性
    <div style="clear:both"></div>
    //也可以加一个br标签
</div>
```
2. 父级添加overflow属性(BFC原理)，或者设置高度
```js
<div class="parent" style="overflow:hidden">//auto 也可以
    //将父元素的overflow设置为hidden
    <div class="f"></div>
</div>
```
3. 建立伪类选择器清除浮动（推荐）
```js
//在css中添加:after伪元素
.parent:after{
    /* 设置添加子元素的内容是空 */
      content: '';  
      /* 设置添加子元素为块级元素 */
      display: block;
      /* 设置添加的子元素的高度0 */
      height: 0;
      /* 设置添加子元素看不见 */
      visibility: hidden;
      /* 设置clear：both */
      clear: both;
}
<div class="parent">
    <div class="f"></div>
</div>
```

## 布局案例
- 圣杯布局
1. 利用flex布局
```js
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<style>
    *{
      margin: 0;
      padding: 0;
    }
    .header,.footer{
        height:40px;
        width:100%;
        background:red;
    }
    .container{
        display: flex;
    }
    .middle{
        flex: 1; 
        background:yellow;
    }
    .left{
        width:200px;
        background:pink;
    }
    .right{
        background: aqua;
        width:300px;
    }
	</style>
</head>
<body>
    <div class="header">这里是头部</div>
    <div class="container">
        <div class="left">左边</div>
        <div class="middle">中间部分</div>
        <div class="right">右边</div>
    </div>
    <div class="footer">这里是底部</div>
</body>
</html>
```

- 双飞翼布局
```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    *{
      margin: 0;
      padding: 0;
    }
    .container {
        min-width: 600px;
    }
    .left {
        float: left;
        width: 200px;
        height: 400px;
        background: red;
        margin-left: -100%;
    }
    .center {
        float: left;
        width: 100%;
        height: 500px;
        background: yellow;
    }
    .center .inner {
        margin: 0 200px; 
    }
    .right {
        float: left;
        width: 200px;
        height: 400px;
        background: blue;
        margin-left: -200px;
    }
  </style>
</head>
<body>
  <article class="container">
    <div class="center">
        <div class="inner">双飞翼布局</div>
    </div>
    <div class="left"></div>
    <div class="right"></div>
</article>
</body>

</html>
```
- 水平垂直居中
1. flex，移动端无兼容性，PC端有兼容性
```js
html, body{
    height: 100%;
}
body{
    display: flex;
    justify-content: center;
    align-items: center;
}
.son {
    background: red;
}
``` 
2. 需要水平居中的元素知道宽度
```js
.commentList {
    background: red;
    width: 100px;
    height: 100px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -50px;
    margin-left: -50px;
}
// 不知道宽度就是蒙层效果了
.commentList {
    background: red;
    width: 100px;
    height: 100px;
    position: absolute;
    left: 0;      
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto ;
}
```
3. 需要水平居中的元素不知道宽度
```js
.commentList {
    background: red;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
```

## BFC
1. 什么是BFC？
- 浮动元素和绝对定位元素，非块级盒子的块级容器（例如 inline-blocks, table-cells, 和 table-captions），以及overflow值不为"visiable"的块级盒子，都会为他们的内容创建新的BFC（Block Fromatting Context， 即块级格式上下文）。

2. 触发条件，满足一个或者多个条件即可
- 根元素
- 浮动元素（元素的 float 不是 none）
- 绝对定位元素（元素的 position 为 absolute 或 fixed）
- 行内块元素（元素的 display 为 inline-block）
- 表格单元格（元素的 display为 table-cell，HTML表格单元格默认为该值）
- 表格标题（元素的 display 为 table-caption，HTML表格标题默认为该值）
- 匿名表格单元格元素（元素的 display为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table）
- overflow 值不为 visible 的块元素 -弹性元素（display为 flex 或 inline-flex元素的直接子元素）
- 网格元素（display为 grid 或 inline-grid 元素的直接子元素） 等等。

3. BFC渲染规则
- BFC垂直方向边距不重叠
- BFC的区域不会与浮动元素的box重叠
- BFC是一个独立的容器，外面的元素不会影响里面的元素
- 计算BFC高度的时候浮动元素也会参与计算

4. 应用场景
- 防止浮动元素外边距塌陷，俗称margin塌陷；
- 防止浮动元素内部高度塌陷

## flex 布局
什么是flex布局？

给div这类块状元素元素设置 display:flex 或者给 span 这类内联元素设置 display:inline-flex，flex布局即创建！其中，直接设置 display:flex 或者 display:inline-flex 的元素称为flex容器，里面的子元素称为flex子项。

作用在flex容器上的属性：
1. flex-direction：row | row-reverse | column | column-reverse; 
- 默认值，显示为行。方向为当前文档水平流方向，默认情况下是从左往右。

2. flex-wrap：nowrap | wrap | wrap-reverse;
- 控制子项整体单行显示还是换行显示；
- 子项有宽度才行，如果子项自身的宽度大于容器，强行不换行自身宽度会失效；

3. flex-flow： <‘flex-direction’> || <‘flex-wrap’>
- flex-flow属性是flex-direction和flex-wrap的缩写，表示flex布局的flow流动特性。

4. justify-content：flex-start | flex-end | center | space-between | space-around | space-evenly;
- justify-content属性决定了水平方向子项的对齐和分布方式；

5. align-items：stretch | flex-start | flex-end | center | baseline;
- 指的就是flex子项们相对于flex容器在垂直方向上的对齐方式，
- 如果不设置这个，默认会把子项高度拉伸；

6. align-content：stretch | flex-start | flex-end | center | space-between | space-around | space-evenly;
- align-content则是指明垂直方向每一行flex元素的对齐和分布方式。和justify-content相似但对立的属性；

作用在 flex 子项上的属性：
1. order：0
- 可以通过设置order改变某一个flex子项的排序位置。
- 所有flex子项的默认order属性值是0，因此，如果我们想要某一个flex子项在最前面显示，可以设置比0小的整数，如-1就可以了。
- 值越大，越往后面；

2. flex-grow：0
- flex-grow属性中的grow是扩展的意思，扩展的就是flex子项所占据的宽度，扩展所侵占的空间就是除去元素外的剩余的空白间隙。
- 如果只有一个子项设置了，1代表霸占所有剩余空间，小于1就按比例分配；
- 多个子项设置了，总值小于1，就按比例分配，大于1，则所有的空间都被等比例分配完；

3. flex-shrink：1
- flex-shrink主要处理当flex容器空间不足时候，单个元素的收缩比例。
- 不支持负值，默认是1；
- 和flex-grow扩展是完全相反的CP ???

4. flex-basis：<'length'> | auto; /* 默认值是 auto */
- flex-basis定义了在分配剩余空间之前元素的默认大小。
- 如果同时设置width和flex-basis，就渲染表现来看，会忽略width。

5. flex: none | auto | [ <'flex-grow'> <'flex-shrink'> || <'flex-basis'> ]
- flex属性是flex-grow（扩展），flex-shrink（收缩）和flex-basis（预留）的缩写。
- 其中第2和第3个参数（flex-shrink和flex-basis）是可选的。默认值为0 1 auto。

6. align-self: auto | flex-start | flex-end | center | baseline | stretch;
- 写在flex容器上的这个align-items属性，后面是items，有个s，表示子项们，是全体；这里是self，单独一个个体。

无论作用在flex容器上，还是作用在flex子项，都是控制的flex子项的呈现，只是前者控制的是整体，后者控制的是个体。

在Flex布局中，flex子元素的设置float，clear以及vertical-align属性都是没有用的。



