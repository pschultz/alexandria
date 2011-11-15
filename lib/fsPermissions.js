var fs = require('fs');
var config = require('../public/javascripts/config');

module.exports = function(path, req, res) {
    if(!path) {
        throw new Error;
    }
    if(!req.xhr) {
        throw new Error("No XHR");
    }
    if(!path.match(new RegExp("^" + config.fsRoot))) {
        throw new Error;
    }

    var stats = fs.statSync(path);
    if(!stats.isDirectory() && !stats.isFile() && !stats.isSymbolicLink()) {
        throw new Error;
    }
};