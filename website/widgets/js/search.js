//boot.js
_$.utils.checkKeySearch = function(event) {
    $("#search").autocomplete("enable");
    if (event.keyCode == 13) {
        return _$.utils.doSearch();
    } else {
        if(document.getElementById('search').value[0]=='#')
            $("#search").autocomplete("disable");
        return true;
    }
}

_$.utils.doSearch = function() {
    var query = document.getElementById('search').value;
    document.getElementById('search').value = '';
    document.getElementById('search').blur();
    if (query.length == 0) return false;
    if (query[0] == '#')
        document.location.href = document.location.href.split('#')[0] + '#search?q=' + encodeURIComponent(query.substring(1));
    else
        document.location.href = document.location.href.split('#')[0] + '#users/' + encodeURIComponent(query);
    return false;
}

_$.utils.searchFunction = function(query, lastTweet) {
    if(lastTweet == undefined || lastTweet == 0) {
        lastTweet = 2147483647;
        search.result = [];
    }
    $.ajax({
        url: _$.global.serverAddress + "search/tweets?keyword=" + query + "&lastTweet=" + lastTweet + "&limit=" + 10,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            console.log(jqXHR)
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        if(search.results == undefined) search.result = [];
        search.result = search.result.concat(response.responseJSON);
        _$.render.results(response.responseJSON);
        $('#searchResults').slideDown();
    });
}
