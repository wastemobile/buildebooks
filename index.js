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

  try {
    var data = fs.readFileSync('./config.md', 'utf8');
    _.extend(config, fm(data).attributes);
    config.root = rootDir;
    config.base = config.base || 'projects';
    config.dest = config.dest || 'books';
    config.index = config.index || 'book.md';
    config.metafile = config.metafile || 'metadata.md';
    config.stylesFolder = config.stylesFolder || 'styles';
  } catch (err) {
    console.log('Not found config.md, try default setting...');
    config = {
      "base": 'projects',
      "dest": 'books',
      "index": 'book.md',
      "metafile": 'metadata.md',
      "stylesFolder": 'styles',
      "root": rootDir
    };
  }

  var startPath = path.join('./', config.base);
  var filter = config.index;

  try {
    var checkStart = fs.statSync(startPath);
    try {
      var books = prebuild(config, startPath, filter);
      multi(books);
    } catch (err) {
      console.log('prebuild err: ' + err);
    }
  } catch (err) {
    console.log('No specified projects folder, check your config.');
  }
    
};
