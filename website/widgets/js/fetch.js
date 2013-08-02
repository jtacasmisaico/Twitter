var fetchTweets = function(userid, offset) {
    if (offset == undefined) offset = 0;
    $.ajax({
        url: serverAddress + "fetch/posts/" + userid + "?offset=" + offset,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            logout();
        }
    }).done(function(data, textStatus, response) {
        if (offset == 0) document.getElementById('userPosts').innerHTML = "";
        renderUserPosts(response.responseJSON);
        $('#userPosts').show();
    });
}

var fetchFollowing = function(userid, offset, limit) {
    if (offset == undefined) offset = $('#following > li').children().length;
    if (limit == undefined) limit = 5;
    $.ajax({
        url: serverAddress + "users/follows/" + userid + "?offset=" + offset + "&limit=" + limit,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            logout();
        }
    }).done(function(data, textStatus, response) {
        renderFollowing(response.responseJSON);
    });
}

var fetchFollowers = function(userid, offset, limit) {
    if (offset == undefined) offset = $('#followers > li').children().length;
    if (limit == undefined) limit = 5;
    $.ajax({
        url: serverAddress + "users/followers/" + userid + "?offset=" + offset + "&limit=" + limit,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            logout();
        }
    }).done(function(data, textStatus, response) {
        renderFollowers(response.responseJSON);
    });
}

var fetchFeed = function(tweetsFetched) {
    if (tweetsFetched == undefined) {
        if (localStorage.feed != undefined) {
            if (document.getElementById('newsFeed').children.length == JSON.parse(localStorage.feed).length)
                return;
            renderFeed(JSON.parse(localStorage.feed));
            return;
        }
        localStorage.feed = "[]";
        tweetsFetched = 0;
    }
    $.ajax({
        url: serverAddress + "fetch/feed?offset=" + tweetsFetched,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': localStorage.sessionid,
            'userid': localStorage.userid
        },
        error: function(jqXHR) {
            console.log(jqXHR)
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
    if (localStorage.feed != undefined) {
        var finalTweet = JSON.parse(localStorage.feed)[0].tweetid;
        $.ajax({
            url: serverAddress + "fetch/feed/latest?tweetid=" + finalTweet,
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': localStorage.sessionid,
                'userid': localStorage.userid
            },
            error: function(jqXHR) {
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
    if (tweet.image == null) return "./img/profile/avatar.png";
    return "./img/profile/" + tweet.image;
}

var fetchUserDetails = function(username) {
    $.ajax({
        url: serverAddress + "users/" + username,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            logout();
        }
    }).done(function(data, textStatus, response) {
        $('#profileSideBar').slideDown('slow');
        clearSidebar();
        renderProfileSideBar(response.responseJSON);
        fetchFollowers(response.responseJSON.userid);
        fetchFollowing(response.responseJSON.userid);
        fetchTweets(response.responseJSON.userid);
        viewingUser = response.responseJSON;
        if (response.responseJSON.userid == localStorage.userid)
            $('#followButton').hide();
        else
            follows(localStorage.userid, viewingUser.userid);
    });
}

var follows = function(follower, followed) {
    $.ajax({
        url: serverAddress + "users/check/follows/?follower=" + follower + "&followed=" + followed,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            console.log(jqXHR);
            logout();
        }
    }).done(function(data, textStatus, response) {
        if (response.responseText == "true")
            showUnFollowButton(true);
        else showUnFollowButton(false);
    });

}
