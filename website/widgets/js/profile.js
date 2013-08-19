//boot.js
_$.utils.changeTweetButtonState = function() {
    document.getElementById("characterCount").innerHTML = (140-document.getElementById("tweetBox").value.length) + " characters left";
    if (document.getElementById("tweetBox").value.length > 0) {
        document.getElementById("tweetButton").removeAttribute('disabled');
        document.getElementById("tweetButton").setAttribute('class', 'btn btn-info');
    } else {
        document.getElementById("characterCount").innerHTML = '&nbsp;';
        document.getElementById("tweetButton").setAttribute('disabled');
        document.getElementById("tweetButton").setAttribute('class', 'btn disabled');
    }
}


 _$.utils.setProfileImage = function(image) {
    document.getElementById('profileImageDiv').innerHTML = '<img id="profileImage" src = "' + image + '?lastModified=' + new Date().getTime() + '">';
}

_$.render.clearSidebar = function() {
    $('#followers')[0].innerHTML = '<li class="divider"></li>';
    $('#following')[0].innerHTML = '<li class="divider"></li>';
}

_$.render.clearUserPosts = function() {
    $('#userPosts')[0].innerHTML = '';
}

_$.render.showUnFollowButton = function(alreadyFollowing) {
    if(alreadyFollowing) {
        $('#followButton')[0].setAttribute('class','btn btn-warning');
        $('#followButton')[0].innerHTML = "Unfollow";
        $('#followButton').click(function() {
            _$.post.unfollow(parseInt(localStorage.userid), _$.global.viewingUser.userid);
        });
    }
    else {
        $('#followButton')[0].setAttribute('class','btn btn-success');
        $('#followButton')[0].innerHTML = "Follow";
        $('#followButton').click(function() {
            _$.post.follow(parseInt(localStorage.userid), _$.global.viewingUser.userid);
        });                    
    }
    $('#followButton').show(); 
}
_$.render.removeAndAddFollowButton = function() {
    $('#followButtonDiv').empty();
    document.getElementById('followButtonDiv').innerHTML = '<button id="followButton" class="btn btn-warning" style="display:none;width:198px;">Unfollow</button>';
}

_$.utils.initUpload = function() {
    document.getElementById('imageName').value = localStorage.username;
    document.getElementById('profileImageForm').onsubmit = function() {
    document.getElementById('profileImageForm').target = 'target_iframe';
    }
}

_$.utils.uploadComplete = function(fileName) {
    _$.global.viewingUser.image = fileName;
    localStorage.user = JSON.stringify(_$.global.viewingUser);
    _$.utils.setProfileImage(_$.fetch.image(_$.global.viewingUser));
    _$.post.changeProfileImage(fileName);
    _$.render.againFeed(fileName);
}
