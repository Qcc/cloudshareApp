window.onload = function() {
  init();
}

function bindRoom(params) {
  var bindstatus = $('#bindstatus');
  var dev = $('#dev');
  var room = $('#room');
  var param = {
    crossDomain: true,
    withCredentials: true,
    type: 'POST',
    url: "http://www.szcloudshare.com/idev/public/shebei/assignRoom.api",
    data: JSON.stringify(params),
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    error: function(err) {
      bindstatus.addClass('failed');
      bindstatus.text('绑定失败！');
    },
    success: function(resp) {
      if (resp.errorCode === 0) {
        bindstatus.addClass('success');
        bindstatus.text('绑定成功！');
        dev[0].value = '';
        room[0].value = '';
      } else {
        bindstatus.addClass('failed');
        bindstatus.text('绑定失败,' + resp.message);
      }
    }
  };
  $.ajax(param);
}

function init() {
  var bind = $('#bind');
  var dev = $('#dev');
  var room = $('#room');
  var vaildDev = $('#vailddev');
  var vaildRoom = $('#vaildroom');
  var bindstatus = $('#bindstatus');
  var params = {}
  dev.on('input propertychange', function(e) {
    bindstatus.text('');
    if (e.target.value.length > 6) {
      vaildDev.text('ID应该为六位数字');
    } else {
      vaildDev.text('');
    }
  });
  dev.on('change', function(e) {
    if (e.target.value.length !== 6) {
      vaildDev.text('ID应该为六位数字');
    } else {
      vaildDev.text('');
    }
  });
  room.on('change', function(e) {
    bindstatus.text('');
    if (e.target.value.length < 3) {
      vaildRoom.text('房间号请输入3-5位数字，不够位0补');
    } else if (e.target.value.length > 5) {
      vaildRoom.text('房间号请输入3-5位数字，不够位0补');
    } else {
      vaildRoom.text('');
    }
  });
  bind.on('click', function(e) {
    if (dev[0].value === '') {
      vaildDev.text('设备ID不能为空')
    }
    if (room[0].value === '') {
      vaildRoom.text('房间号不能为空')
    }
    if (vaildDev.text() || vaildRoom.text()) {
      return;
    }
    params.shebeibianhao = { bianhao: +dev[0].value };
    params.bushufangjian = +room[0].value;
    bindRoom(params);
  });
}