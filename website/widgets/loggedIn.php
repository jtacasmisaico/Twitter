<div id="loggedIn">
	<div id="profileSideBar" style="display:none;">
		<div id="username"></div>
		<div class="accordion" id="sidebarAccordion">
			<div class="accordion-group" style="border:0px;">
				<button class="btn btn-inverse" style="width:198px;" data-toggle="collapse" data-parent="#sidebarAccordion" data-target="#ownTweets">
				Tweets
				</button>
				<div id="ownTweets" class="collapse in">
					<ul id="tweetsFromSelf" class="nav nav-list"></ul>
				</div>

				<button class="btn btn-inverse" style="width:198px;" data-toggle="collapse" data-parent="#sidebarAccordion" data-target="#followersOwn">
				Followers
				</button>
				<div id="followersOwn" class="collapse">
					<ul id="ownFollowers" class="nav nav-list"></ul>
				</div>

				<button class="btn btn-inverse" style="width:198px;" data-toggle="collapse" data-parent="#sidebarAccordion" data-target="#followingOwn">
				Following
				</button>
				<div id="followingOwn" class="collapse">
					<ul id="ownFollowing" class="nav nav-list"></ul>
				</div>
			</div>
		</div>
	</div>
	<form id="tweetForm" style="display:none;" onsubmit="postTweet()">
	        <textarea id="tweetBox" rows="3" style="width:500px;" onkeyup="changeTweetButtonState()"></textarea>
	        <button type="button" style="width:500px;" id="tweetButton" class="btn disabled" disabled onclick="postTweet()">Tweet</button>
	</form>
	<div id="newsFeed" class="feed" style="display:none;">
	</div>
</div>
<script>
$(function () {
    $("[rel='tooltip']").tooltip();
});


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

var fetchTweets = function(userid) {
    $.ajax({
        url: "http://localhost:8080/posts/"+localStorage.userid,
        type: 'GET',
        error: function(jqXHR){
            logout();
        }
    }).done(function(data, textStatus, response) {
        localStorage.tweets = JSON.stringify(response.responseJSON);
        if(userid==localStorage.userid) renderTweetSidebar();
    });
}

var fetchFollows = function() {
   $.ajax({
        url: "http://localhost:8080/users/"+localStorage.userid+"/follows",
        type: 'GET',
        error: function(jqXHR){
            logout();
        }
    }).done(function(data, textStatus, response) {
            localStorage.follows = JSON.stringify(response.responseJSON);
            renderOwnFollows();
    });
}

var fetchFollowers = function() {
   $.ajax({
        url: "http://localhost:8080/users/"+localStorage.userid+"/followers",
        type: 'GET',
        error: function(jqXHR){
            logout();
        }
    }).done(function(data, textStatus, response) {
            localStorage.followers = JSON.stringify(response.responseJSON);
    		console.log(localStorage.followers);
    		renderOwnFollowers();
    });
}

var fetchFeed = function() {
    $.ajax({
        url: "http://localhost:8080/feed?offset=0",
        type: 'GET',
        data: JSON.stringify({ userid: localStorage.userid }),
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
            localStorage.feed = JSON.stringify(response.responseJSON);
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
                logout();
        }
    }).done(function(data, textStatus, response) {    	
    		console.log(JSON.stringify(response.responseJSON));
            document.getElementById('tweetBox').value = "";
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

var renderOwnFollows = function() {
    var follows = JSON.parse(localStorage.follows);
    for(var i=0; i<follows.length; i++) {
        pushOwnFollows(follows[i]);
    }
}

var renderOwnFollowers = function() {
    var followers = JSON.parse(localStorage.followers);
    for(var i=0; i<followers.length; i++) {
        pushOwnFollowers(followers[i]);
    }	
}

var renderProfileSideBar = function() {
    document.getElementById('username').innerHTML = "<h4>"+localStorage.name+"</h4>";
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

var pushOwnFollows = function(user) {    
    var element = document.createElement('li');
    element.innerHTML = user.username;
    var separator = document.createElement('li');
    separator.setAttribute('class','divider');
    var followingDiv = document.getElementById('ownFollowing');
    followingDiv.insertBefore(separator, followingDiv.firstChild);
    followingDiv.insertBefore(element, followingDiv.firstChild);
}

var pushOwnFollowers = function(user) {    
    var element = document.createElement('li');
    element.innerHTML = user.username;
    var separator = document.createElement('li');
    separator.setAttribute('class','divider');
    var followerDiv = document.getElementById('ownFollowers');
    followerDiv.insertBefore(separator, followerDiv.firstChild);
    followerDiv.insertBefore(element, followerDiv.firstChild);
}

var findUsername = function(userid) {
    var list = JSON.parse(localStorage.follows);
    for(var i=0;i<list.length;i++) {
        if(list[i].userid==userid)
            return list[i].username;
    }
}

var renderFeed = function(tweets) {
    var feedDiv = document.getElementById('newsFeed');
    for(var i=0;i<tweets.length;i++) {
        pushTweet(tweets[i]);
    }
}

var pushTweet = function(tweet) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/'+findUsername(tweet.userid)+'"><img class="media-object" src="./img/avatar.png"></a><div class="media-body tweet"><h4 class="media-heading">'+findUsername(tweet.userid)+'</h4>'+tweet.content+'</div><div class="timestamp">'+ new Date(tweet.timestamp).toString().substring(0,21)+'</div></div>'
    var feedDiv = document.getElementById('newsFeed');
    feedDiv.insertBefore(element, feedDiv.firstChild);
}

</script>