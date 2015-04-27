var execFile = require('child_process').execFile;
var pandoc = require('pdc').path;
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var temp = require('temp');
var mv = require('mv');
var kindlebuild = require('./kindle');

module.exports = {
  
  multi: function(books) {
    _.each(books, function(book){
      build(book);
    });
  },

  single: function(book) {
    build(book);
  }
};

  function build(book) {
    var outFile = path.join(book.outFolder, book.filename) + '-' + String(book.edit_version) + '.epub';
    var document = "";
    if (book.metafile) {
        document += fs.readFileSync(path.join(book.folder, book.metafile), 'utf-8');
        document += '\n\n';
      }
    book['files'].forEach(function(file){
      document += fs.readFileSync(path.join(book.folder, file), 'utf-8');
      document += '\n\n';
    });
    temp.track();
    var mdFile = temp.path({suffix: '.md'});
    fs.writeFileSync(mdFile, document, 'utf-8');
    
    var preArgs = getargs(book);

    convert({
      args: preArgs,
      input: mdFile,
      output: outFile,
      cwd: book.folder
    }, function(err, data) {
      if (err) {
        console.error(err);
      }
      else {
        console.log("Created " + data);
        kindlebuild(data);
      }
    });
  }

  function getargs(book) {
    var args = {
      "epub-chapter-level": "2"
    };
    try {
      var stylepath = path.join(book.folder, book.stylesheet);
      var style = fs.readFileSync(stylepath, 'utf-8');
      _.extend(args, {"epub-stylesheet": book.stylesheet});
    } catch (err) {
      console.log('指定樣式檔不存在。');
    }
    var argsArray = [];
    
    Object.keys(args).forEach(function(key) {
      if (Array.isArray(args[key])) {
        args[key].forEach(function(value) {
          argsArray = argsArray.concat("--" + key, value);
        });
      }
      else {
        argsArray = argsArray.concat("--" + key, args[key]);
      }
    });

    argsArray = argsArray.concat("-t", 'epub3');
    argsArray = argsArray.concat("-f", 'markdown+markdown_in_html_blocks');
    argsArray = argsArray.concat("--toc");

    return argsArray;
  }

  function convert(params, cb) {

    var argsArray = params.args;
    var epubFile = temp.path({suffix: '.epub'});

    argsArray = argsArray.concat("-o", epubFile);
    argsArray = argsArray.concat(params.input);

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
  }


