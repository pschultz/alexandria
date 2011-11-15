var http = require('http');
var renderActions = require('../lib/renderActionViews');

function jQuery(html) {
  html = html.replace(/(<script(.|[\r\n])*?<\/script>)/gi, "");
  
  var window = require('jsdom').jsdom(html, null, {
    FetchExternalResources: false,
    ProcessExternalResources: false,
    MutationEvents: false,
    QuerySelector: false
  }).createWindow();
  
  return require('jquery').create(window);
}

var options = { 
    host: 'www.imdb.com',
    port: 80,
    method: 'GET',
};

module.exports = function(req, res) {
  
  var id = decodeURIComponent(req.params.id).match(/tt\d+/);

  if(!id) {
    res.send(404);
    return;
  }
  id = id[0];
  
  options['path'] = '/title/' + id + '/';
  
  var imdbResponseContent = "";
  
  http
  .get(options, function(imdbRes) {
    imdbRes
    .on('data', function(chunk) {
      imdbResponseContent += chunk.toString('utf8');
    })
    .on('end', function() {
      parseImdbResponse(imdbResponseContent, res);
    });
  })
  .on('error', function(e) {
      console.log("Got error: " + e.message);
      res.send(404);
  });
};

function parseImdbResponse(imdbResponseContent, httpResponse) {
  
  var responseData = {
    title: '',
    fullTitle: '',
    year: [],
    cast: [],
    rating: [],
    director: [],
    company: [],
  };

  var $ = jQuery(imdbResponseContent);
  var views = ['video/ln'];
  
  parseTitleAndYear($, responseData);
  parseDirector($, responseData);
  parseCast($, responseData);
  parseRating($, responseData);
  parseCompanies($, responseData);
  parseTrailer($, responseData, views);
  
  renderActions(views, {data: responseData}, function(html) {
    httpResponse.send({
      'title': responseData.movieTitleOnly, 
      'fullTitle': responseData.fullTitle, 
      'actions': html
    });
  });
};

var parseTitleAndYear = function($, responseData) {
  responseData.fullTitle = $("h1").text().trim();
  var $additionalTitleInfo = $("h1 span").detach();
  responseData.movieTitleOnly = $("h1").text().trim();  
  
  var year = $("a[href^='/year']", $additionalTitleInfo).text().replace(/[\)\(]/g, "").trim();
  if(year.length == 4) responseData.year.push(year);
};

var parseDirector = function($, responseData) {
  var director = $("h4:contains('Director')").next().text().trim();
  if(director.length) responseData.director.push(director);
};

var parseRating = function($, responseData) {
  var rating = $(".rating-rating").text().trim().replace(/\/.*$/, "");
  if(rating.length) responseData['rating'] = [ rating ];
};

var parseCast = function($, responseData) {
  $(".cast_list .name").each(function() {
    responseData['cast'].push($(this).text().trim());
  });
};

var parseTrailer = function($, responseData, views) {
  var $trailerLink = $("a.title-trailer");
  if(!$trailerLink.length) return;
  
  responseData.trailerUrl = "http://www.imdb.com" + $trailerLink.attr('href');
  views.push('/video/trailer');
};

var parseCompanies = function($, responseData) {
  $("h3:contains('Company Credits') + * h4 ~ a").each(function() {
    responseData['company'].push($(this).text().trim());
  });
};