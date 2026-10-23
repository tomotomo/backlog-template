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

    var Backlog = {
      endpoint: 'https://' + data.spaceKey + '.backlog.jp/api/v2',
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

    var title = document.querySelector('input[name="issue.summary"]');
    var desc = document.querySelector('textarea[name="issue.description"]');
    Backlog.getIssue(data.issueIdOrKey).then(function (response) {
      if (title) {
        title.value = '3ヶ月後に見ても分かるタイトルを書きましょう';
      }
      if (desc) {
        desc.value = response.description;
      }
    }).catch(function (error) {
      console.error('Error: ' + error);
    });

}
