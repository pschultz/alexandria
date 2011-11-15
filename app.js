
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
  require('./public/javascripts/sprintf');
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Alexandria'
  });
});

app.post('/ls', require('./routes/ls'));
app.post('/file', require('./routes/file'));
app.get('/imdb/:id', require('./routes/imdb'));
app.get('/videoActions/:filename/:directory', require('./routes/videoActions').get);
app.post('/videoActions', require('./routes/videoActions').post);
app.get('/ln', function(req, res) { res.render('actions/video/ln'); });
// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}

