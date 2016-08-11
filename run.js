$(function () {
  chrome.storage.sync.get(['spaceKey', 'apiKey', 'issueIdOrKey'], function (data) {
    run(data);
  });
});

function run(data) {

    var Backlog =  {
      endpoint: 'https://' + data.spaceKey + '.backlog.jp/api/v2',
      api_key: data.apiKey,

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
    Backlog.getIssue(data.issueIdOrKey).done(function (response) {
        $title.val('3ヶ月後に見ても分かるタイトルを書きましょう');
        $desc.val(response.description);
    }).fail(function (XMLHttpRequest, textStatus) {
      console.error('Error: ' + textStatus);
    });

}
