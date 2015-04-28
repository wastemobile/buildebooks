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
        getFullData(projectfile);  
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

  function getmeta(project) {
    var metapath = path.join(project.folder, project.metafile);
    try {
      var meta = fm(fs.readFileSync(metapath, 'utf-8'));
      _.extend(project, meta.attributes);
      return project;
    } catch (err) {
      console.log('請檢查 ' + projectname + ' 的詮釋資料後再嘗試製書。');
    }
  }

  function getFullData(projectfile) {
    var projectname = _.last(path.dirname(projectfile).split(path.sep));
    var bookid = getuuid(projectname);
    var project = {};
    project.folder = path.dirname(projectfile);
    project.outFolder = path.join(project.folder, config.dest);
    mkdirp(project.outFolder);
    try {
      var index = fm(fs.readFileSync(projectfile, 'utf-8'));
      _.extend(project, index.attributes);
      if (!project.metafile) {
        project.metafile = config.metafile;
      }
    } catch (err) {
      console.log('read index error: ' + err);
    }
    var fulldata = getmeta(project);
    writeDB(bookid, fulldata);
  }

  function writeDB(bookid, fulldata) {
    db('books').update(bookid, fulldata);
    db.save();
  }

  return db('books').where({build: true});

};