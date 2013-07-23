<form id="tweetForm" style="display:none;" onsubmit="postTweet()">
        <textarea id="tweetBox" rows="3" style="width:500px;" onkeyup="changeTweetButtonState()"></textarea>
        <button type="button" style="width:500px;" id="tweetButton" class="btn disabled" disabled onclick="postTweet()">Tweet</button>
</form>
<div id="newsFeed" class="feed" style="display:none;">
</div>