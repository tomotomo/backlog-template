$(function () {
  chrome.storage.sync.get(['spaceKey', 'apiKey', 'issueIdOrKey'], function (data) {
    console.log(data);
  });
  // TODO localStorageの設定データが全部取得できたら実行する。
  run();
});

function run() {

    var Backlog =  {
      endpoint: 'https://*.backlog.jp/api/v2',
      api_key: 'YOUR_API_KEY',

      callApi: function (api) {
        var url = this.endpoint + api + '?apiKey=' + this.api_key;

        return $.ajax({
          url: url,
          timeout: 3000,
          cache: false,
          dataType: 'json'
        });
      },
      getIssue: function (issueId) {
        var path =  '/issues/' + issueId;
        return this.callApi(path);
      }
    };


    var $title = $('input[name="issue.summary"]');
    var $desc = $('textarea[name="issue.description"]');
    Backlog.getIssue('ISSUE_ID').done(function (data) {
        $title.val('3ヶ月後に見ても分かるタイトルを書きましょう');
        $desc.val(data.description);
    }).fail(function (XMLHttpRequest, textStatus) {
      console.error('Error Backlog.call function:' + textStatus);
    });

}
