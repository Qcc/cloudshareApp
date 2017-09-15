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
  var report = $('#report');
  var t = data.remainSeconds - data.dingdan.taocan.jishi;
  var getTime = setInterval(function() {
    init();
    if (t < 0) {
      clearInterval(getTime);
    }
  }, 3000);
  if (t > 0) {
    data.remainSeconds = data.remainSeconds - t;
    delay.text(t);
    var delayInterval = setInterval(function() {
      delay.text(t--);
      if (t === 0) {
        clearInterval(delayInterval);
        delay.text(null);
        tips.text('开始计时');
        btAgent.text('足疗机已运行,按摩中');
        report.hide();
        start(data);
      }
    }, 1000);
  } else {
    delay.text(null);
    tips.text('开始计时');
    report.hide();
    btAgent.text('足疗机已运行,按摩中');
    start(data);
  }
}

function start(data) {
  var btAgent = $('#btagent');
  var time = $('#time');
  var tips = $('#tips');
  var report = $('#report');
  var t = parseInt(data.remainSeconds);
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
      tips.text('按摩结束');
      report.hide();
      btAgent.text('我要加钟');
      btAgent.on('click', function(e) {
        window.location = './taocan.html?token=' + getUrlParam("token");
      })
    }
  }, 1000);
}

function init() {
  var reportUrl = $('#report-url');
  reportUrl.attr('href', './guzhang.html?token=' + getUrlParam("token"));
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