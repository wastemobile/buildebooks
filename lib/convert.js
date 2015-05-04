var execFile = require('child_process').execFile;
var pandoc = require('pdc').path;
var path = require('path');
var temp = require('temp');
var mv = require('mv');

module.exports = function(params, cb) {

  var argsArray = [];
  var epubFile = temp.path({suffix: '.epub'});

  argsArray = argsArray.concat(params.input);
  argsArray = argsArray.concat(params.args);
  argsArray = argsArray.concat("-o", epubFile);

  //console.log(argsArray);
  execFile(pandoc, argsArray, {
    cwd: params.cwd
  }, function (err, stdout, stderr) {
    if (err) {
      cb(err, null);
    }
    else {
      execFile('/bin/mv',
         [epubFile, params.output],
         function(err, stdout, stderr) {
           if (err) { cb(err, null); }
           else { cb(null, params.output); }
         });
    }
  });
};