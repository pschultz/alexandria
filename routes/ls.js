var fs = require('fs');
var fsPermissions = require('../lib/fsPermissions');

module.exports = function(req, res) {
  //console.log(req.body);
  try {
    var dir = decodeURIComponent(req.body.dir);
    fsPermissions(dir, req, res);

    //console.log(dir);

    var allFiles = fs.readdirSync(dir);
    var dirs = [];
    var files = [];

    allFiles.map(function(path) {
      if(path.charAt(0) == '.') return;

      fullPath = dir + '/' + path;
      try {
        var stats = fs.statSync(fullPath);

        if(stats.isDirectory()) {
          dirs.push(path);
        }
        else if(stats.isFile()) {
          files.push(path);
        }
      }
      catch(e) {}
    });

    files.sort();
    dirs.sort();
    
    res.partial('ls', {
        base: dir+'/',
        'dirs': dirs,
        'files': files,
    });
  }
  catch(e) {
    console.log(e);
    res.send(404);
    return;
  }
};

