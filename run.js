function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function () {
  chrome.storage.sync.get(['spaceKey', 'apiKey', 'issueIdOrKey'], function (data) {
    run(data);
  });
});

function run(data) {
  if (!data.spaceKey || !data.apiKey || !data.issueIdOrKey) {
    console.warn('[Backlog Template] 設定が不足しています:', data);
    return;
  }

  var domain = window.location.hostname.endsWith('.backlog.jp') ? 'backlog.jp' : 'backlog.com';
  var Backlog = {
    endpoint: 'https://' + data.spaceKey + '.' + domain + '/api/v2',
    api_key: data.apiKey,

    callApi: function (api) {
      var url = this.endpoint + api + '?apiKey=' + this.api_key;

      return fetch(url, {
        cache: 'no-cache',
        signal: AbortSignal.timeout(3000)
      }).then(function (response) {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      });
    },
    getIssue: function (issueId) {
      var path = '/issues/' + issueId;
      return this.callApi(path);
    }
  };

  Backlog.getIssue(data.issueIdOrKey).then(function (response) {
    waitForForm(function (title, desc) {
      applyTemplate(title, desc, response);
    });
  }).catch(function (error) {
    console.error('Error: ' + error);
  });
}

function applyTemplate(title, desc, response) {
  // 件名の入力
  if (title) {
    title.value = '3ヶ月後に見ても分かるタイトルを書きましょう';
    title.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // 詳細の入力
  if (desc) {
    if (desc.tagName.toLowerCase() === 'textarea' || desc.tagName.toLowerCase() === 'input') {
      desc.value = response.description;
      desc.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // contenteditable (div#descriptionTextArea / ProseMirror)
      desc.focus();
      var selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(desc);
      selection.removeAllRanges();
      selection.addRange(range);

      var success = document.execCommand('insertText', false, response.description);
      if (!success || !desc.textContent.trim()) {
        desc.innerText = response.description;
        desc.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }
}

function waitForForm(callback) {
  var titleSelector = '#summaryInput, input[name="issue.summary"]';
  var descSelector = '#descriptionTextArea, textarea[name="issue.description"], #descriptionInput';

  var title = document.querySelector(titleSelector);
  var desc = document.querySelector(descSelector);
  if (title && desc) {
    callback(title, desc);
    return;
  }

  var observer = new MutationObserver(function () {
    var t = document.querySelector(titleSelector);
    var d = document.querySelector(descSelector);
    if (t && d) {
      observer.disconnect();
      callback(t, d);
    }
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
}
