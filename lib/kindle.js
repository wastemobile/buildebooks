var exec = (require('child_process')).exec;
var fs = require('fs');
var path = require('path');
var Log = require('log');
var log = new Log('debug');

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
            return log.info(output);
        },
        onstderr: function (output) {
            return log.error(output);
        },
        onsuccess: function () {
            return log.info('書籍製作完成。');
        },
        onfail: function () {
            return log.error('書籍製作失敗...');
        }
    };
  }
};