var config = require('../public/javascripts/config');
var makeCleanFilename = require('../lib/makeCleanFilename');
var fs = require('fs');

module.exports = function(req, res, next) {
  //console.log(req.body.ln);
  var basepath = config.videoDirname;

  var links = [
    {
      postDataKey: 'cast',
      pathPattern: 'Actor/%s/%s',
    },
    {
      postDataKey: 'director',
      pathPattern: 'Director/%s/%s',
    },
    {
      postDataKey: 'company',
      pathPattern: 'Company/%s/%s',
      format: makeCleanFilename,
    },
    {
      postDataKey: 'year',
      pathPattern: 'Year/%d/%s',
      validate: function(v) { return v.match(/^\d\d\d\d$/); },
      format: function(v) { return parseInt(v); },
    },
    {
      postDataKey: 'rating',
      pathPattern: 'IMDB-Rating/%s/%s',
      validate: function(v) { return v.match(/^\d\.\d$/); },
      format: function(v) { return "%d-%d/%s".sprintf(parseInt(v), parseInt(v)+1, v); },
    },
  ];

  var fullFilename = req.body.filename || false;
  if(!fullFilename) return;
  fullFilename = fullFilename.replace(/\/+/g, '/');
  
  var filename = fullFilename.replace(/.*\//g, "").replace(/\/+/g, '/');
  var ln = req.body.ln || false;
  if(!ln) return;
  
  links.map(function(linkDef) {
    //console.log(linkDef); return;
    var data = ln[linkDef.postDataKey] || false;
    
    if(!data) return;
    //console.log(data);
    for(var subdir in data) {
      if(!data.hasOwnProperty(subdir)) {
        continue;
      }
      
      var v = data[subdir] || false;
      if(!v || v != 'on') {
        continue;
      }
      
      var validate = linkDef.validate || function() { return 1; };
      if(!validate(subdir)) {
        continue;
      }

      var format = linkDef.format || require('../lib/makeCleanFilename');
      
      subdir = format(subdir);
      
      var fullLinkPath = [config.fsRoot, basepath, linkDef.pathPattern].join('/');
      fullLinkPath = fullLinkPath.sprintf(subdir, filename);
      
      var linkDirectory = fullLinkPath.replace(/^(.*)\/.*?$/, "$1");
      var mkdirCmd = "mkdir -p '%s'".sprintf(linkDirectory);
      var lnCmd = "ln -s '%s' '%s'".sprintf(fullFilename, fullLinkPath);

      var cmd = [ mkdirCmd, lnCmd ].join(' && ');

      //console.log(cmd);
      
      require('child_process').exec(cmd, function(err, stdout, stderr) {
        if(stderr) {
          console.log([cmd, stderr].join(":\n"));
        }
      });
  
    }
  });
  next(req, res);
};
