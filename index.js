var _ = require('underscore');
var getConfig = require('./lib/getconfig');
var build = require('./lib/build');
var getBooks = require('./lib/getbooks');

exports = module.exports = {

  bes: function() {
    try {
      var config = getConfig();
      var books = getBooks(config);
      _.each(books, function(book){
        if (book.build) {
          build(book);
        }
      });
    } catch(err) {
      console.log(err);
    }
  }

};