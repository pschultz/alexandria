var config = require('../public/javascripts/config');
var makeCleanFilename = require('../lib/makeCleanFilename');
var fs = require('fs');

module.exports = function(req, res, next) {
  //console.log(req.body.rename);
  
  var filename = req.body.filename.replace(/^.*\//, '');
  if(req.body.rename) {
    var filename = makeCleanFilename(req.body.rename);
  }

  var targetPath = [ req.body.filename.replace(/^(.*)\/.*?$/, '$1'), filename ].join('/');

  if(!req.body.move) {
    move(req.body.filename, targetPath, req, res, next);
  }

  if(req.body.move == 'yes') {
    targetPath = [ config.fsRoot, config.videoDirname, 'all', filename].join('/');
  }
  
  move(req.body.filename, targetPath, req, res, next);
}

function move(from, to, req, res, next) {
  from = from.replace(/\/+/g, '/');
  to = to.replace(/\/+/g, '/') + "." + req.body.renameExtension;

  if(from == to) {
    next(req, res);
    return;
  }
  
  toDirname = to.replace(/^(.*)\/.*?$/, "$1");
  var mkdirCmd = "mkdir -p '%s'".sprintf(toDirname);

  //console.log(mkdirCmd);
  require('child_process').exec(mkdirCmd, function(err, stdout, stderr) {
    if(stderr) {
      console.log([mkdirCmd, stderr].join(":\n"));
      next(req, res);
      return;
    }

    req.body.filename = to;
    next(req, res);
    
    var cmd = "mv '%s' '%s'".sprintf(from, to);
    //console.log(cmd);
    
    require('child_process').exec(cmd, function(err, stdout, stderr) {
      if(stderr && !stderr.match(/are the same file/)) {
        console.log([cmd, stderr].join(":\n"));
      }
    });
  });
}
