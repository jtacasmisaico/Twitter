<div id="navBarLoggedOut" style="display:none;position:fixed;" class="navbar navbar-fixed-top">
  <div class="navbar-inner">
    <a class="brand" style="margin-left:0px;" href="#">Twitter</a>
    <ul class="nav" style="float:none; display:inline-block;">
  		<img src="./img/icon.png" style="height:40px"></a></li>
    </ul>
    <ul class="nav pull-right">
      <li><a href="#about" role="button" data-toggle="modal">About</a></li>
    </ul>
  </div>
</div>

<div id="navBarLoggedIn" style="display:none;position:fixed;" class="navbar navbar-fixed-top">
  <div class="navbar-inner">
    <a class="brand" style="margin-left:0px;" href="#">Twitter</a>
    <ul class="nav" style="float:none; display:inline-block;">
  		<li id="navHomeButton" class="active"><a href="#">Home</a></li>
	    <li id="navProfileButton"><a href="#profile">Profile</a></li>
      <li><a href="#about" role="button" data-toggle="modal">About</a></li>
    </ul>
    <ul class="nav pull-right">
    	<li class="divider-vertical"></li>
    	<form id="searchBox" onsubmit="return _$.utils.doSearch()" onkeydown="return _$.utils.checkKeySearch(event)" class="navbar-search typeahead-devs">
				<input id="search" type="text" class="search-query span3" placeholder="@username / #tweet" style="height:25px;margin-top:3px;">
					<div class="icon-search icon-white"></div>
		</form>
		<li class="divider-vertical"></li>
      	<li onClick="_$.authentication.logout()"><a href="#">Logout</a></li>
    </ul>
  </div>
</div>
 
<div id="about" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>
    <h3 id="myModalLabel">About</h3>
  </div>
  <div class="modal-body" style="text-align:center">
    <p>I am working on the assumption that no one will ever access this section of the site.</p>
    <img src="img/about.jpg"/>
  </div>
  <div class="modal-footer">
    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
  </div>
</div>