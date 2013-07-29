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
        url: serverAddress+"fetch/posts/"+userid+"?offset="+offset,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR){
            logout();
        }
    }).done(function(data, textStatus, response) {
        if(offset == 0) document.getElementById('userPosts').innerHTML = "";
        renderUserPosts(response.responseJSON);
        $('#userPosts').show();
    });
}

var fetchFollowing = function(userid, offset, limit) {
    if(offset == undefined) offset = $('#following > li').children().length;
    if(limit == undefined) limit = 5;
    console.log("Offset : "+offset);
    $.ajax({
        url: serverAddress+"users/follows/"+userid+"?offset="+offset+"&limit="+limit,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR){
            logout();
        }
    }).done(function(data, textStatus, response) {
        console.log(response.responseText);
        if(userid == localStorage.userid) {
            localStorage.follows = JSON.stringify(response.responseJSON);
        }                    
        renderFollowing(response.responseJSON);
    });
}

var fetchFollowers = function(userid, offset, limit) {
    if(offset == undefined) offset = $('#followers > li').children().length;
    if(limit == undefined) limit = 5;
    $.ajax({
        url: serverAddress+"users/followers/"+userid+"?offset="+offset+"&limit="+limit,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR){
            logout();
        }
    }).done(function(data, textStatus, response) {
        if(localStorage.userid == userid) {
            localStorage.followers = JSON.stringify(response.responseJSON);
        }
        else {
            if(follows(localStorage.userid, response.responseJSON)) {
                showUnFollowButton(true);
            }
            else showUnFollowButton(false);
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
        url: serverAddress+"fetch/feed?offset="+tweetsFetched,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
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
            console.log(response.responseText);
            localStorage.tweetsFetched = parseInt(localStorage.tweetsFetched) + response.responseJSON.length;
            var existingFeed = JSON.parse(localStorage.feed);
            var newFeed = existingFeed.concat(response.responseJSON);
            localStorage.feed = JSON.stringify(newFeed);
            renderFeed(response.responseJSON)
    });
}

var follow = function(followerid, followedid) {
    console.log(followerid, followedid);
    $.ajax({
        url: serverAddress+"users/follow",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({ follower : followerid, followed : followedid }),
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
            document.location.reload();
    });
    return false;
}

var unfollow = function(followerid, followedid) {
    console.log(followerid, followedid);
    $.ajax({
        url: serverAddress+"users/unfollow",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({ follower : followerid, followed : followedid }),
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
            document.location.reload();
    });
    return false;
}

var postTweet = function() {
   $.ajax({
        url: serverAddress+"post/tweet",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({ content: document.getElementById('tweetBox').value, userid: localStorage.userid, username: localStorage.username }),
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
            pushNewTweet(pushedTweet, 'newsFeed');
    });
    return false;
}

var renderFollowing = function(following) {
    var followingDiv = document.getElementById('following');
    for(var i=0; i<following.length; i++) {
        pushFollowing(following[i]);
    }
}

var renderFollowers = function(followers) {
    var followersDiv = document.getElementById('followers');
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

var pushFollowing = function(user) {    
    var element = document.createElement('li');
    element.innerHTML = '<a href="#users/'+user.username+'">'+user.username+'</a>';
    var separator = document.createElement('li');
    separator.setAttribute('class','divider');
    var followingDiv = document.getElementById('following');
    followingDiv.appendChild(element);
    followingDiv.appendChild(separator);
}

var pushFollowers = function(user) {    
    var element = document.createElement('li');
    element.innerHTML = '<a href="#users/'+user.username+'">'+user.username+'</a>';
    var separator = document.createElement('li');
    separator.setAttribute('class','divider');
    var followerDiv = document.getElementById('followers');
    followerDiv.appendChild(element);
    followerDiv.appendChild(separator);
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
    element.innerHTML = '<a class="pull-left" href="#users/'+tweet.username+'"><img class="media-object" src="./img/avatar.png"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/'+tweet.username+'">'+tweet.username+'</a></h4>'+tweet.content+'</div><div class="timestamp">'+ new Date(tweet.timestamp).toString().substring(0,21)+'</div></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.appendChild(element);
}

var pushNewTweet = function(tweet, divId) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/'+tweet.username+'"><img class="media-object" src="./img/avatar.png"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/'+tweet.username+'">'+tweet.username+'</a></h4>'+tweet.content+'</div><div class="timestamp">'+ new Date(tweet.timestamp).toString().substring(0,21)+'</div></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.insertBefore(element, feedDiv.firstChild);
}
</script>