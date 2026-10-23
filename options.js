document.addEventListener('DOMContentLoaded', function () {

  // 初期値の設定
  chrome.storage.sync.get(['spaceKey', 'apiKey', 'issueIdOrKey'], function (data) {
    document.getElementById('spaceKey').value = data.spaceKey || '';
    document.getElementById('apiKey').value = data.apiKey || '';
    document.getElementById('issueIdOrKey').value = data.issueIdOrKey || '';
  });

  var vals = {};
  document.getElementById('save').addEventListener('click', function () {
    vals = {
      spaceKey: document.getElementById('spaceKey').value,
      apiKey: document.getElementById('apiKey').value,
      issueIdOrKey: document.getElementById('issueIdOrKey').value
    };
    
    chrome.storage.sync.set(vals, function () {
      console.log('Options saved', vals);
      var message = document.getElementById('message');
      message.textContent = 'Options saved!!';
      message.style.display = 'block';
    });
  });

});
