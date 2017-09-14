window.onload = function() {
  init();
  // 防止页面后退
  // 页面载入时使用pushState插入一条历史记录
  history.pushState(null, null, document.URL.split("?")[0] + "?token=" + getUrlParam('token') + "&rand=" + Math.random());
  $(window).on('popstate', function(event) {
    // 点击回退时再向历史记录插入一条，以便阻止下一次点击回退
    history.pushState(null, null, document.URL.split("?")[0] + "?token=" + getUrlParam('token') + "&rand=" + Math.random());
  });
}

function init() {
  var param = {
    type: 'POST',
    url: "http://www.szcloudshare.com/idev/public/queryTaocan.api",
    data: {
      token: getUrlParam("token")
    },
    error: function(err) {
      console.log("获取套餐失败", err);
    },
    success: function(resp) {
      if (resp.errorCode == 0) {
        dataReady(resp.entity)
      } else {
        console.log("获取套餐失败:" + resp)
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
  lowMoney.text(parseInt(data[0].feiyong) / 100);
  lowTime.text(parseInt(data[0].jishi) / 60);
  middleMoney.text(parseInt(data[1].feiyong) / 100);
  middleTime.text(parseInt(data[1].jishi) / 60);
  heightMoney.text(parseInt(data[2].feiyong) / 100);
  heightTime.text(parseInt(data[2].jishi) / 60);
  ready(data)
}

function ready(data) {
  var tcLow = $('#tclow');
  var tcMiddle = $('#tcmiddle');
  var tcHeight = $('#tcheight');
  tcLow.on('touchstart', function(e) {
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
            window.location = './jishi.html?token=' + getUrlParam("token");
          } else if (res.err_msg.substr(res.err_msg.length - 6, 6) == 'cancel') {
            console.log('取消支付!');
          } else {
            alert('系统繁忙,请稍后再试!');
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
    url: "http://www.szcloudshare.com/idev/public/unifiedOrder.api",
    data: params,
    error: function(err) {
      console.log("预下单失败", err);
    },
    success: function(resp) {
      if (resp.errorCode === 0) {
        wxPay.payParameters = resp.entity;
        console.log('wxPay', wxPay);
        wxPay.jsApiCall();
      } else {
        console.log("预下单失败:" + resp)
      }
    }
  };
  $.ajax(param);
}