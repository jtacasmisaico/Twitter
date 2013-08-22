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


_$.utils.setProfileImage = function(image, reload) {
    if(reload == false) document.getElementById('profileImageDiv').innerHTML = '<img id="profileImage" src = "' + image + '">';
    else document.getElementById('profileImageDiv').innerHTML = '<img id="profileImage" src = "' + image + '?lastModified=' + new Date().getTime() + '">';
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
