
var renderFollowing = function(following) {
    var followingDiv = document.getElementById('following');
    for (var i = 0; i < following.length; i++) {
        pushFollowing(following[i]);
    }
}

var renderFollowers = function(followers) {
    var followersDiv = document.getElementById('followers');
    for (var i = 0; i < followers.length; i++) {
        pushFollowers(followers[i]);
    }
}

var renderProfileSideBar = function(user, timestamp) {
    if (user.userid == localStorage.userid) {
        $('#editProfileImage').show();
        initUpload();
    }
    document.getElementById('username').innerHTML = "<h4>" + user.name + "</h4>";
    setProfileImage(fetchImage(user));
}


var renderFeed = function(tweets) {
    for (var i = 0; i < tweets.length; i++) {
        pushTweet(tweets[i], 'newsFeed');
    }
}

var renderUserPosts = function(tweets) {
    if (tweets.length == 0 && viewingUser.posts.length == 0) document.getElementById('userPosts').innerHTML = '<h4><em>The newb is yet to tweet :/</em></h3>';
    for (var i = 0; i < tweets.length; i++) {
        pushTweet(tweets[i], 'userPosts');
    }
}

var renderResults = function(tweets) {
    document.getElementById('searchResults').innerHTML = '<h4><em>Showing results for "' + decodeURIComponent(query) + '" : </em></h4>';
    if (tweets.length == 0) document.getElementById('searchResults').innerHTML = '<h4><em>You can\'t haz resultz :3</em></h4>';
    for (var i = 0; i < tweets.length; i++) {
        pushTweet(tweets[i], 'searchResults');
    }
}

var reRenderFeed = function(newImage) {
    var tweets = JSON.parse(localStorage.feed);
    for(var i=0;i<tweets.length;i++)
        if(tweets[i].userid == localStorage.userid)
            tweets[i].image = newImage;
    localStorage.feed = JSON.stringify(tweets);
    document.getElementById('newsFeed').innerHTML = "";
    renderFeed(tweets);
}

var renderFollowersCount = function(count) {
    document.getElementById('followersButton').innerHTML = "Followers ("+count+")";
}

var renderFollowingCount = function(count) {
    document.getElementById('followingButton').innerHTML = "Following ("+count+")";
}

var pushFollowing = function(user) {
    var element = document.createElement('li');
    element.innerHTML = '<a href="#users/' + user.username + '">' + user.username + '</a>';
    var separator = document.createElement('li');
    separator.setAttribute('class', 'divider');
    var followingDiv = document.getElementById('following');
    followingDiv.appendChild(element);
    followingDiv.appendChild(separator);
}

var pushFollowers = function(user) {
    var element = document.createElement('li');
    element.innerHTML = '<a href="#users/' + user.username + '">' + user.username + '</a>';
    var separator = document.createElement('li');
    separator.setAttribute('class', 'divider');
    var followerDiv = document.getElementById('followers');
    followerDiv.appendChild(element);
    followerDiv.appendChild(separator);
}

var pushTweet = function(tweet, divId) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/' + tweet.username + '"><img class="media-object pthumbnail" src="' + fetchImage(tweet) + '"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/' + tweet.username + '">' + tweet.username + '</a></h4>' + imageParser(tweet.content) + '</div><div class="timestamp">' + new Date(tweet.timestamp).toString().substring(0, 21) + '</div></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.appendChild(element);
}

var pushLatestFeed = function(tweets) {
    for (var i = 0; i < tweets.length; i++)
        pushNewTweet(tweets[i], 'newsFeed');
}

var pushNewTweet = function(tweet, divId) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/' + tweet.username + '"><img class="media-object pthumbnail" src="' + fetchImage(tweet) + '"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/' + tweet.username + '">' + tweet.username + '</a></h4>' + imageParser(tweet.content) + '</div><div class="timestamp">' + new Date(tweet.timestamp).toString().substring(0, 21) + '</div></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.insertBefore(element, feedDiv.firstChild);
}

var imageParser = function(content) {
    var expression = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])\.(jpeg|jpg|png|gif)/ig;
    return content.replace(expression, '<br><a href="$1.$3" target="_blank"><img src="$1.$3" style="width:100px;height:100px;"></a><br>')
}