## 移动端介绍
1. Native App (原生App)
2. Hybrid App(混合app，也是两个的混合体) 
3. Web App

## 移动端和PC端的介绍
1. 系统
- PC：window、mac (区别不大)
- 移动端：iso/android/window(有区别)
2. 浏览器
- PC：区别很大
- 移动端：区别不大
3. 分辨率（尺寸）
- PC：有区别不大
- 移动端：区别很大

**移动端设备统计：https://mtj.baidu.com/data/mobile/device**

## 尺寸相关的概念
1. CSS像素（设备独立像素、逻辑像素）
- 大小相对于设备像素的，取决于设备像素。PC浏览器默认一个萝卜一个坑，即一个设备像素等于一个CSS像素（1pt = 1css）
- 设备像素/物理像素是不会变的，同时，注意px单位不是指的大小，指的是眼睛看视频的角度大小。

2. 设备像素（物理像素、指分辨率1920*1080）
- 1920pt * 1080pt

3. 屏幕尺寸
- 屏幕尺寸指的是对角线长度。（平常时候买电视的大小也指的是对角线）
- 1英寸=2.54厘米cm
- PPI = 屏幕斜边的像素 / 屏幕尺寸（屏幕斜边的像素可以用勾股定理求a*a+b*b=c*c）

4. 像素密度（PPI）
- 每英寸上像素（设备像素）的数量，其实就是长宽都是一英寸的正方形能放的像素点更多，值越大，越多。
- PPI = 屏幕斜边的像素 / 屏幕尺寸（屏幕斜边的像素可以用勾股定理求a*a+b*b=c*c）

5. 像素比（DPR）
- DPR = 物理像素 / CSS像素
- 本质：一个CSS像素占用几个设备像素
- 获取：window.devicePixelRatio
- 意义：保证高清屏幕显示图片的正常大小（和普通屏幕一样）

- 手机是如何实现这套机制的呢？
- 是css像素还是设备像素呢？
- viewport 视口，可视区窗口，通过meta定义
- 正确设置viewport，才能让PC端的网页在移动端正常显示。
- 默认的980，是苹果公司的浏览器沿用到今天的

- viewport，下面的参数都放在content
- width    视口宽度
- height   视口高度
- user-scalable  是否允许用户进行页面缩放
- initial-scale  页面初始缩放值
- minimum-scale  页面最小能缩放的比例
- maximum-scale  页面最大能缩放的比例

以下是H5便签的默认值，H5会默认自作主张的缩放页面，initial-scale=1.0；
``<meta name="viewport" content="width=device-width, initial-scale=1.0">``
user-scalable 和width=device-width两个的效果会一样，但是浏览器会比较贪心，会取最大的值。不建议设第一个为固定值，因为有些安卓手机不起作用。

- initial-scale 
- 缩放比 = css像素/viewport宽度

大公司一般都这么设置，为什么呢? 设置了默认的缩放值和最大最小的，把门关死，再设置用户和浏览器不允许缩放，方便适配。
``<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no">``

meta标签，源数据的意思。
辅助性的标签，name有很多属性，这些属性辅助它就起作用。既可以在PC端也可以在移动端使用。

比如下面这两个常用在PC端的，是利于搜索引擎，seo优化的描述和关键字的。
``<meta name="keywords" content="北京美食,北京酒店,北京团购">``
``<meta name="description" content="北京美团网精选北京美食餐厅,酒店预订,电影票,旅游景点,外卖订餐,北京团购信息,您可查询商家评价店铺信息。北京生活,下载美团官方APP ,吃喝玩乐1折起。">``

移动端
meta能设置不识别网页电话号码等

两个有效的插件（vs code）
Live Server 不用频繁的刷新网页了。浏览器实时刷新。（vs code还可以在文件设置自动保存）

在手机打开电脑的网页，用真机测试。（手机和电脑要在同一wifi下）
在电脑打开终端，cmd命令行，
window => ipconfig  => 找ipv4地址
mac => ifconfig => en0 下的 inet 的ip地址
然后替换掉Live Server插件打开的本地地址127.0.0.1
百度搜索二维码，把替换好的地址复制生成二维码
然后手机扫二维码，就可以了。（安卓直接浏览器可以，IOS要借助一下微信在右上角浏览器打开）
ApowerMirror --> 同时可以通过这个软件把手机屏幕投影到电脑，真机开发。

样式重置

字体
移动端没有微软雅黑的字体，一般设这个。font-family:Helvetica;
同时body * ｛-webkit-user-select: none;｝这种写法是body下的所有元素起作用。
如果非要用微软雅黑，只能用css3的自定义字体来解决。

## 移动端的适配（非常重要）
即是根据设计师的一个稿纸适配出差不多的适合很多设备的布局，不可能完全全都一样，要达到完全一样，只能出多个稿纸。

适配的元素：字体，宽高，间距，图像（图标、图片）

适配的方法：

