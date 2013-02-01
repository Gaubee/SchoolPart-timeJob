console = console || {
    log: function (str) {
        document.body.innerHTML += "<h6>" + str + "</h6>";
    },
    info: function () {
        document.body.innerHTML += "<h6 style='color:#0FF;background-color:#ddd;'>" + str + "</h6>";
    },
    err: function () {
        document.body.innerHTML += "<h6 style='color:#F00;'>" + str + "</h6>";
    }
}

var Tools = {
    ArrayCopy: function (copyer, newer) {
        newer = newer || [];
        try {
            var Length = copyer.length;
        } catch (e) {
            console.log("error copy:" + e);
            return null;
        }
        for (var i = 0; i < Length; i++) {
            newer[i] = copyer[i];
        }
        return newer;
    },
    TimeOut: function (fn, time, objarr)//要定时运行的函数，[定时时间]，[fn（）内的参数，数组形式传递]
    {
        time = time || 0;

        setTimeout(function () {
            if (typeof objarr === "object") {
                for (var i in objarr) {
                    arguments[arguments.length] = objarr[i];
                    arguments.length++;
                }
            } else {
                arguments[0] = objarr;
                arguments.length++;
            }
            fn.apply(fn, arguments);
        }, time);
    }
};



//value||innerHTML||innerText||attrsName...
var Binder = function (data, key) {

    this.$$id = (this.$$id + 1) || 0; //绑定仓库计数器
    //console.log(this.$$id);
    var $$; //存放绑定器
    var b = function () {
        var dataType = (typeof data).toLowerCase();
        var privates, publics;
        privates = {
            _content: data,
            _type: dataType,
            _key: key || "value", //关键字，用于object默认更新的对象//或是是存储function的参数指针或参数值
            _binders: [], //存储绑定信息
            _bindersId: "|", //存储绑定着ID
            _fn_set: function (fn) {
                if ((typeof fn).toLowerCase() === "function") {
                    privates._content = fn;
                } else {
                    var arg = arguments[arguments.length];
                    if (arg && arg.length) {//是否更新绑定
                        privates._update({ Sponsors: publics.id, Participants: arg });
                    } else {
                        privates._update({ Sponsors: publics.id, Participants: [] });
                    }
                }
            },
            _sin_set: function () {//不用参数，为了实现可以set值为null//数据包,[是否停止更新绑定]
                if (arguments.length) {
                    var c = arguments[0];
                    var ctype = (typeof c).toLowerCase();
                    if (ctype === "string" || ctype === "number" || ctype === "boolean" || c === null) {
                        privates._content = c;
                    } else if (ctype === "function") {
                        privates._content = c();
                    } else {
                        try {
                            for (var i in c) {
                                privates._content[i] = c[i];
                            }
                        }
                        catch (e) {
                            console.log("set error:" + e);
                            return;
                        }
                    }
                    if (arguments[1] && arguments[1].length) {//是否更新绑定
                        privates._update({ Sponsors: publics.id, Participants: arguments[1] });
                    } else {
                        privates._update({ Sponsors: publics.id, Participants: [] });
                    }
                }
            },
            _obj_set: function () {//数据包,[是否深度复制数据包给对象],[是否停止更新绑定]
                if (arguments.length) {
                    var c = arguments[0];
                    var ctype = (typeof c).toLowerCase();
                    if (ctype === "string" || ctype === "number" || ctype === "boolean" || c === null) {
                        privates._content[privates._key] = c;
                    } else if (ctype === "function") {
                        privates._content[privates._key] = c();
                    } else {
                        if (!arguments[1]) {//是否深赋值，默认false(null,undinefed)
                            try {
                                for (var i in c) {
                                    privates._content[i] = c[i];
                                }
                            }
                            catch (e) {
                                console.log("set error:" + e);
                                return;
                            }
                        }
                        else {//深赋值

                        }
                    }
                    if (arguments[2] && arguments[2].length) {//是否更新绑定
                        privates._update({ Sponsors: publics.id, Participants: arguments[2] });
                    } else {
                        privates._update({ Sponsors: publics.id, Participants: [] });
                    }
                }
            },
            _update: function (con) {//更新
                //con:Sponsors:int(更新发起者),Participants:[int](已参与者),argus:object(附带参数)
                var BindersID = privates._bindersId + "";
                BindersID = BindersID.substr(1, BindersID.length - 2).split('|');
                var Binders = privates._binders;
                var Length = BindersID.length;

                //console.log(con);
                con.Participants[con.Participants.length] = publics.id; //将自身写入参与者id
                //console.log(con.Sponsors + "|" + con.Participants);

                for (var i = 0; i < Length; ++i) {
                    var id = BindersID[i];
                    if (id === "") {
                        break;
                    }
                    var binder = allBinders[id];
                    var BindersMessage = Binders[id];
                    if (("|" + con.Participants.join('|') + "|").indexOf('|' + id + '|') === -1 || BindersMessage.forceUpdate) {
                        //不重复更新，除非配置信息为强制更新
                        var newCon = {
                            Sponsors: publics.id,
                            Participants: Tools.ArrayCopy(con.Participants),
                            argus: BindersMessage
                        }
                        Tools.TimeOut(function (B, BM, C) {
                            var updateKey = BM["updateKey"];
                            var key = BM["key"], value;
                            if ((typeof key).toLowerCase() === "function") {
                                value = key.call(privates._content, BM["binder"]);
                            } else {
                                value = publics.get(BM["key"]);
                            }
                            var data = {};
                            if (updateKey === null) {//更新关键字为空，则更新默认关键字
                                data = value;
                            } else if ((typeof updateKey) === "object") {//如果是数组
                                var Length = updateKey.length;
                                for (var i = 0; i < Length; ++i) {
                                    data[updateKey[i]] = value;
                                }
                            } else {
                                data[updateKey] = value;
                            }
                            if (B.privates._type === "object") {
                                B.publics.set(data, false, C.Participants); //索取绑定关键字,默认为null
                            } else if (B.privates._type === "function") {
                                if (key && key.length) {
                                    B.publics.get.apply(BM["Environment"], key);
                                } else {
                                    B.publics.get.call(BM["Environment"].publics);
                                }
                                B.publics.set(C.Participants); //索取绑定关键字,默认为null
                            } else {
                                B.publics.set(data, C.Participants); //索取绑定关键字,默认为null
                            }
                            //B.privates._update(C); //更新被更新者的绑定
                        }, newCon.argus.weights, [binder, BindersMessage, newCon]);
                    }
                }
            }
            /*privates*/
        }

        publics = {
            info: "binders", //绑定器标实
            id: this.$$id,
            init: function () {
                if (!(data.info && data.info === "binders")) {
                    switch (dataType) {
                        case "string":
                            this.set = privates._sin_set;
                            break;
                        case "number":
                            this.set = privates._sin_set;
                            break;
                        case "boolean":
                            this.set = privates._sin_set;
                            break;
                        case "object":
                            this.set = privates._obj_set;
                            if (data.tagName) {//如果是HTML元素
                                data.info = "view-binders";
                                data.set = publics.set;
                                data.get = publics.get;
                                data.binding = publics.binding;
                                data.monitor = publics.monitor;
                                data.twoway = publics.twoway;
                                data.Binder = publics;
                            }
                            break;
                        case "function":
                            this.set = privates._fn_set;
                            if (key) {
                                var Length = key.length;
                                for (var i = 0; i < Length; i++) {
                                    var k = key[i];
                                    if (k) {
                                        arguments[i] = k;
                                        if (k.info && k.info.indexOf("binders") !== -1) {
                                            k.binding(publics);
                                        }
                                        arguments.length++;
                                    }
                                } //保持参数集
                                privates._key = arguments;
                                publics.get.apply(privates._content, arguments);
                            } else {
                                privates._key = arguments;
                                publics.get.call(privates._content);
                            }
                            break;

                        default:
                            this.set = privates._sin_set;
                            break;
                    }
                }
                return this;
            },
            set: privates._sin_set,
            get: function () {
                var result = privates._content;
                if (privates._type === "function") {
                    if (arguments.length === 0) {
                        if (privates._key.length !== 0) {
                            arguments = privates._key;
                            result = result.apply(privates._content, arguments);
                        }
                        else {
                            result = result.call(privates._content);
                        }
                    } else {
                        result = result.apply(privates._content, arguments);
                    }
                } else {
                    if (privates._type === "object") {
                        result = result[privates._key];
                    }
                    if (arguments.length) {
                        var con = arguments[0];
                        if (con !== null) {
                            var contype = (typeof con).toLowerCase();
                            if (privates._type === "object" && (contype === "number" || contype === "string")) {//返回索取的字符
                                result = privates._content[con];
                            } else {
                                if (!con[0]) {//返回默认的关键字内容
                                    result = privates._content[privates._key];
                                } else {//获取复合对象
                                    try {
                                        var Length = con.length;
                                        result = {};
                                        for (var i = 0; i < Length; ++i) {
                                            result[con[i]] = privates._content[con[i]];
                                        }
                                    }
                                    catch (e) {
                                        console.log("get error:" + e);
                                    }
                                }
                            }
                        }
                    }
                }
                return result;
            },
            binding: function (obj, key, config) {//单向绑定//绑定器对象或者函数，[绑定关键字]，[绑定·配置]
                var bindkey = key || null;
                if ((typeof bindkey).toLowerCase() === "object" && bindkey && (!bindkey.length)) {//不是null且不是数组
                    config = key;
                    bindkey = null;
                }
                config = config || { updateKey: null, weights: 0, forceUpdate: false, compromise: false };
                var binderobj;
                if (!obj.info) {//如果绑定对象不是绑定器
                    binderobj = Binder(obj);
                } else if (obj.info === "binders") {
                    binderobj = obj;
                } else if (obj.info === "view-binders") {
                    binderobj = obj.Binder;
                }
                var BindersMessage = {
                    id: binderobj.id,
                    key: bindkey,
                    type: "binding",
                    updateKey: config["updateKey"] || null,
                    Environment: publics, //上下文作用域
                    binder: obj,
                    weights: config["weights"] || 0, //更新的权值
                    forceUpdate: config["forceUpdate"] || false, //是否强制更新
                    compromise: config["compromise"] || false//权限相等时是否妥协更新，默认 不妥协
                }
                privates._binders[binderobj.id] = BindersMessage;
                privates._bindersId += binderobj.id + "|";
            },
            monitor: function (obj, updateKey, config) {//单向监听
                var monitorkey = updateKey || null;
                if ((typeof monitorkey).toLowerCase() === "object" && monitorkey && (!monitorkey.length)) {//不是null且不是数组
                    config = updateKey;
                    monitorkey = null;
                }
                config = config || { key: null, weights: 0, forceUpdate: false, compromise: false };
                var monitorobj;
                if (!obj.info) {//如果监听对象不是绑定器
                    monitorobj = allBinders[Binder(obj).id];
                } else if (obj.info === "binders") {
                    monitorobj = allBinders[obj.id];
                } else if (obj.info === "view-binders") {
                    monitorobj = allBinders[obj.Binder.id];
                }
                var BindersMessage = {
                    id: publics.id,
                    type: "monitor",
                    key: config["key"] || null,
                    updateKey: monitorkey,
                    Environment: monitorobj.publics, //上下文作用域
                    weights: config["weights"] || 0, //更新的权值
                    forceUpdate: config["forceUpdate"] || false, //是否强制更新
                    compromise: config["compromise"] || false//权限相等时是否妥协更新，默认 不妥协
                }
                //monitorobj.binding(publics, BindersMessage);
                monitorobj.privates._binders[publics.id] = BindersMessage;
                monitorobj.privates._bindersId += publics.id + "|";
            },
            twoway: function () {//双向绑定

            }
            /*privates*/
        }
        $$ = {//存储绑定器
            privates: privates,
            publics: publics
        }
        try//绑定仓库，用于统一管理绑定元素
		{
            //this.allBinders[this.$$id] = $$;
            allBinders[this.$$id] = $$; //私有化
        }
        catch (e) {
            allBinders = [$$];
        }
        return publics.init();
    };


    return b();
}


////RUN


//var test = Binder("hello word");
//var test2 = Binder("???");
//var test3 = Binder("???");
//test.binding(test2);
//test.set("?????");
//console.log(test2.get());
//Tools.TimeOut(function () {
//    console.log(test2.get());
//}, 10);
