var execFile = (require('child_process')).execFile;
var fs = require('fs');
var path = require('path');

module.exports = function(epubfile, done) {
  invokeCommand('kindlegen', [epubfile], callbackObject(done));

  function invokeCommand(bin, args, callbacks) {
    var process = execFile(bin, args);
    process.stdout.on('data', callbacks.onstdout);
    process.stderr.on('data', callbacks.onstderr);
    process.on('error', callbacks.onfail);
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
