/**
 * @fileoverview 媒体查询假名
 * @author 踏风<tafeng.dxx@taobao.com>
 **/
;
KISSY.add(function () {
    var aliasMap = {}

    var wrapMqlFn = function (mql, fn) {
        var wrap = function () {
            fn.apply(this, arguments)
        }

        mql.addListener(wrap)

        return wrap
    }

    var mqa = {
        /**
         * 添加假名映射
         * @param {String} alias 要映射的假名
         * @param {String} media 要做映射的媒体查询名
         * @return this;
         * @example
         * mqa.add("landscape", "(orientation: landscape)");
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
         * 移除假名映射
         * @param {String} alias 要移除的假名
         * @return {Boolean} 是否移除成功
         */
        remove: function (alias) {
           return this.off(alias) ?  delete aliasMap[alias] : false
        },

        /**
         * 监听媒体字符串变化事件
         * @param {String} alias
         * 媒体查询假名,或者媒体查询字符串
         * @param {function(mql)} fn
         * 媒体字符串变化事件响应函数， 会传入一个布尔值参数，
         * 表示是否与监听的媒体查询字符串匹配
         * @param {boolean} execAtOnce
         * 是否立即执行一次监听函数，一般用在初始化的时候。
         * @return this
         * @example
         * mqa.on("landscape", function(mql) {
         *	 //检查mql.matches值，来决定你要做何操作
         * });
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
         * 移除媒体字符串变化监听事件
         * @param alias 要移除的假名
         * @param {function} fn 可选，若未传入，则移除该假名下所有事件（此时等价于remove），
         * 否则移除对应的监听函数
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
         * 测试当前浏览器是否符合假名所指向的媒体查询他特性
         * @param {String} alias 媒体假名或媒体查询字符串
         * @returns {Boolean|} 返回是否匹配对应的假名
         * @example
         * mqa.add("landscape", "(orientation: landscape");
         * mqa.match("landscape"); // => true or false
         */
        match: function (alias) {
            return  (alias in aliasMap && aliasMap[alias].mql.matches) ||
                window.matchMedia(alias).matches
        }
    }

    return mqa
})