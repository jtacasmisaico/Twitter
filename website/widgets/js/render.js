//boot.js
_$.render.following = function(following) {
    var followingDiv = document.getElementById('following');
    for (var i = 0; i < following.length; i++) {
        _$.render.push.following(following[i]);
    }
}

_$.render.followers = function(followers) {
    var followersDiv = document.getElementById('followers');
    for (var i = 0; i < followers.length; i++) {
        _$.render.push.followers(followers[i]);
    }
}

_$.render.profileSideBar = function(user, timestamp) {
    if (user.userid == localStorage.userid) {
        $('#editProfileImage').show();
        _$.utils.initUpload();
    }
    document.getElementById('username').innerHTML = "<h4>" + user.name + "</h4>";
    _$.utils.setProfileImage(_$.fetch.image(user));
}


_$.render.feed = function(tweets) {
    for (var i = 0; i < tweets.length; i++) {
        _$.render.push.tweet(tweets[i], 'newsFeed');
    }
}

_$.render.userPosts = function(tweets) {
    if (tweets.length == 0 && _$.global.viewingUser.posts.length == 0) document.getElementById('userPosts').innerHTML = '<h4><em>The newb is yet to tweet :/</em></h3>';
    for (var i = 0; i < tweets.length; i++) {
        _$.render.push.tweet(tweets[i], 'userPosts');
    }
}

_$.render.results = function(tweets) {
    document.getElementById('searchResultsHeader').innerHTML = '<h4><em>Showing results for "' + decodeURIComponent(_$.global.query) + '" : </em></h4>';
    if (tweets.length == 0) document.getElementById('searchResults').innerHTML = '<h4><em>You can\'t haz resultz :3</em></h4>';
    for (var i = 0; i < tweets.length; i++) {
        _$.render.push.tweet(tweets[i], 'searchResults');
    }
}

_$.render.againFeed = function(newImage) {
    var tweets = JSON.parse(localStorage.feed);
    for(var i=0;i<tweets.length;i++)
        if(tweets[i].userid == localStorage.userid)
            tweets[i].image = newImage;
    localStorage.feed = JSON.stringify(tweets);
    document.getElementById('newsFeed').innerHTML = "";
    _$.render.feed(tweets);
}

_$.render.followersCount = function(count) {
    document.getElementById('followersButton').innerHTML = "Followers ("+count+")";
}

_$.render.followingCount = function(count) {
    document.getElementById('followingButton').innerHTML = "Following ("+count+")";
}

_$.render.push.following = function(user) {
    var element = document.createElement('li');
    element.innerHTML = '<a href="#users/' + user.username + '">' + user.username + '</a>';
    var separator = document.createElement('li');
    separator.setAttribute('class', 'divider');
    var followingDiv = document.getElementById('following');
    followingDiv.appendChild(element);
    followingDiv.appendChild(separator);
}

_$.render.push.followers = function(user) {
    var element = document.createElement('li');
    element.innerHTML = '<a href="#users/' + user.username + '">' + user.username + '</a>';
    var separator = document.createElement('li');
    separator.setAttribute('class', 'divider');
    var followerDiv = document.getElementById('followers');
    followerDiv.appendChild(element);
    followerDiv.appendChild(separator);
}

_$.render.push.tweet = function(tweet, divId) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/' + tweet.username + '"><img class="media-object pthumbnail" src="' + _$.fetch.image(tweet) + '"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/' + tweet.username + '">' + tweet.username + '</a></h4>' + _$.utils.youTubeParser(_$.utils.imageParser(tweet.content)) + '</div><abbr class="timestamp" title="'+new Date(tweet.timestamp).toISOString()+'">' + new Date(tweet.timestamp).toString().substring(0, 21) + '</abbr></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.appendChild(element);
    jQuery("abbr.timestamp").timeago();
}

_$.render.push.latestFeed = function(tweets) {
    for (var i = 0; i < tweets.length; i++)
        _$.render.push.newTweet(tweets[i], 'newsFeed');
}

_$.render.push.newTweet = function(tweet, divId) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/' + tweet.username + '"><img class="media-object pthumbnail" src="' + _$.fetch.image(tweet) + '"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/' + tweet.username + '">' + tweet.username + '</a></h4>' + _$.utils.youTubeParser(_$.utils.imageParser(tweet.content)) + '</div><abbr class="timestamp" title="'+new Date(tweet.timestamp).toISOString()+'">' + new Date(tweet.timestamp).toString().substring(0, 21) + '</abbr></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.insertBefore(element, feedDiv.firstChild);
    jQuery("abbr.timestamp").timeago();
}

_$.utils.imageParser = function(content) {
    var expression = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])\.(jpeg|jpg|png|gif)/ig;
    return content.replace(expression, '<br><a href="$1.$3" target="_blank"><img src="$1.$3" style="width:100px;height:100px;"></a><br>')
}

_$.utils.youTubeParser = function(content) {
    return content.replace(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="210" height="160" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');
}