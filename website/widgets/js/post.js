//boot.js
_$.post.follow = function(followerid, followedid) {
    console.error("following");
    $.ajax({
        url: _$.global.serverAddress + "users/follow",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            follower: followerid,
            followed: followedid
        }),
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.sessionid,
            'userid': localStorage.userid
        },
        error: function(jqXHR) {
            console.log(jqXHR);
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        _$.render.showUnFollowButton(true);
        _$.global.viewingUser.followerCount++;
        _$.render.followersCount(_$.global.viewingUser.followerCount);
        _$.render.push.followers(JSON.parse(localStorage.user));
        //document.location.reload();
    });
    return false;
}

_$.post.unfollow = function(followerid, followedid) {
    console.error("unfollowing");
    $.ajax({
        url: _$.global.serverAddress + "users/unfollow",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            follower: followerid,
            followed: followedid
        }),
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.sessionid,
            'userid': localStorage.userid
        },
        error: function(jqXHR) {
            console.log(jqXHR);
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        _$.render.showUnFollowButton(false);
        _$.global.viewingUser.followerCount--;
        _$.render.followersCount(_$.global.viewingUser.followerCount);
        $('#followerElement'+localStorage.userid).remove();
        $('#followerDivider'+localStorage.userid).remove();
        //document.location.reload();
    });
    return false;
}

_$.post.changeProfileImage = function(image) {
    $.ajax({
        url: _$.global.serverAddress + "users/image/create",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            "image": image
        }),
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.sessionid,
            'userid': localStorage.userid
        },
        error: function(jqXHR) {
            console.log(jqXHR);
            //_$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        $('#profileImageForm').hide('slow', function() {
            //document.location.reload();
        });
    });
}

_$.post.tweet = function() {
    $.ajax({
        url: _$.global.serverAddress + "post/tweet",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            content: document.getElementById('tweetBox').value
        }),
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.sessionid,
            'userid': localStorage.userid
        },
        error: function(jqXHR) {
            console.log(jqXHR);
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        document.getElementById('tweetBox').value = "";
        _$.utils.changeTweetButtonState();
        var pushedTweet = response.responseJSON;
        var existingFeed = JSON.parse(localStorage.feed);
        existingFeed.unshift(response.responseJSON);
        localStorage.feed = JSON.stringify(existingFeed);
        _$.render.push.newTweet(pushedTweet, 'newsFeed');
    });
    return false;
}
