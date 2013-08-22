<div id="loggedIn">
    <div id="profileSideBar" style="display:none;">
        <div id="profileImageDiv"></div>
        <div id="editProfileImage">
            <i class="icon-edit" onclick="$('#profileImageForm').toggle('slow')"></i>
            <form id="profileImageForm" action="./widgets/interface/_uploadimage.php" style="display:none;" method="post" enctype="multipart/form-data">
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
                <button id="followersButton" class="btn btn-inverse" style="width:198px;" data-toggle="collapse" data-parent="#sidebarAccordion" data-target="#followersDiv">
                Followers
                </button>
                <div id="followersDiv"  class="collapse">
                    <ul id="followers" class="nav nav-list"><li class="divider"></li></ul>
                </div>

                <button id="followingButton" class="btn btn-inverse" style="width:198px;" data-toggle="collapse" data-parent="#sidebarAccordion" data-target="#followingDiv">
                Following
                </button>
                <div id="followingDiv" class="collapse">
                    <ul id="following" class="nav nav-list"><li class="divider"></li></ul>
                </div>
            </div>
        </div>
        <button id="trendingButton" class="btn btn-info" style="width:198px;">
            Trending
        </button>
        <div id="trendingDiv">
            <ul id="trending" class="nav nav-list"><li class="divider"></li></ul>
        </div>
    </div>
    <form id="tweetForm" style="display:none;" onsubmit="_$.post.tweet()">
            <textarea id="tweetBox" rows="3" style="width:500px;" onkeyup="_$.utils.changeTweetButtonState()" maxlength="140"></textarea>
            <button type="button" style="width:500px;" id="tweetButton" class="btn disabled" disabled onclick="_$.post.tweet()">Tweet</button>
            <div id="characterCount">&nbsp;</div>
    </form>
    <div id="newsFeed" class="feed" style="display:none;">
    </div>
    <div id="userPosts" class="feed" style="display:none;">
    </div>
    <div id="searchResults" class="feed" style="display:none;">
        <div id="searchResultsHeader"></div>
    </div>
</div>