// var execFile = require('child_process').execFile;
// var path = require('path');
// var fs = require('fs');
// var low = require('lowdb');
// var _ = require('underscore');
// var mkdirp = require('mkdirp');

// // Private
// function getBooks() {
//   var db = low('./books.json');
//   return db('books').where({publish: true});
// }

// function pubSingle(book, config) {
//   try {
//     var check = fs.statSync(path.join(config.dest, book.book));
//   } catch(err) {
//     mkdirp(path.join(config.dest, book.book));
//   }
//   var version = book.release_version || book.edit_version || null;
//   var name = book.filename || book.book;
//   var target = path.join(config.dest, book.book, name);
//   var file;
//   if (version !== null) {
//     file = path.join(book.outFolder, name) + "-" + version;
//   } else {
//     file = path.join(book.outFolder, name);
//   }
//   var bookType = [".epub", "-sample.epub", ".mobi", "-sample.mobi"];
//   var source, dest;
//   _.each(bookType, function(item) {
//     source = file + item;
//     dest = target + item;
//     pubCopy(source, dest);
//   });
// }

// function pubCopy(source, dest) {
//   try {
//     var checkSource = fs.statSync(source);
//     fs.createReadStream(source).pipe(fs.createWriteStream(dest));
//     console.log(dest + " published.");
//   } catch(err) {
//     console.log(source + ' file not exist.');
//   }
  
// }

// // Public
// exports = module.exports = {

//   pubAll: function(config) {
//     var books = getBooks();
//     _.each(books, function(book) {
//       pubSingle(book, config);
//     }); 
//   },
//   epub: function(book, outFile, sample) {
//     try {
//       var checkPath = fs.statSync(book.pubFolder);
//     } catch (err) {
//       mkdirp(book.pubFolder);
//     }
//     var dest;
//     if (sample) {
//       dest = path.join(book.pubFolder, book.filename) + "-sample.epub";
//     } else {
//       dest = path.join(book.pubFolder, book.filename) + ".epub";
//     }
    

//     if (book.edit_version
//         && book.release_version
//         && (book.edit_version !== book.release_version)) {
//       console.log('Not fit the publish rule.');
//     } else {
//       pubCopy(outFile, dest);
//     }
//   },
//   kindle: function(book, outFile, sample) {
//     var dest;
//     if (sample) {
//       dest = path.join(book.pubFolder, book.filename) + "-sample.mobi";
//     } else {
//       dest = path.join(book.pubFolder, book.filename) + ".mobi";
//     }
    

//     if (book.edit_version
//         && book.release_version
//         && (book.edit_version !== book.release_version)) {
//       console.log('Not fit the publish rule.');
//     } else {
//       pubCopy(outFile, dest);
//     }
//   }

// };
