var fsPermissions = require('../lib/fsPermissions');
module.exports = function(req, res) {
    try {
        fsPermissions(req.body.path, req, res);

        require('child_process').exec("file -b '" + req.body.path+"'", function(err, stdout, stderr) {
          if(stderr) console.log(stderr);
          var responseBody = { 'filetype': stdout, 'getActionsFrom': '/404' };
          var filename = req.body.path.replace(/^.*\//, '');
          var directory = req.body.path.replace(/^(.*)\/.*?$/, '$1');
          responseBody.getActionsFrom = '/videoActions/%s/%s'.sprintf(encodeURIComponent(filename), encodeURIComponent(directory));

          res.send(responseBody);
        });
    }
    catch(e) {
        res.send(404);
        return;
    }
};