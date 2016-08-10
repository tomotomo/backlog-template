$(function () {
  var options = ['spaceKey', 'apiKey', 'issueIdOrKey'];
  $('#save').on('click', function () {
    for (var i=0; i<options.length; i++) {
      var v = options[i];
      localStorage[v] = $('#'+v).val();
    }
    console.log('Options are saved.');
  });

  // 初期値の設定
  for (var i=0; i<options.length; i++) {
    var v = options[i];
    if (localStorage[v]) {
      $('#'+v).val(localStorage[v]);
    }
  }
});
