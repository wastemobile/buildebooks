#! /usr/bin/env node

var _ = require('underscore');
var shell = require('shelljs');
var getIndex = require('./lib/getindex');
var getConfig = require('./lib/getconfig');
var build = require('./lib/build');
var getBooks = require('./lib/getbooks');
var pjson = require('./package.json');

var userArgs = process.argv.splice(2);
var runPattern = userArgs[0];

//check
if (runPattern === "-v" || runPattern === "--version") {
  console.log(pjson.version);
  process.exit(1);
}

if (!shell.which('pandoc')) {
  shell.echo('You need install pandoc first to execute buildebooks program.');
  process.exit(1);
}

if (!shell.which('kindlegen')) {
  shell.echo('Not found kindelgen, you cannot build kindle ebooks.');
}

try {
  var book = getIndex();
  if (book.build) {
    build(book);
  } else {
    console.log('索引中設定為不要製作，修改或移除該設定後再試。');
  }
} catch(err) {
  if (err === "notFoundBookIndex") {
    try {
      var config = getConfig();
      var books = getBooks(config);
      _.each(books, function(book){
        if (book.build) {
          build(book);
        } else {
          console.log(book.filename + " 設定為不要製作。");
        }
      });
    } catch(err) {
      console.log(err);
    }
  } else {
    console.log(err);
  }
}

