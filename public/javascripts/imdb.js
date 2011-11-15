{
$(function() {
  $(".imdb input:submit").live('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    $imdbActions = $("#imdb-actions");
    if(!$imdbActions.length) {
      $imdbActions = $("<div id='imdb-actions'></div>");
      $("form.actions .actions").append($imdbActions);
    }
    
    $(".imdb #spinner").show();
    $("fieldset.imdb h1.title").html('');
    
    $imdbActions.html('');
    
    $.get('/imdb/' + encodeURIComponent($("#imdb-id").val()), function(data) {
      console.log(data);
      $(".imdb #spinner").hide();
      
      $("input[name='rename']:text").val(data.title);
      
      $imdbActions.html(data.actions);
      $("fieldset.imdb h1.title").html(data.fullTitle);
    });
    
    return false;
  });
});
}
