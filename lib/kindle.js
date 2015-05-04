var exec = (require('child_process')).exec;
var fs = require('fs');
var path = require('path');

module.exports = function(epubfile, done) {
  var cmd = 'kindlegen ' + epubfile;

  invokeCommand(cmd, callbackObject(done));

  function invokeCommand(cmd, callbacks) {
    var process = exec(cmd);
    process.stdout.on('data', callbacks.onstdout);
    process.stderr.on('data', callbacks.onstderr);
    process.on('exit', function (code) {
        code === 0 ? callbacks.onsuccess() : callbacks.onfail();
    });
  }

  function callbackObject(done) {
    return {
        onstdout: function (output) {
            //return log.info(output);
            return;
        },
        onstderr: function (output) {
            console.log(output);
        },
        onsuccess: function () {
            console.log('Kindle 電子書製作完成。');
        },
        onfail: function () {
            console.log('Kindle 電子書製作失敗...');
        }
    };
  }
};