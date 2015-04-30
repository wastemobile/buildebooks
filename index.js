#! /usr/bin/env node

var fs = require('fs');
var fm = require('front-matter');
var path = require('path');
var _ = require('underscore');
var prebuild = require('./lib/prebuild');
var multi = require('./lib/build').multi;

module.exports = function() {

  var config = {};
  var rootDir = process.cwd();

  fs.readFile('./config.md', 'utf8', function(err, data){
    if (err) {
      console.log('找不到 config.md，使用預設值嘗試中...');
      config = {
        "base": 'projects',
        "dest": 'books',
        "index": 'book.md',
        "metafile": 'metadata.md',
        "stylesFolder": 'styles',
        "root": rootDir
      };
    } else {
      config = fm(data).attributes;
      config.base = config.base || 'projects';
      config.dest = config.dest || 'books';
      config.index = config.index || 'book.md';
      config.metafile = config.metafile || 'metadata.md';
      config.stylesFolder = config.stylesFolder || 'styles';
      config.root = rootDir;
    }

    var startPath = path.join('./', config.base);
    var filter = config.index;
    //prebuild(config, startPath, filter);
    multi(prebuild(config, startPath, filter));
  });
  
};
