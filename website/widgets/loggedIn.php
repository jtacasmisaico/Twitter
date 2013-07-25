<script>


var changeTweetButtonState = function () {
    if(document.getElementById("tweetBox").value.length>0) { 
        document.getElementById("tweetButton").removeAttribute('disabled'); 
        document.getElementById("tweetButton").setAttribute('class','btn btn-info'); 
    }
    else { 
        document.getElementById("tweetButton").setAttribute('disabled'); 
        document.getElementById("tweetButton").setAttribute('class','btn disabled'); 
    }
}

var fetchTweets = function(userid, offset) {
    if(offset == undefined) offset = 0;
    console.log("Fetching tweet for : "+userid);
    $.ajax({
        url: "http://localhost:8080/posts/"+userid+"?offset="+offset,
        type: 'GET',
        error: function(jqXHR){
            logout();
        }
    }).done(function(data, textStatus, response) {
        if(userid==localStorage.userid) {
            localStorage.tweets = JSON.stringify(response.responseJSON);
            renderTweetSidebar();
        }
        else {
            if(offset == 0) document.getElementById('userPosts').innerHTML = "";
            renderUserPosts(response.responseJSON);
            $('#userPosts').show();
        }
    });
}

var fetchFollowing = function(userid) {
    $.ajax({
        url: "http://localhost:8080/users/"+userid+"/follows",
        type: 'GET',
        error: function(jqXHR){
            logout();
        }
    }).done(function(data, textStatus, response) {
        if(userid == localStorage.userid) {
            localStorage.follows = JSON.stringify(response.responseJSON);
        }        
        renderFollowing(response.responseJSON);
    });
}

var fetchFollowers = function(userid) {
    $.ajax({
        url: "http://localhost:8080/users/"+userid+"/followers",
        type: 'GET',
        error: function(jqXHR){
            logout();
        }
    }).done(function(data, textStatus, response) {
        if(localStorage.userid == userid) {
            localStorage.followers = JSON.stringify(response.responseJSON);
        }
        renderFollowers(response.responseJSON);
    });
}

var fetchFeed = function(tweetsFetched) {
    if(tweetsFetched == undefined) {
        if(localStorage.feed!=undefined) { console.log("Already fetched"); renderFeed(JSON.parse(localStorage.feed)); return; }
        localStorage.feed = "[]";
        tweetsFetched = 0;
    }
    $.ajax({
        url: "http://localhost:8080/feed?offset="+tweetsFetched,
        type: 'GET',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token':localStorage.sessionid,
            'userid':localStorage.userid
            },
        error: function(jqXHR){
            logout();
    }
        }).done(function(data, textStatus, response) {
            localStorage.tweetsFetched = parseInt(localStorage.tweetsFetched) + response.responseJSON.length;
            var existingFeed = JSON.parse(localStorage.feed);
            var newFeed = existingFeed.concat(response.responseJSON);
            localStorage.feed = JSON.stringify(newFeed);
            renderFeed(response.responseJSON)
    });
}

var postTweet = function() {
   $.ajax({
        url: "http://localhost:8080/tweet",
        type: 'POST',
        data: JSON.stringify({ content: document.getElementById('tweetBox').value, userid: localStorage.userid }),
        headers: { 
            'Content-Type': 'application/json',
            'token':localStorage.sessionid,
            'userid':localStorage.userid
        },
        error: function(jqXHR){
                console.log(jqXHR);
                logout();
        }
    }).done(function(data, textStatus, response) {    	
            document.getElementById('tweetBox').value = "";
            changeTweetButtonState();
    		var pushedTweet = response.responseJSON;
            var tweets = JSON.parse(localStorage.tweets);
            tweets.push(pushedTweet);
            localStorage.tweets = JSON.stringify(tweets);
            pushOwnTweets(pushedTweet);
    });
    return false;
}

var renderTweetSidebar = function() {
    var tweets = JSON.parse(localStorage.tweets);
    for(var i=0; i<tweets.length; i++) {
        pushOwnTweets(tweets[i]);
    }
}

var renderFollowing = function(following) {
    var followingDiv = document.getElementById('following');
    followingDiv.innerHTML = '<li class="divider"></li>';
    for(var i=0; i<following.length; i++) {
        pushFollowing(following[i]);
    }
}

var renderFollowers = function(followers) {
    var followersDiv = document.getElementById('followers');
    followersDiv.innerHTML = '<li class="divider"></li>';
    for(var i=0; i<followers.length; i++) {
        pushFollowers(followers[i]);
    }	
}

var renderProfileSideBar = function(username) {
    document.getElementById('username').innerHTML = "<h4>"+username+"</h4>";
}

var renderUserPosts = function(tweets) {
    for(var i=0;i<tweets.length;i++) {
        pushTweet(tweets[i],'userPosts');
    }
}

var pushOwnTweets = function(tweet) {    
    var element = document.createElement('div');
    element.setAttribute('href','#');
    element.setAttribute('rel','tooltip');
    element.setAttribute('data-toggle','tooltip');
    element.setAttribute('title',new Date(tweet.timestamp).toString().substring(0,21));
    element.innerHTML = tweet.content;
    var separator = document.createElement('div');
    separator.setAttribute('class','divider');
    var feedDiv = document.getElementById('tweetsFromSelf');
    feedDiv.insertBefore(element, feedDiv.firstChild);    
    feedDiv.insertBefore(separator, feedDiv.firstChild);
}

var pushFollowing = function(user) {    
    var element = document.createElement('li');
    element.innerHTML = '<a href="#users/'+user.username+'">'+user.username+'</a>';
    var separator = document.createElement('li');
    separator.setAttribute('class','divider');
    var followingDiv = document.getElementById('following');
    followingDiv.insertBefore(element, followingDiv.firstChild);
    followingDiv.insertBefore(separator, followingDiv.firstChild);
}

var pushFollowers = function(user) {    
    var element = document.createElement('li');
    element.innerHTML = '<a href="#users/'+user.username+'">'+user.username+'</a>';
    var separator = document.createElement('li');
    separator.setAttribute('class','divider');
    var followerDiv = document.getElementById('followers');
    followerDiv.insertBefore(element, followerDiv.firstChild);
    followerDiv.insertBefore(separator, followerDiv.firstChild);
}

var findUsername = function(userid) {
    var list = JSON.parse(localStorage.follows);
    for(var i=0;i<list.length;i++) {
        if(list[i].userid==userid)
            return list[i].username;
    }
}

var renderFeed = function(tweets) {
    for(var i=0;i<tweets.length;i++) {
        pushTweet(tweets[i],'newsFeed');
    }
}

var pushTweet = function(tweet, divId) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/'+findUsername(tweet.userid)+'"><img class="media-object" src="./img/avatar.png"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/'+findUsername(tweet.userid)+'">'+findUsername(tweet.userid)+'</a></h4>'+tweet.content+'</div><div class="timestamp">'+ new Date(tweet.timestamp).toString().substring(0,21)+'</div></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.appendChild(element);
}
</script>