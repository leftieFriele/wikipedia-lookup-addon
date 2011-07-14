// Wikipedia Lookup Add-on
var contextMenu = require("context-menu");
var request = require("request");
var selection = require("selection");
var windows = require("windows").browserWindows;
 
exports.main = function(options, callbacks) {
  console.log(options.loadReason);
 
  var menuItem = contextMenu.Item({
 
    label: "Lookup in WikiPedia",
    context: contextMenu.SelectionContext(),
    contentScript: 'self.on("click", function () {' +
		   ' var text = window.getSelection().toString();' +
                   '  self.postMessage(text);' +
                   '});',
 
    // When we receive the message, call the Google Translate API with the
    // selected text and replace it with the translation.
    onMessage: function (text) {
      if (text.length === 0) {
        throw ("Text to translate must not be empty");
      }
      windows.open("http://en.wikipedia.org");
      console.log("input: " + text);
      var req = request.Request({
        url: "http://ajax.googleapis.com/ajax/services/language/translate",
        content: {
          v: "1.0",
          q: text,
          langpair: "|en"
        },
        onComplete: function (response) {
          translated = response.json.responseData.translatedText;
          console.log("output: " + translated);
          selection.text = translated;
        }
      });
      req.get();
    }
  });
};
 
exports.onUnload = function (reason) {
  console.log(reason);
};
