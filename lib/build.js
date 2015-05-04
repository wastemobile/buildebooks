var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var mkdirp = require('mkdirp');
var temp = require('temp');
var convert = require('./convert');
var kindle = require('./kindle');

// Private
function getOutName(folder, name, editVersion) {
  var outName;
  if (String(editVersion) !== "undefined") {
    outName = path.join(folder, name) + '-' + String(editVersion);
  } else {
    outName = path.join(folder, name);
  }
  return outName;
}

function buildMD(folder, metafile, files) {
  var document = "";
  if (metafile) {
      document += fs.readFileSync(path.join(folder, metafile), 'utf-8');
      document += '\n\n';
    }
  files.forEach(function(file){
    document += fs.readFileSync(path.join(folder, file), 'utf-8');
    document += '\n\n';
  });
  temp.track();
  var mdFile = temp.path({suffix: '.md'});
  fs.writeFileSync(mdFile, document, 'utf-8');
  return mdFile;
}

function checkFile(style, local, stylesFolder) {
  var finalStyle;
  var checkExist = function(file) {
    try {
      var check = fs.statSync(file);
      return true;
    } catch (err) {
      return false;
    }
  }
  if (checkExist(path.join(local, style))) {
    finalStyle = style;
  } else if (stylesFolder) {
    finalStyle = path.join(stylesFolder, style);
  } else {
    finalStyle = false;
  }
  return finalStyle;
}

function getStyle(book) {
  var style = book.stylesheet || book.metadata.stylesheet || 'default.css';
  var stylesFolder;
  if (book.stylesFolder && book.root) {
    stylesFolder = path.join(book.root, book.stylesFolder);
  } else {
    stylesFolder = null;
  }
  var realStyle = checkFile(style, book.folder, stylesFolder);
  return realStyle;
}

function getargs(book) {
  var args = { "epub-chapter-level": "2" };
  var style = getStyle(book);
  if (style) {
    _.extend(args, {"epub-stylesheet": style});
    console.log(book.filename + ' 使用樣式為： ' + style);
  } else {
    console.log('指定樣式檔不存在。如果不使用任何樣式表，請移除製書索引或詮釋資料中的指定，否則 Pandoc 會回報錯誤而無法製書。');
  }
  var coverImage = book
  if (book['cover-image']) {
    try {
      var checkCover = fs.statSync(path.join(book.folder, book['cover-image']));
      _.extend(args, {"epub-cover-image": book['cover-image']});
    } catch (err) {
      console.log('製書索引中設定的封面圖檔不存在。');
    }
  } else if(book.metadata['cover-image']) {
    try {
      var checkCover = fs.statSync(path.join(book.folder, book.metadata['cover-image']));
      _.extend(args, {"epub-cover-image": book.metadata['cover-image']});
    } catch (err) {
      console.log('詮釋資料檔中設定的封面圖檔不存在。');
      process.exit(1);
    }
  } else {
    console.log('未指定封面圖檔。');
  }
  try {
    var checkXML = fs.statSync(path.join(book.folder, 'uuid.xml'));
    _.extend(args, {"epub-metadata": 'uuid.xml'});
  } catch (err) {
    console.log(book.book + ' 沒有找到 uuid.xml。');
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

// Public
module.exports = function(book){
  var dest = book.dest || "books";
  var buildFolder = path.join(book.folder, dest);
  try {
    var checkFolder = fs.readdirSync(buildFolder);
  } catch (e) {
    mkdirp(buildFolder);
  }
  var outName = getOutName(buildFolder, book.filename, book.edit_version);
  var preArgs = getargs(book);
  var params = [];
  params[0] = {
    "output": outName + '.epub',
    "input": buildMD(book.folder, book.metafile, book.files),
    "args": preArgs,
    "cwd": book.folder
  };
  if (book.sample && (book.publish === true)) {
    params[1] = {
      "output": outName + '-sample.epub',
      "input": buildMD(book.folder, book.metafile, book.sample),
      "args": preArgs,
      "cwd": book.folder
    };
  }
  var getResult = function(err, data) {
    if (err) {
      console.error(err);
    }
    else {
      console.log("Created " + data);
      if (book.kindle && (book.kindle === true)) {
        kindle(data);
      }
    }
  };

  _.each(params, function(param) {
    convert(param, getResult);
  });
};


