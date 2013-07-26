<div id="loggedIn">
    <div id="profileSideBar" style="display:none;">
        <div id="username"></div>
        <button id="followButton" class="btn btn-warning" style="display:none;width:198px;">Unfollow</button>
        <div class="accordion" id="sidebarAccordion">
            <div class="accordion-group" style="border:0px;">
                <button id="ownTweetsButton" class="btn btn-inverse" style="width:198px;" data-toggle="collapse" data-parent="#sidebarAccordion" data-target="#ownTweets">
                Tweets
                </button>
                <div id="ownTweets" class="collapse in">
                    <ul id="tweetsFromSelf" class="nav nav-list">
                        <li class="divider"></li>
                    </ul>
                </div>

                <button class="btn btn-inverse" style="width:198px;" data-toggle="collapse" data-parent="#sidebarAccordion" data-target="#followersDiv">
                Followers
                </button>
                <div id="followersDiv" class="collapse">
                    <ul id="followers" class="nav nav-list"></ul>
                </div>

                <button class="btn btn-inverse" style="width:198px;" data-toggle="collapse" data-parent="#sidebarAccordion" data-target="#followingDiv">
                Following
                </button>
                <div id="followingDiv" class="collapse">
                    <ul id="following" class="nav nav-list"></ul>
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
var displayProfile = function(username) {
    console.log("Displaying profile");
    $('#ownTweetsButton').hide();
    $('#ownTweets').hide();
    $('#newsFeed').hide();
    $('#tweetForm').slideUp('slow');
    $('#newsFeed').slideUp('slow');
    $('#userPosts').slideDown('slow');
    $('#profileSideBar').slideUp('fast', function() {
        getUserDetails(username);
    });
}

showUnFollowButton = function(alreadyFollowing) {
    if(alreadyFollowing) {
        $('#followButton')[0].setAttribute('class','btn btn-warning');
        $('#followButton')[0].innerHTML = "Unfollow";
        $('#followButton').click(function() {
            unfollow();
        });
    }
    else {
        $('#followButton')[0].setAttribute('class','btn btn-success');
        $('#followButton')[0].innerHTML = "Follow";
    }
    $('#followButton').show(); 
}

var getUserDetails = function(username) {
    $.ajax({
        url: "http://localhost:8080/users/"+username,
        type: 'GET',
        error: function(jqXHR){
            logout();
        }
    }).done(function(data, textStatus, response) {
            $('#profileSideBar').slideDown('slow');
            renderProfileSideBar(response.responseJSON.name);
            fetchFollowers(response.responseJSON.userid);
            fetchFollowing(response.responseJSON.userid);
            fetchTweets(response.responseJSON.userid);

            showUnFollowButton = function(alreadyFollowing) {
                if(alreadyFollowing) {
                    $('#followButton')[0].setAttribute('class','btn btn-warning');
                    $('#followButton')[0].innerHTML = "Unfollow";
                    $('#followButton').click(function() {
                        //alert('Hey');
                        unfollow(parseInt(localStorage.userid), response.responseJSON.userid);
                    });
                }
                else {
                    $('#followButton')[0].setAttribute('class','btn btn-success');
                    $('#followButton')[0].innerHTML = "Follow";
                    $('#followButton').click(function() {
                        //alert('Hey');
                        follow(parseInt(localStorage.userid), response.responseJSON.userid);
                    });                    
                }
                $('#followButton').show(); 
            }
    });
}


</script>