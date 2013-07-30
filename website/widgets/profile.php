<div id="loggedIn">
    <div id="profileSideBar" style="display:none;">
        <div id="profileImageDiv"></div>
        <div id="username"></div>
        <div id="followButtonDiv"></div>
        <div class="accordion" id="sidebarAccordion">
            <div class="accordion-group" style="border:0px;">
                <button class="btn btn-inverse" style="width:198px;" data-toggle="collapse" data-parent="#sidebarAccordion" data-target="#followersDiv">
                Followers
                </button>
                <div id="followersDiv"  class="collapse">
                    <ul id="followers" class="nav nav-list"><li class="divider"></li></ul>
                </div>

                <button class="btn btn-inverse" style="width:198px;" data-toggle="collapse" data-parent="#sidebarAccordion" data-target="#followingDiv">
                Following
                </button>
                <div id="followingDiv" class="collapse">
                    <ul id="following" class="nav nav-list"><li class="divider"></li></ul>
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
    <div id="userPosts" class="feed" style="display:none;">
    </div>
</div>

<script>
$('#followingDiv').scroll(function () {
    var myDiv = $('#followingDiv')[0];
    if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
        fetchFollowing(parseInt(viewingUser.userid));
    }
});
$('#followersDiv').scroll(function () {
    var myDiv = $('#followersDiv')[0];
    if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
        console.log(viewingUser);
        fetchFollowers(parseInt(viewingUser.userid));
    }
});

var clearSidebar = function() {
    $('#followers')[0].innerHTML = '<li class="divider"></li>';
    $('#following')[0].innerHTML = '<li class="divider"></li>';
}

var displayProfile = function(username) {
    console.log("Displaying profile");
    removeAndAddFollowButton();
    $('#newsFeed').hide();
    $('#tweetForm').slideUp('slow');
    $('#newsFeed').slideUp('slow');
    $('#userPosts').slideDown('slow');
    $('#profileSideBar').slideUp('fast', function() {
        getUserDetails(username);
    });
}

var removeAndAddFollowButton = function() {
    $('#followButtonDiv').empty();
    document.getElementById('followButtonDiv').innerHTML = '<button id="followButton" class="btn btn-warning" style="display:none;width:198px;">Unfollow</button>';
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

var getUserDetails = function(username) {
    $.ajax({
        url: serverAddress+"users/"+username,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR){
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
            if(response.responseJSON.userid == localStorage.userid)
                $('#followButton').hide();
            else 
                follows(localStorage.userid, viewingUser.userid);
    });
}


</script>