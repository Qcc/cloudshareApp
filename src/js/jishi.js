window.onload = function() {
    init();
    var btAgent = $('#btagent');
    var time = $('#time');
    // var t = parseInt(data.remainSeconds);
    var t = 600
    var delayInterval = setInterval(function() {
        var hours = Math.floor(t / 3600);
        var minutes = Math.floor((t % 3600) % 60);
        var seconds = Math.floor(t % 60);
        // int hour = second/3600;
        // int minute = second%3600/60;
        // int sec = second%60;
        time.text(hours + ':' + minutes + ':' + seconds);
        t = t - 1;
        if (t === 0) {
            clearInterval(delayInterval);
        }
    }, 1000);
    delayInterval();
}

function dataReady(data) {
    var delay = $('#delay');
    var tips = $('#tips');
    var t = parseInt(delay.text());
    var delayInterval = setInterval(function() {
        t = t - 1;
        delay.text(t);
        if (t === 0) {
            clearInterval(delayInterval);
            delay.text(null);
            tips.text('开始计时');
            start(data);
        }
    }, 1000);
    delayInterval();
}

function start(data) {
    var btAgent = $('#btagent');
    var time = $('#time');
    var t = parseInt(data.remainSeconds);
    var delayInterval = setInterval(function() {
        t = t - 1;
        var showTime = new Date(t)
        console.log(showTime)
        delay.text(t);
        if (t === 0) {
            clearInterval(delayInterval);
            delay.text(null);
            tips.text('开始计时');
            start(data);
        }
    }, 1000);
    delayInterval();
}

function init() {
    var param = {
        type: 'POST',
        url: "http://www.szcloudshare.com/iDevice/public/queryRemainTime.api",
        data: { token: getUrlParam('token') },
        error: function(err) {
            alert("获取时间失败", err);
        },
        success: function(resp) {
            // console.dir(resp);
            if (resp.errorCode == 0) {
                console.log('success', resp);
                dataReady(resp.entity);
            } else {
                console.log("获取时间失败:" + resp);
            }
        }
    };
    $.ajax(param);

}

// btAgent.on('touchend', function(e) {
//     toggleClass(btAgent, 'shake')
// });

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}