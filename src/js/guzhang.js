window.onload = function() {
  init();
}

function init() {
  var type = '';
  var type1 = $('#type1');
  var type2 = $('#type2');
  var type3 = $('#type3');
  var detels = $('#detels');
  var submit = $('#submit');
  var tNumber = $('#t-number');
  var dialog = $('#dialogbtn');
  var model = $('#model');
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
    console.log(type, detels.val());
    model.show();
  });
  dialog.on('click', function(e) {
    console.log(model)
    model.hide();
  });
}