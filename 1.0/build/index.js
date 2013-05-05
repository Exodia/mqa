/*
combined files : 

gallery/mqa/1.0/mqa
gallery/mqa/1.0/index

*/
;
KISSY.add('gallery/mqa/1.0/mqa',function () {
    /*! matchMedia() polyfill - Test a CSS media type/query in JS.
     Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */

    window.matchMedia = window.matchMedia || (function (doc, undefined) {

        "use strict"

        var bool,
            docElem = doc.documentElement,
            refNode = docElem.firstElementChild || docElem.firstChild,
        // fakeBody required for <FF4 when executed in <head>
            fakeBody = doc.createElement("body"),
            div = doc.createElement("div")

        div.id = "mq-test-1"
        div.style.cssText = "position:absolute;top:-100em"
        fakeBody.style.background = "none"
        fakeBody.appendChild(div)

        return function (q) {

            div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>"

            docElem.insertBefore(fakeBody, refNode)
            bool = div.offsetWidth === 42
            docElem.removeChild(fakeBody)

            return {
                matches: bool,
                media: q
            }

        }

    }(window.document))

    var aliasMap = {}

    var wrapMqlFn = function (mql, fn) {
        var wrap = function () {
            fn.apply(this, arguments)
        }

        mql.addListener(wrap)

        return wrap
    }

    /**
     * 媒体查询假名, 基本用法:
     *      KISSY.use("gallery/mqa/1.0/index", function(S, Mqa){
     *          Mqa.add("landscape", "(orientation: landscape)").
     *              on("landscape", function(mql){
     *                 if(mql.matches) {
     *                     //matches code
     *                 } else {
     *
     *                 }
     *              })
     *      })
     * @class Mqa
     * @singleton
     */
    var Mqa = {
        /**
         * 添加假名映射, 用法:
         *
         *      Mqa.add("landscape", "(orientation: landscape)");
         *
         *
         * @member Mqa
         * @param {String} alias 要映射的假名
         * @param {String} media 要做映射的媒体查询名
         * @return {Object} this
         */
        add: function (alias, media) {
            if (alias in aliasMap) {
                throw new Error(alias + " has already been added!")
            }

            aliasMap[alias] = {
                media: media,
                mql: null,
                handlers: [],
                wraps: []
            }

            return this
        },

        /**
         * 移除假名映射, 用法:
         *
         *      Mqa.remove("landscape");
         *
         * @member Mqa
         * @param {String} alias 要移除的假名
         * @return {Boolean} 是否移除成功
         */
        remove: function (alias) {
            return this.off(alias) ? delete aliasMap[alias] : false
        },

        /**
         * 监听媒体字符串变化事件,用法:
         *
         *      Mqa.on("landscape", function(mql) {
         *	        //检查mql.matches值，来决定你要做何操作
         *      });
         *
         * @member Mqa
         * @param {String} alias
         * 媒体查询假名,或者媒体查询字符串
         * @param {function(mql)} fn
         * 媒体字符串变化事件响应函数， 会传入一个布尔值参数，
         * 表示是否与监听的媒体查询字符串匹配
         * @param {Boolean} execAtOnce
         * 是否立即执行一次监听函数，一般用在初始化的时候。
         * @return this
         */
        on: function (alias, fn, execAtOnce) {
            //若假名不存在，则当作媒体查询字符串
            if (!(alias in aliasMap)) {
                aliasMap[alias] = {
                    media: alias,
                    mql: window.matchMedia(alias),
                    handlers: [],
                    wraps: []
                }
            }

            var aliasObj = aliasMap[alias],
                mql = aliasObj.mql || (aliasObj.mql = window.matchMedia(aliasObj.media)),
                handlers = aliasObj.handlers

            var wrapFn

            if (handlers.indexOf(fn) > -1) {
                execAtOnce && fn(mql)
                return this
            }

            wrapFn = wrapMqlFn(mql, fn)
            handlers.push(fn)
            aliasObj.wraps.push(wrapFn)

            execAtOnce && fn(mql)

            return this
        },

        /**
         * 移除媒体字符串变化监听事件,
         * 用法:
         *      //移除特定的监听函数
         *      Mqa.off("landscape", changeFunction)
         *      //移除所有监听函数
         *      Mqa.off("landscape")
         *
         * @member Mqa
         * @param {String} alias 要移除的假名
         * @param {function} fn 可选，若未传入，则移除该假名下所有事件（此时等价于remove），否则移除对应的监听函数
         * @return {Boolean} 返回是否成功移除
         */
        off: function (alias, fn) {
            if (!(alias in aliasMap)) {
                return false
            }

            var aliasObj = aliasMap[alias]

            var mql, wraps, handlers

            mql = aliasObj.mql
            wraps = aliasObj.wraps
            handlers = aliasObj.handlers

            //未传入fn或fn不为函数，则移除所有事件监听函数
            if (typeof fn !== 'function') {
                wraps.forEach(function (wrap) {
                    mql.removeListener(wrap)
                })

                return true
            }


            //找到相关函数
            var index = handlers.indexOf(fn)
            if (index > -1) {
                mql.removeListener(wraps[index])

                handlers.splice(index, 1)
                wraps.splice(index, 1)

                return true
            }

            return false

        },


        /**
         * 测试当前浏览器是否符合假名所指向的媒体查询特性, 当传入的假名未找到时,则按照媒体查询字符串直接匹配,
         * 用法:
         *      Mqa.add("landscape", "(orientation: landscape");
         *      Mqa.match("landscape"); // => true or false
         *      Mqa.match("(min-width:480px)") // => true or false
         *
         * @member Mqa
         * @param {String} alias 媒体假名或媒体查询字符串
         * @returns {Boolean} 返回是否匹配对应的假名
         */
        match: function (alias) {
            return  (alias in aliasMap && aliasMap[alias].mql.matches) ||
                window.matchMedia(alias).matches
        }
    }

    return Mqa
})
/**
 * @fileoverview 媒体查询假名组件
 * @author 踏风<tafeng.dxx@taobao.com>
 * @module mqa
 **/
;
KISSY.add('gallery/mqa/1.0/index',function (S, Mqa) {

    return Mqa
}, {
    requires: ["./mqa"]
})




