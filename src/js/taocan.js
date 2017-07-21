window.onload = function() {
    init()
}

function init() {
    var param = {
        type: 'POST',
        url: "http://www.szcloudshare.com/iDevice/public/queryTaocan.api",
        data: {
            token: getUrlParam("token")
        },
        error: function(err) {
            alert("获取套餐失败", err);
        },
        success: function(resp) {
            // console.dir(resp);
            if (resp.errorCode == 0) {
                dataReady(resp.entity)
                console.log(resp)
            } else {
                console.log("获取套餐失败:" + resp)
                    // alert("预下单失败:" + resp);
            }
        }
    };
    $.ajax(param);
}

function dataReady(data) {
    var lowMoney = $('#lowmoney');
    var lowTime = $('#lowtime');
    var middleMoney = $('#middlemoney');
    var middleTime = $('#middletime');
    var heightMoney = $('#heightmoney');
    var heightTime = $('#heighttime');
    lowMoney.text(data[0].feiyong);
    lowTime.text(data[0].jishi);
    middleMoney.text(data[1].feiyong);
    middleTime.text(data[1].jishi);
    heightMoney.text(data[2].feiyong);
    heightTime.text(data[2].jishi);
    ready(data)
}

function ready(data) {
    var tcLow = $('#tclow');
    var tcMiddle = $('#tcmiddle');
    var tcHeight = $('#tcheight');
    tcLow.on('click', function(e) {
        tcLow.removeClass('enter-style')
        var params = {
            taocanid: data[0].uid,
            token: getUrlParam("token")
        }
        pay(params)
    });
    tcLow.on('touchend', function(e) {
        tcLow.addClass('enter-style')
    });
    tcMiddle.on('touchstart', function(e) {
        tcMiddle.removeClass('enter-style')
        var params = {
            taocanid: data[1].uid,
            token: getUrlParam("token")
        }
        pay(params)
    });
    tcMiddle.on('touchend', function(e) {
        tcMiddle.addClass('enter-style')
    });
    tcHeight.on('touchstart', function(e) {
        tcHeight.removeClass('enter-style')
        var params = {
            taocanid: data[2].uid,
            token: getUrlParam("token")
        }
        pay(params)
    });
    tcHeight.on('touchend', function(e) {
        tcHeight.addClass('enter-style')
    });
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

var wxPay = {
    payParameters: null,
    jsApiCall: function() {
        function nativeInvoke() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                wxPay.payParameters,
                function(res) {
                    WeixinJSBridge.log(res.err_msg);
                    //判断支付是否成功 https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7&index=6
                    if (res.err_msg.substr(res.err_msg.length - 2, 2) == 'ok') {
                        window.location = '/jishi.html?token=' + getUrlParam("token");
                    } else if (res.err_msg.substr(res.err_msg.length - 6, 6) == 'cancel') {
                        alert("取消支付");
                    } else {
                        alert("支付失败，详细信息：" + res.err_msg);
                        alert(JSON.stringify(res));
                    }
                }
            );
        }

        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', nativeInvoke, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', nativeInvoke);
                document.attachEvent('onWeixinJSBridgeReady', nativeInvoke);
            }
        } else {
            nativeInvoke();
        }
    }
};

function pay(params) {
    var param = {
        type: 'POST',
        url: "http://www.szcloudshare.com/iDevice/public/unifiedOrder.api",
        data: params,
        error: function(err) {
            alert("预下单失败", err);
        },
        success: function(resp) {
            // console.dir(resp);
            if (resp.errorCode == 0) {
                // alert("预下单成功", JSON.stringify(resp.entity));
                wxPay.payParameters = resp.entity;
                wxPay.jsApiCall();
            } else {
                console.log("预下单失败:" + resp)
                    // alert("预下单失败:" + resp);
            }
        }
    };
    $.ajax(param);
}