1. 百分比适配
2. viewport缩放
3. DPR缩放
4. rem适配（比较主流的）
5. vw、vh适配（最新的，天生为适配存在）

1. 百分比适配
``<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no">``
记得设置以上的标准。
根据父级百分比，要依靠父级的宽，配合其它布局，不能单独使用。
但是实战中还是偶尔要用的。

viewport缩放适配
把所有机型的css像素设置成一致的。
要配合JS算一个缩放系数

缩放比 = css像素/375（一个要设置的固定值）
JS算出缩放比，再动态设置meta标签。
缺点：不考虑设备的大小，并不合适，同时也会有小数点误差。

DPR缩放适配
把css像素缩放成与设备像素一样大的尺寸，类似于上一种适配，一个萝卜一个坑
1/dpr = 缩放比
缺点：切换屏幕大小的时候同样是有问题的

rem适配
把所有的设备都分成相同的若干份，再计算元素宽度所占的份数
em, 作为font-size的单位时，其代表的是父元素的字体大小，作为其它属性单位时，代表自身字体大小。
问题：在谷歌浏览器字体大小不能小于12px；嵌套太深，也不能实现统一大小了；

rem css3新增的相对于根元素字体大小，指的是html
html和屏幕宽度是正比关系，只需要根据屏幕的宽度大小动态设置html字体大小就可以达到适配了。

rem适配的原理：把所有的设备都分成相同的若干份，再计算元素宽度所占的份数（其实就是栅格化）
- 兼容性好（Android 2.1+ / iOS 4.1+）
1. 元素适配的宽度（算出来的）
- 所占的列数 * 一列的宽

2. 元素的设计稿的宽度（量出来的）

3. 列数（随便给的）
- 一般给100列

4. 一列的宽（算出来的）
- 屏幕的实际宽度（css像素） / 100(列数)

5. 元素实际占的列数（算出来的）
- 元素在设计稿里的宽/一列的宽

**一列的宽，其实就是一个rem，一列的宽，给html设置就OK了（font-size:屏幕实际的宽度（css像素 / 列数））**

总结：rem的适配现在是主流，它的适配其实就是把屏幕栅格化。

设计稿的真正尺寸？
真正切图时候的方法!!!
1. 算rem，还是根据设备实际的css像素算
2. 量出一个元素在设计稿的尺寸
3. 拿这个尺寸除以DPR缩放比，再去换算rem

        //页面加载就设置html大小
        (   
            function (doc,win,designWidth) {
                var html = document.documentElement;
                // var dpr = win.devicePixelRatio;
                function refreshRem () {
                    const clientWidth = html.clientWidth;
                    if(clientWidth >= designWidth){
                       html.style.fontSize = "100px";
                    }else{
     //目的是以iphone6为基准，为什么拿它?因为dpr到达2.0用户的肉眼已经分辨不出啥了，都是高清了。
     //html.style.fontSize = 16 * clientWidth / 375 + 'px';//这种要借助dpr换算
     html.style.fontSize = 100 * (clientWidth / designWidth) + 'px'; 
     //上面这种方式可以直接根据设计稿的大小除以100得到rem的大小                      
                    }
                };
                //dom节点加载完成运行
                doc.addEventListener('DOMContentLoaded',refreshRem);
            }
        )(document,window,750);//750为基准，可以灵活设置

媒体查询设置根节点大小
要手动添加，这种用的不多，苏宁易购用。html设置的字体大小会不管别的标签字体大小，所以用媒体查询一般还要设置body的字体大小。

有些产品经理或者设计师要求不要自动占满全屏的，需要给body设置max-width:750px;之类的，也可以用媒体查询
   @media screen and(min-width: 750px){
       body{
           width: 750px;
       }
   }
在引入这段JS的时候，写样式直接拿设计稿的像素/100，就得到rem的大小，如果是固定值，设计稿的大小除以2喔！！！

- 在移动端尽量用H5，因为它不存在兼容性
- 布局尽量用flex布局
- flex:0 0 80px;设置子元素大小，（扩展比例，收缩比例，子元素大小）；
- flex:1；自动占满

- 遇到那种两行导航栏的最好用百分比布局，然后子项目用inline-block；父级别font-size：0消除间距；

- a标签不能再嵌套a标签，同时它是行内标签，不能嵌套div之类的块元素！！！

/* vertical-align: middle; 文字必须嵌套在span类的标签内才有效果 */

移动端多行文本打点。
           display: -webkit-box;
           -webkit-box-orient: vertical;
           overflow: hidden;
           -webkit-line-clamp:2;

hotcss适配
https://github.com/imochen/hotcss
css预处理器，less，scss；语法有点不一样而已。vs code 可以直接安装sass和easy sass这两个插件转换成css文件
固定像素直接给设计稿的像素大小，要换算rem的直接套scss函数替代；

