#! /usr/bin/env node

var fs = require('fs');
var fm = require('front-matter');
var path = require('path');
var _ = require('underscore');
var prebuild = require('./lib/prebuild');
var multi = require('./lib/build').multi;

module.exports = function() {

  var config = {};

  fs.readFile('./config.md', 'utf8', function(err, data){
    if (err) {
      console.log('找不到 config.md，使用預設值嘗試中...');
      config = {
        "base": 'projects',
        "dest": 'books',
        "index": 'book.md',
        "metafile": 'metadata.md',
        "style": 'default'
      };
    } else {
      config = fm(data).attributes;
      config.base = config.base || 'projects';
      config.dest = config.dest || 'books';
      config.index = config.index || 'book.md';
      config.metafile = config.metafile || 'metadata.md';
      config.style = config.style || 'default';
    }

    var startPath = path.join('./', config.base);
    var filter = config.index;
    multi(prebuild(config, startPath, filter));
  });
  
};
