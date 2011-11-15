var makeCleanFilename = require('../lib/makeCleanFilename');

module.exports.post = function(req, res) {
  //console.log(req.body);

  require('./mv')(req, res, function(req, res) {
    require('./ln')(req, res,
      function(req, res) {
        res.end();
      }
    )
  });
  
}

module.exports.get = function(req, res) {

  var views = [ 'video/imdb', 'rename', 'video/mv' ];
  
  var clean = makeCleanFilename(req.params.filename);
  var viewVars = {};
  
  viewVars.renameToFilename = clean;
  
  (require('../lib/renderActionViews'))(views, viewVars, function(html) {
    res.send(html);
  });

}


