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

  function getOutFile(book) {
    var outName = book.filename || book.book;
    var outFile;
    if (String(book.edit_version) !== "undefined") {
      outFile = path.join(book.outFolder, outName) + '-' + String(book.edit_version) + '.epub';
    } else {
      outFile = path.join(book.outFolder, outName) + '.epub';
    }
    return outFile;
  }

  function build(book) {
    
    var outFile = getOutFile(book);
    
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
        if (book.kindle) {
          kindlebuild(data);
        }
      }
    });
  }

  function checkFile(style, local, root) {
    var localStyle = path.join(local, style);
    var rootStyle = path.join(root, style);
    var checkExist = function(file) {
      try {
        var check = fs.statSync(file);
        return true;
      } catch (err) {
        return false;
      }
    }
    if (checkExist(localStyle)) {
      return style;
    } else if (checkExist(rootStyle)) {
      return rootStyle;
    } else {
      return false;
    }
  }

  function getStyle(book) {
    var stylesFolder = path.join(book.root, book.stylesFolder);
    if (book.stylesheet) {
      return checkFile(book.stylesheet, book.folder, stylesFolder);
    } else if (book.metadata.stylesheet) {
      return checkFile(book.metadata.stylesheet, book.folder, stylesFolder);
    } else {
      return false;
    }
  }

  function getargs(book) {
    var args = { "epub-chapter-level": "2" };
    var style = getStyle(book);
    if (style) {
      _.extend(args, {"epub-stylesheet": style});
      console.log('使用樣式為： ' + style);
    } else {
      console.log('指定樣式檔不存在。');
    }
    if (book.cover-image) {
      try {
        var checkCover = fs.statSync(path.join(book.folder, book.cover-image));
        _.extend(args, {"epub-cover-image": book.cover-image});
      } catch (err) {
        console.log('製書索引中設定的封面圖檔不存在。');
      }
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
  }


