var fs = require('fs');
var fm = require('front-matter');
var path = require('path');
var _ = require('underscore');
var low = require('lowdb');
var junk = require('junk');
var uuid = require('node-uuid');
var mkdirp = require('mkdirp');
low.mixin(require('underscore-db'));

var db = low('./books.json');

module.exports = function(config, startPath, filter) {

  prepare(startPath, filter);

  function prepare(startPath, filter){
    if (!fs.existsSync(startPath)) {
      console.log("no dir ", startPath);
      return;
    }
    var projects = fs.readdirSync(startPath).filter(junk.not);
    _.each(projects, function(project){
      var projectfile = path.join(startPath, project);
      var stat = fs.lstatSync(projectfile); //true or false

      if (stat.isDirectory()) {
        prepare(projectfile, filter);
      } else if (projectfile.indexOf(filter)>=0) {
        writeDB(projectfile);  
      };
    });
  }

  function getuuid(projectname){
    if (!db('books').find({book: projectname})) {
      var bookId = db('books').insert({book: projectname, id: uuid.v4()}).id;
      return bookId;
    } else {
      var bookId = db('books').find({book: projectname}).id;
      return bookId;
    }
  }

  function writeDB(projectfile) {
    var projectname = _.last(path.dirname(projectfile).split(path.sep));
    var bookid = getuuid(projectname);
    var project = {};
    project.metadata = config.metadata;
    project.folder = path.dirname(projectfile);
    project.outFolder = path.join(project.folder, config.dest);
    mkdirp(project.outFolder);
    _.extend(project, fm(fs.readFileSync(projectfile, 'utf-8')).attributes);
    db('books').update(bookid, project);
    db.save();
  }

  return db('books').value();

};