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