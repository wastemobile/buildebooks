var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');
var jstoxml = require('jstoxml');
var fm = require('front-matter');
var _ = require('underscore');

// Private
function check(folder, indexFile) {
  try {
    var rawData = fs.readFileSync(path.join(folder, indexFile), 'utf8');
    return rawData;
  } catch(err) {
    throw "notFoundBookIndex";
  }
}

function checkUuidXML(folder, bookid){
  var uuidXML = path.join(folder, 'uuid.xml');
  try {
    var checkXML = fs.statSync(uuidXML);
    return;
  } catch(err) {
    var id = uuid.v1();
    var xmlContent = jstoxml.toXML({
      _name: 'dc:identifier',
      _content: 'urn:uuid:' + bookid,
      _attrs: {
        id: 'uuid-id'
      }
    });
    fs.writeFileSync(uuidXML, xmlContent, 'utf8');
  }
}

function getmeta(folder, jsonData) {
  var metapath = path.join(folder, jsonData.metafile);
  jsonData.metadata = {};
  try {
    var meta = fm(fs.readFileSync(metapath, 'utf-8'));
    _.extend(jsonData.metadata, meta.attributes);
    return jsonData;
  } catch (err) {
    throw err;
  }
}

function getDirName() {
  var dirName = path.basename(process.cwd());
  return dirName;
}

function getJSON(folder, raw) {
  try {
    var fmatter = fm(raw);
    if (_.isEmpty(fmatter.attributes.files)) {
      throw "indexFilesNotFound";
    }
    var jsonData = {};
    _.extend(jsonData, fmatter.attributes);
    jsonData.intro = fmatter.body;
    if(_.isUndefined(jsonData.build)) { jsonData.build = true};
    if(_.isUndefined(jsonData.publish)) { jsonData.publish = false};
    if(_.isUndefined(jsonData.kindle)) { jsonData.kindle = false};
    jsonData.metafile = jsonData.metafile || 'metadata.md';
    jsonData.filename = jsonData.filename || getDirName();
    jsonData.folder = folder;
    jsonData.root = process.cwd();
    return jsonData;
  } catch(err) {
    if (err === "indexFilesNotFound") {
      throw err;
    } else {
      throw err;
    }
  }
}

module.exports = function(folder, indexFile, bookid) {
  folder = folder || './';
  indexFile = indexFile || 'book.md';
  bookid = bookid || uuid.v1();
  try {
    var indexJson = getJSON(folder, check(folder, indexFile));
    indexJson = getmeta(folder, indexJson);
    checkUuidXML(folder, bookid);
    return indexJson;
  } catch(err) {
    throw err;
  }
};