VW，VH适配方案
为适配而生的单位。
vw,vh 把屏幕宽高都分成了100份，1vw=1%
vmin   取vw和vh中最小的值
vmax   取vw和vh中最大的值

支持情况
>=IOS 8，安卓是>=4.4

方案一：通篇使用vw
方案二：通过vw设置根节点字体大小，页面里面的尺寸依然使用rem（这种常用）

之前的rem布局原理是设计稿像素大小，750/2/3.75=100份，vw的原理就是如此。

在用vw设置根html字体大小的时候，切忌会影响到子元素

方案二：
根节点字体大小(px) = 100 * （clientWidth / designWidth） //设备的物理像素 / 设计稿的大小
1vw(px) = clientWidth / 100;
根节点字体大小(vw) = 根节点字体大小(px) / 1vw(px)
页面里面的尺寸依然使用rem，设计稿的尺寸除以100；

在给定固定的宽高为PX的时候，设计稿的值要/dpr，这样才准确 ！！！
老是要算，css3有一个属性可以帮我们算，height:calc(176px / 3); //要加px，同时除号两边要有空格。

设计稿是1080
html{
    font-size: 9.259259259259261vw;
}
@media screen and (min-width: 750px){
    html{
        font-size: 69.445px;    /* 页面达到750的时候1vw=750/100=7.5px，这时根字体的大小为9.259259259259261vw，此时转成px为7.5*9.259259259259261=69.444px */
    }
}

移动端固定定位问题：
在安卓没问题，在苹果系统有这样的问题。
当input被点击的时候，系统键盘拉起之后，固定定位就没了，失效了。
解决方案：用absolute模拟，设置中间的内容滚动，再定位让出上下固定定位的元素的高度，就可以了。或者用事件。
同时要注意absolute脱离文档流之后只会继承html的宽了。
-webkit-overflow-scrolling:touch; //让滚动条拉的时候不生硬，顺畅。

移动端一像素的问题：
伪类 + transform;
/* 解决1px的问题 */
@media screen and (-webkit-min-device-pixel-ratio: 2) {
    #list h3:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        border-bottom: 1px solid #c1c0c5;
        color: #c1c0c5;
        transform-origin: 0 0;
        transform: scaleY(0.5);
    }
}

移动端响应式
一次设计，普遍适用。（如今开始没落了）
能根据设备的大小，自动调整内容布局。
问题：移动端和PC端的事件有很大的区别，同时，如果移动端用响应式，代码会显得很臃肿，所以它没落了。

响应式原理：
特点：
1、网页宽度自动调整
2、尽量少使用绝对宽度
3、字体的大使用相对单位（rem、em）
4、布局尽量用浮动（流式布局）
5、媒体查询@media（核心原理）
     使用，在style里面使用，还可以在link标签里面使用，在@import使用，       
实战中是使用link 的方式引入的，或者@import的方式，这种方式不太好，要放在样式顶部。

bootsrtap框架
这框架常用做响应式布局

移动端事件
基础事件
touchstart      手指按下事件
touchmove    手指移动事件
touchend       手指按下事件
注意：移动端事件最好用事件监听函数来添加（addEventListener），不要用on添加，因为会存在事件覆盖的问题；

移动端事件和PC端事件的区别
1.触发点
PC端
     mousemove   不需要鼠标按下，但是必需在元素上才能触发
     mouseup        必须在元素上抬起才能触发
移动端
     touchmove     必需手指按下才能触发，但是，按下后不在元素上也能触发
     touchend        不需要在元素上抬起就能触发
2.触发的顺序
    touchstart -> touchend -> mousedown -> click -> mouseup
    (PC的事件在移动端里会有延迟，300)
3.touchstart与click的区别
    touchstart为手指碰到元素就触发，click为手指碰到元素并且抬起才会触发；

移动端的事件问题
     事件点透
     出现场景：有两层重叠的元素，上面的元素有touch事件（点击后要消失），下面是一个默认会触发click事件的元素（a、表单元素、带click事件的元素）
     解决方案
     1、下层的元素不要用能点击的标签，并且不要给它们添加事件
     2、把上面元素的事件换成click事件
     3、取消事件的默认动作（默认事件）
           e.preventDefault();//取消默认事件
      
e.preventDefault()还有很多作用
1、touchmove
      阻止了浏览器的滚动条
      阻止了用户双指缩放
2、touchstart
      解决了IOS10+及部分安卓机通过设置viewport禁止用户缩放功能（双指滑动、双击）
      解决事件点透问题
      阻止图片文字被选中
      阻止了长按元素会弹出系统菜单
      阻止了浏览器回弹的效果
      阻止了浏览器滚动条
      阻止了鼠标的事件
      阻止了input输入框的输入功能

事件对象
      touches   位于当期屏幕上的所有手指列表
      targetTouches 位于当前DOM元素上的手指列表
      changedTouches 触发当前事件的手指列表

移动端库和框架
       hammer.js
       Swipe.js
       better-scroll 
       cube-ui 
