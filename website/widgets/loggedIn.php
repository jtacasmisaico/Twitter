<div id="profileSideBar" style="display:none;">
	<div id="username"></div>
	<h6><u>My Tweets</u></h6>
	<ul id="tweetsFromSelf" class="nav nav-list"></ul>
</div>
<form id="tweetForm" style="display:none;" onsubmit="postTweet()">
        <textarea id="tweetBox" rows="3" style="width:500px;" onkeyup="changeTweetButtonState()"></textarea>
        <button type="button" style="width:500px;" id="tweetButton" class="btn disabled" disabled onclick="postTweet()">Tweet</button>
</form>
<div id="newsFeed" class="feed" style="display:none;">
</div>

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
var fetchTweets = function(userid) {
    $.ajax({
        url: "http://localhost:8080/posts/"+localStorage.userid,
        type: 'GET',
        error: function(jqXHR){
            logout();
        }
    }).done(function(data, textStatus, response) {
        localStorage.tweets = JSON.stringify(response.responseJSON);
    });
}

var renderProfileSideBar = function() {
	console.log("Rendered Side Bar");
    var sidebar = document.getElementById('profileSideBar');
    document.getElementById('username').innerHTML = "<h4>"+localStorage.name+"</h4>";
    var tweets = JSON.parse(localStorage.tweets);
    for(var i=0; i<tweets.length; i++) {
        pushOwnTweets(tweets[i]);
    }

}

var pushOwnTweets = function(tweet) {    
    var element = document.createElement('li');
    element.innerHTML = tweet.content;
    var separator = document.createElement('li');
    separator.setAttribute('class','divider');
    var feedDiv = document.getElementById('tweetsFromSelf');
    feedDiv.insertBefore(separator, feedDiv.firstChild);
    feedDiv.insertBefore(element, feedDiv.firstChild);
}

var postTweet = function() {
   $.ajax({
        url: "http://localhost:8080/tweet",
        type: 'POST',
        data: JSON.stringify({ content: document.getElementById('tweetBox').value, userid: localStorage.userid }),
        headers: { 
            'Content-Type': 'application/json',
            'token':localStorage.sessionid
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

var fetchFollows = function() {
   $.ajax({
        url: "http://localhost:8080/users/"+localStorage.userid+"/follows",
        type: 'GET',
        error: function(jqXHR){
            logout();
        }
    }).done(function(data, textStatus, response) {
            localStorage.follows = JSON.stringify(response.responseJSON);
            renderFollows(response.responseJSON);
    });
}

var renderFollows = function(follows) {
}

var fetchFeed = function() {
    $.ajax({
        url: "http://localhost:8080/feed",
        type: 'POST',
        data: JSON.stringify({ userid: localStorage.userid }),
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token':localStorage.sessionid
            },
        error: function(jqXHR){
            logout();
    }
        }).done(function(data, textStatus, response) {
            localStorage.feed = JSON.stringify(response.responseJSON);
            renderFeed(response.responseJSON)
    });
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
    element.innerHTML = '<a class="pull-left" href="#users/'+findUsername(tweet.userid)+'"><img class="media-object" src="./img/avatar.png"></a><div class="media-body"><h4 class="media-heading">'+findUsername(tweet.userid)+'</h4>'+tweet.content+'</div></div>'
    var feedDiv = document.getElementById('newsFeed');
    feedDiv.insertBefore(element, feedDiv.firstChild);
}

</script>