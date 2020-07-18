## 语义类标签
在很多工作场景里，语义类标签也有它们自己无可替代的优点。正确地使用语义标签可以带来很多好处。

1. 语义类标签对开发者更为友好，使用语义类标签增强了可读性，即便是在没有 CSS 的时候，开发者也能够清晰地看出网页的结构，也更为便于团队的开发和维护。

2. 除了对人类友好之外，语义类标签也十分适宜机器阅读。它的文字表现力丰富，更适合搜索引擎检索（SEO），也可以让搜索引擎爬虫更好地获取到更多有效信息，有效提升网页的搜索量，并且语义类还可以支持读屏软件，根据文章可以自动生成目录等等。

所以，对于语义标签，我的态度是：“用对”比“不用”好，“不用”比“用错”好。当然了，我觉得有理想的前端工程师还是应该去追求“用对”它们。

## DOM 基本操作
- 获取dom节点，用到再具体查文档；
1. getElementById，通过id获取
2. getElementsByName 通过name获取
3. getElementsByTagName 通过标签名获取
4. getElementsByClassName、querySelectorAll、querySelector等等。

## 介绍一下 HTML5 的一些增强
### 文档方面
1. 声名方面，使用了<!DOCTYPE html>；
- HTML5的文档解析不再基于SGML(Standard Generalized Markup Language)标准，而是形成了自己的一套标准。
2. 标签方面，增加了很多语义化的标签
```js
<header>、<footer>、<section>、<article>、<nav>、<hgroup>、<aside>、<figure>
``` 
3. 废除一些标签
```js
<big>、<u>、<font>、<basefont>、<center>、<s>、<tt>
```
4. 通过增加了``<audio>、<video>``两个标签来实现对多媒体中的音频、视频使用的支持。
### 属性方面
1. 增加了一些表单属性, 主要是其中的input属性的增强
```js
<!-- 此类型要求输入格式正确的email地址 -->
<input type=email >
<!-- 要求输入格式正确的URL地址  -->
<input type=url >
<!-- 要求输入格式数字，默认会有上下两个按钮 -->
<input type=number >
<!-- 时间系列，但目前只有 Opera和Chrome支持 -->
<input type=date >
<input type=time >
<input type=datetime >
<input type=datetime-local >
<input type=month >
<input type=week >
<!-- 默认占位文字 -->
<input type=text placeholder="your message" >
<!-- 默认聚焦属性 -->
<input type=text autofacus="true" >
```
### 存储方面
- 新增WebStorage, 包括localStorage和sessionStorage
- 引入了IndexedDB和Web SQL，允许在浏览器端创建数据库表并存储数据, 两者的区别在于IndexedDB更像是一个NoSQL数据库，而WebSQL更像是关系型数据库。W3C已经不再支持WebSQL。
- 引入了应用程序缓存器(application cache)，可对web进行缓存，在没有网络的情况下使用，通过创建cache manifest文件,创建应用缓存，为PWA(Progressive Web App)提供了底层的技术支持。


