
var doSearch = function() {
  var query = document.getElementById('search').value;
  if (query.length == 0) return false;
  document.location.href = document.location.href.split('#')[0] + '#search?q=' + encodeURIComponent(query);
  return false;
}

var searchFunction = function(query) {
  $.ajax({
    url: serverAddress + "search/tweet?keyword=" + query + "&offset=" + 0 + "&limit=" + 10,
    type: 'GET',
    xhrFields: {
      withCredentials: true
    },
    error: function(jqXHR) {
      console.log(jqXHR)
      logout();
    }
  }).done(function(data, textStatus, response) {
    renderResults(response.responseJSON);
    $('#searchResults').slideDown();
  });
}
