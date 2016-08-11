$(function () {

  // 初期値の設定
  chrome.storage.sync.get(['spaceKey', 'apiKey', 'issueIdOrKey'], function (data) {
    $('#spaceKey').val(data.spaceKey);
    $('#apiKey').val(data.apiKey);
    $('#issueIdOrKey').val(data.issueIdOrKey);
  });

  var key = 'backlog-template';
  var vals = {};
  $('#save').on('click', function () {
    vals = {
      spaceKey: $('#spaceKey').val(),
      apiKey: $('#apiKey').val(),
      issueIdOrKey: $('#issueIdOrKey').val()
    };
    console.log(vals);
    chrome.storage.sync.set(vals, function () {
      console.log('Options are saved', vals);
    });
  });


});
