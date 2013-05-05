#Mqa简介
Mqa是一个简单媒体查询假名库, 是对浏览器原生的matchMedia做了一层简单的封装,
提供了更加方便简洁的事件接口以及媒体字符串的简写注册.目前作为KISSY Gallery的一个组件存在,
当然, 您只需做简单的修改就可以独立于KISSY运行(毕竟, 只用到了KISSY的Loader -.-!).

主要优点:

1. 接口更加直接方便
2. 统一管理媒体查询对象: 不用自己到处管理MediaQueryList对象, Mqa帮您做了统一管理

[DEMO](#!/example)
[API参考](#!/api/Mqa)

##注册假名和监听事件

    @example
    //引入Mqa模块
    KISSY.use("gallery/mqa/index", function(S, Mqa){
        //添加假名
        Mqa.add("smallscreen", "(min-width: 480px)");
        //监听媒体查询改变事件
        Mqa.on("smallscreen", function(mql){
            alert("当前处于" + mql.matches? "小":"大" + "屏幕");
        }, true)
    });

在上述代码中, 我们首先引入了Mqa模块, 接着将(min-width: 480px)媒体字符串定义为smallscreen,
接着我们调用Mqa提供的on方法监听屏幕尺寸的改变, 当屏幕尺寸在断点处(480px)发生改变时,即会触发我们绑定的事件函数.

在事件函数中, 会传入一个原生的[MediaQueryList](https://developer.mozilla.org/en-US/docs/DOM/MediaQueryList)
对象.

通过判断mql的matches属性来决定弹出的对话框文档. 第三个参数为true,表明我们需要立即执行一次监听函数,
这主要适用于需要初始化的场景中.若忽略第三个参数,则仅会在媒体状态改变时调用函数.

##移除假名,事件, 监听函数
在有些情况下,你也许需要移除假名或者相关的事件和函数, 这可以调用remove, off来完成,
具体可参考{@link Mqa#remove API文档}

##简单的判断当前状态是否匹配媒体查询或假名
仅需调用Mqa.match方法, 传入假名或媒体查询字符串即可.

##不使用假名
Mqa还算灵活, 若不想使用假名, 即不喜欢对每一个媒体查询字符串都调用一次add注册的场景.
完全可以直接调用Mqa的on, off, match方法, Mqa会在假名不存在的情况下, 将传入的字符串当作正常的媒体查询字符串.



