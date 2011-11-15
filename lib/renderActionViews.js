var synchronizer = require('../synchronizer');
var jade = require('jade');

module.exports = function(views, data, callback) {
  var html = "";
  var s = new synchronizer();
  
  var viewVars = data || {};
  var callback = callback || data || function(html) {};
  
  views.map(function(view) {
    s.waitFor(view);
    jade.renderFile('views/actions/'+view+'.jade', {locals: viewVars}, function(err, partialHtml) {
      
      if(err) {
        console.log(err);
        s.emit(view);
        return;
      }
      
      html += partialHtml;
      s.emit(view);
    });
  });
  
  s.notifyWhenSynced();
  s.on('synchronized', function() {
    callback(html);
  });

}