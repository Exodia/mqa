#Mqa(Media Query Alias) For Kissy简介
Mqa是一个简单媒体查询假名库, 是对浏览器原生的matchMedia做了一层简单的封装,
提供了更加方便简洁的事件接口以及媒体字符串的简写注册.目前作为KISSY Gallery的一个组件存在,
当然, 您只需做简单的修改就可以独立于KISSY运行(毕竟, 只用到了KISSY的Loader -.-!).

##优点
1. 接口更加直接方便
2. 统一管理媒体查询对象: 不用自己到处管理MediaQueryList对象, Mqa帮您做了统一管理

##与MDN官方例子的对比
MDN例子:

```javascript
var mql = window.matchMedia("(orientation: portrait)");
mql.addListener(handleOrientationChange);
handleOrientationChange(mql);
```

Mqa:

```javascript
//最后一个参数标识是否立即执行一次监听函数
Mqa.on("(orientation: portrait)", handleOrientationChange, true)
```

##其他的例子对比
###判断媒体
原生: window.matchMedia("(min-width: 480px)").matches

Mqa: Mqa.match("(min-width: 480px)")

###监听事件
原生: window.matchMedia("(min-width: 480px)").addListener(handlerFunction)

Mqa: Mqa.on("(min-width: 480px)", handlerFunction)

###假名模式
Mqa更加方便的用途在于它的假名方法, (min-width: 480px)是不是觉得有点过长?
你可以使用Mqa.add方法注册它的假名(缩写):

```javascript
//先注册媒体假名
Mqa.add("smallscreen", "(min-width: 480px)");
Mqa.add("landscape", "(orientation:landscape)")
//判断媒体
Mqa.match("smallscreen");
//监听事件
Mqa.on("smallscreen", handlerFunction)
//移除事件
Mqa.off("smallscreen", handlerFunction)
//移除假名
Mqa.remove("smallscreen")
```

有了假名方法, 可以在JS层上更加清晰方便的组织代码, 更方便的响应多终端

##TODO
1. 移动端webkit浏览器BUG FIX