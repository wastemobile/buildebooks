var execFile = require('child_process').execFile;
var pandoc = require('pdc').path;
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var temp = require('temp');
var mv = require('mv');
var kindlebuild = require('./kindle');

module.exports = function(books) {
  
  _.each(books, function(book){
    singlebuild(book);
  });

  function singlebuild(book) {
    var outFile = path.join(book.outFolder, book.filename) + '-' + String(book.edit_version) + '.epub';
    var document = "";
    if (book.metadata) {
        document += fs.readFileSync(path.join(book.folder, book.metadata), 'utf-8');
        document += '\n\n';
      }
    book['files'].forEach(function(file){
      document += fs.readFileSync(path.join(book.folder, file), 'utf-8');
      document += '\n\n';
    });
    temp.track();
    var mdFile = temp.path({suffix: '.md'});
    fs.writeFileSync(mdFile, document, 'utf-8');
    convert({
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

  function convert(params, cb) {
    var args = {
      "epub-chapter-level": "2"
    };

    var argsArray = [];
    var epubFile = temp.path({suffix: '.epub'});

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
    argsArray = argsArray.concat("-o", epubFile);
    argsArray = argsArray.concat(params.input);
    argsArray = argsArray.concat("--toc");

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

};

