
var displayProfile = function(username) {
    removeAndAddFollowButton();
    $('#searchResults').hide();
    $('#newsFeed').hide();
    $('#tweetForm').slideUp('slow');
    $('#newsFeed').slideUp('slow');
    $('#userPosts').slideDown('slow');
    $('#profileSideBar').slideUp('fast', function() {
        $('#editProfileImage').hide();
        fetchUserDetails(username);
    });
    initUpload();
}
var changeTweetButtonState = function() {
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


var setProfileImage = function(image) {
    document.getElementById('profileImageDiv').innerHTML = '<img id="profileImage" src = "' + image + '?lastModified=' + new Date().getTime() + '">';
}

var clearSidebar = function() {
    $('#followers')[0].innerHTML = '<li class="divider"></li>';
    $('#following')[0].innerHTML = '<li class="divider"></li>';
}

var showUnFollowButton = function(alreadyFollowing) {
    console.log("Already Following : " + alreadyFollowing);
    if(alreadyFollowing) {
        $('#followButton')[0].setAttribute('class','btn btn-warning');
        $('#followButton')[0].innerHTML = "Unfollow";
        $('#followButton').click(function() {
            unfollow(parseInt(localStorage.userid), viewingUser.userid);
        });
    }
    else {
        $('#followButton')[0].setAttribute('class','btn btn-success');
        $('#followButton')[0].innerHTML = "Follow";
        $('#followButton').click(function() {
            follow(parseInt(localStorage.userid), viewingUser.userid);
        });                    
    }
    $('#followButton').show(); 
}
var removeAndAddFollowButton = function() {
    $('#followButtonDiv').empty();
    document.getElementById('followButtonDiv').innerHTML = '<button id="followButton" class="btn btn-warning" style="display:none;width:198px;">Unfollow</button>';
}

var initUpload = function() {
    document.getElementById('imageName').value = localStorage.username;
    document.getElementById('profileImageForm').onsubmit = function() {
    document.getElementById('profileImageForm').target = 'target_iframe';
    }
}

var uploadComplete = function(fileName) {
    viewingUser.image = fileName;
    localStorage.user = JSON.stringify(viewingUser);
    setProfileImage(fetchImage(viewingUser));
    changeProfileImage(fileName);
    reRenderFeed(fileName);
}
