var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var junk = require('junk');
var getIndex = require('./getindex');

// Private
var books = [];

function prepare(startPath, filter, config) {
  var projects = fs.readdirSync(startPath).filter(junk.not);
  _.each(projects, function(project){
    var projectfile = path.join(startPath, project);
    var stat = fs.lstatSync(projectfile); //true or false

    if (stat.isDirectory()) {
      prepare(projectfile, filter);
    } else if (projectfile.indexOf(filter)>=0) {
      writeBooks(projectfile, filter);
    };
  });
}

function writeBooks(projectfile, filter) {
  var book = getIndex(path.dirname(projectfile), filter);
  books.push(book);
}


// Public
module.exports = function(config) {
  var startPath = config.base;
  var filter = config.index;
  prepare(startPath, filter, config);
  _.each(books, function(book){
    book.dest = config.dest;
    book.root = config.root;
    book.stylesFolder = config.stylesFolder;
  });
  if (_.isEmpty(books)) {
    console.log('Not found any book project compatible with buildebooks.');
  } else {
    return books;
  }
};