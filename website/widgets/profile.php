<div id="loggedIn">
    <div id="profileSideBar" style="display:none;">
        <div id="profileImageDiv"></div>
        <div id="editProfileImage">
            <i class="icon-edit" onclick="$('#profileImageForm').toggle('slow')"></i>
            <form id="profileImageForm" action="./widgets/_uploadimage.php" style="display:none;" method="post" enctype="multipart/form-data">
                <div class="fileupload fileupload-new" data-provides="fileupload">
                    <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;"><img src="./img/noimage.gif" /></div>
                    <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                    <div>
                        <span class="btn btn-file btn-inverse">
                            <span class="fileupload-new">Select Image</span>
                            <span class="fileupload-exists btn-inverse"><i class="icon-edit"></i></span>
                            <input type="file" name="image"/>
                            <input id="imageName" type="hidden" name="imageName"/>
                        </span>
                        <a href="#" class="btn fileupload-exists btn-inverse" data-dismiss="fileupload"><i class="icon-remove"></i></a>
                        <button type="submit" class="fileupload-exists btn btn-inverse" id="uploadImage"><i class="icon-upload"></i></button>
                    </div>
                </div>
                <iframe id="target_iframe" name="target_iframe" src="" style="width:0;height:0;border:0px"></iframe>
            </form>
        </div>
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

var reRenderFeed = function(newImage) {
    var tweets = JSON.parse(localStorage.feed);
    for(var i=0;i<tweets.length;i++)
        if(tweets[i].userid == localStorage.userid)
            tweets[i].image = newImage;
    localStorage.feed = JSON.stringify(tweets);
    document.getElementById('newsFeed').innerHTML = "";
    renderFeed(tweets);
}

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
        $('#editProfileImage').hide();
        getUserDetails(username);
    });
    initUpload();
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