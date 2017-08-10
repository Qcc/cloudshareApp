window.onload = function() {
  init();
}

function checkTime(i) { //将0-9的数字前面加上0，例1变为01 
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function dataReady(data) {
  var delay = $('#delay');
  var tips = $('#tips');
  var btAgent = $('#btagent');
  var t = data.remainSeconds - data.dingdan.taocan.jishi;
  if (t > 0) {
    data.remainSeconds = data.remainSeconds - t;
    delay.text(t);
    var delayInterval = setInterval(function() {
      delay.text(t--);
      if (t === 0) {
        clearInterval(delayInterval);
        delay.text(null);
        tips.text('开始计时');
        btAgent.text('按摩中');
        start(data);
      }
    }, 1000);
  } else {
    delay.text(null);
    tips.text('开始计时');
    btAgent.text('按摩中');
    start(data);
  }
}

function start(data) {
  var btAgent = $('#btagent');
  var time = $('#time');
  var tips = $('#tips');
  var t = parseInt(data.remainSeconds);
  btAgent.addClass('shake');
  var delayInterval = setInterval(function() {
    var hours = Math.floor(t / 3600);
    var minutes = Math.floor((t % 3600) / 60);
    var seconds = Math.floor(t % 60);
    hours = checkTime(hours);
    minutes = checkTime(minutes);
    seconds = checkTime(seconds);
    time.text(hours + ':' + minutes + ':' + seconds);
    if (t-- === 0) {
      clearInterval(delayInterval);
      btAgent.removeClass('shake');
      tips.text('按摩结束');
      btAgent.text('我要加钟');
      btAgent.on('click', function(e) {
        window.location = './taocan.html?token=' + getUrlParam("token");
      })
    }
  }, 1000);
}

function init() {
  var param = {
    type: 'POST',
    url: "http://www.szcloudshare.com/idev/public/queryRemainTime.api",
    data: { token: getUrlParam('token') },
    error: function(err) {
      console.log("获取时间失败", err);
    },
    success: function(resp) {
      // console.dir(resp);
      if (resp.errorCode == 0) {
        dataReady(resp.entity);
      } else {
        console.log("获取时间失败:" + resp);
      }
    }
  };
  $.ajax(param);

}

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}