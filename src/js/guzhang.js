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
  var type = '';
  var type1 = $('#type1');
  var type2 = $('#type2');
  var type3 = $('#type3');
  var detels = $('#detels');
  var submit = $('#submit');
  var tNumber = $('#t-number');
  var successbtn = $('#successbtn');
  var success = $('#dialog-success');
  var model = $('#model');
  var loading = $('#loading');
  var faild = $('#dialog-faild');
  var faildbtn = $('#faildbtn');
  var faildText = $('#faild-text');

  detels.on('keydown', function(e) {
    tNumber.text(e.target.value.length);
    if (e.target.value.length > 3) {
      submit.attr('disabled', null);
      submit.addClass('active');
    } else {
      submit.attr('disabled', true);
      submit.removeClass('active');
    }
  });
  type1.on('change', function(e) {
    type = e.target.value;
    submit.attr('disabled', null);
    submit.addClass('active');
  });
  type2.on('change', function(e) {
    type = e.target.value;
    submit.attr('disabled', null);
    submit.addClass('active');
  });
  type3.on('change', function(e) {
    type = e.target.value;
    if (detels.val() === '') {
      submit.attr('disabled', true);
      submit.removeClass('active');
      detels.trigger('focus');
    }
  });
  submit.on('click', function(e) {
    model.show();
    loading.show();
    console.log('loading', loading);
    let params = { leixing: parseInt(type), miaoshu: detels.val() }
    fetch(params)

  });
  successbtn.on('click', function(e) {
    model.hide();
    success.hide();
    window.location = './taocan.html?token=' + getUrlParam("token");
  });

  faildbtn.on('click', function() {
    faild.hide();
    model.hide();
  });
}

function fetch(params) {
  params.token = getUrlParam('token');
  var param = {
    crossDomain: true,
    withCredentials: true,
    type: 'POST',
    url: "http://123.56.68.222:8080/idev/public/guzhangshenbao/shenbao.api",
    // url: "http://www.szcloudshare.com/idev/public/guzhangshenbao/create.api",		
    data: JSON.stringify(params),
    // data: params,
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    error: function(err) {
      gzComplate(err);
    },
    success: function(resp) {
      gzComplate(resp);
    }
  };
  console.log('param', param);
  $.ajax(param);
}

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}

function gzComplate(data) {
  var success = $('#dialog-success');
  var loading = $('#loading');
  var faild = $('#dialog-faild');
  var faildText = $('#faild-text');
  loading.hide();
  if (data.errorCode === 0) {
    success.show();
  } else {
    faild.show();
    faildText.text("感谢反馈，" + data.message + "，请稍后再次重试，给您带来的不便敬请谅解。");
  }
}