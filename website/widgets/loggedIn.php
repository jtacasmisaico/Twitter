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
        renderFollowers(response.responseJSON);
    });
}

var fetchFeed = function(tweetsFetched) {
    if(tweetsFetched == undefined) {
        if(localStorage.feed!=undefined) { 
            if(document.getElementById('newsFeed').children.length == JSON.parse(localStorage.feed).length)
                return;
            renderFeed(JSON.parse(localStorage.feed)); return; 
        }
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
            localStorage.tweetsFetched = parseInt(localStorage.tweetsFetched) + response.responseJSON.length;
            var existingFeed = JSON.parse(localStorage.feed);
            var newFeed = existingFeed.concat(response.responseJSON);
            localStorage.feed = JSON.stringify(newFeed);
            renderFeed(response.responseJSON)
    });
}


var fetchNewFeed = function() {
    if(localStorage.feed != undefined) {
        var finalTweet = JSON.parse(localStorage.feed)[0].tweetid;
        $.ajax({
            url: serverAddress+"fetch/feed/latest?tweetid="+finalTweet,
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
            var existingFeed = JSON.parse(localStorage.feed);
            var newFeed = response.responseJSON.concat(existingFeed);
            localStorage.feed = JSON.stringify(newFeed);
            pushLatestFeed(response.responseJSON);
        });    
    }
}

var fetchImage = function(tweet) {
    if(tweet.image == null) return "./img/profile/avatar.png";
    return "./img/profile/"+tweet.image;
}

var follow = function(followerid, followedid) {
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

var changeProfileImage = function(image) {
   $.ajax({
        url: serverAddress+"users/image/create",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({ "image":image }),
        headers: {  
            'Content-Type': 'application/json',
            'token':localStorage.sessionid,
            'userid':localStorage.userid
        },
        error: function(jqXHR){
                console.log(jqXHR);
                //logout();
        }
    }).done(function(data, textStatus, response) {      
            $('#profileImageForm').hide('slow', function() {
                //document.location.reload();
            });
    });    
}

var postTweet = function() {
   $.ajax({
        url: serverAddress+"post/tweet",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({ content: document.getElementById('tweetBox').value }),
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

var renderProfileSideBar = function(user, timestamp) {
    if(user.userid == localStorage.userid) {
        $('#editProfileImage').show();
        initUpload();
    }
    document.getElementById('username').innerHTML = "<h4>"+user.name+"</h4>";
    setProfileImage(fetchImage(user));
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

var renderUserPosts = function(tweets) {
    if(tweets.length == 0) document.getElementById('userPosts').innerHTML = '<h4><em>The newb is yet to tweet :/</em></h3>';
    for(var i=0;i<tweets.length;i++) {
        pushTweet(tweets[i],'userPosts');
    }
}

var renderResults = function(tweets) {
    document.getElementById('searchResults').innerHTML = '<h4><em>Showing results for "'+query+'" : </em></h3>';
    if(tweets.length == 0) document.getElementById('searchResults').innerHTML = '<h4><em>You can\'t haz resultz :3</em></h3>';
    for(var i=0;i<tweets.length;i++) {
        pushTweet(tweets[i],'searchResults');
    }
}

var pushTweet = function(tweet, divId) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/'+tweet.username+'"><img class="media-object pthumbnail" src="'+fetchImage(tweet)+'"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/'+tweet.username+'">'+tweet.username+'</a></h4>'+tweet.content+'</div><div class="timestamp">'+ new Date(tweet.timestamp).toString().substring(0,21)+'</div></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.appendChild(element);
}

var pushLatestFeed = function(tweets) {
    for(var i=0;i<tweets.length;i++)
        pushNewTweet(tweets[i], 'newsFeed');
}

var pushNewTweet = function(tweet, divId) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/'+tweet.username+'"><img class="media-object pthumbnail" src="'+fetchImage(tweet)+'"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/'+tweet.username+'">'+tweet.username+'</a></h4>'+tweet.content+'</div><div class="timestamp">'+ new Date(tweet.timestamp).toString().substring(0,21)+'</div></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.insertBefore(element, feedDiv.firstChild);
}

var setProfileImage = function(image) {
    document.getElementById('profileImageDiv').innerHTML = '<img id="profileImage" src = "'+image+'?lastModified='+new Date().getTime()+'">';
}

</script>