var fs = require('fs');
var fm = require('front-matter');
var _ = require('underscore');
var path = require('path');

var config = {};

// Public
module.exports = function() {
  try {
    var data = fs.readFileSync('config.md', 'utf8');
    _.extend(config, fm(data).attributes);
    config.root = process.cwd();
    config.base = config.base || './';
    config.dest = config.dest || 'books';
    config.index = config.index || 'book.md';
    config.metafile = config.metafile || 'metadata.md';
    config.stylesFolder = config.stylesFolder || 'styles';
  } catch (err) {
    console.log('Not found config.md, try default setting...');
    config = {
      "base": './',
      "dest": 'books',
      "index": 'book.md',
      "metafile": 'metadata.md',
      "stylesFolder": 'styles',
      "root": process.cwd()
    };
  }
  return config;
};