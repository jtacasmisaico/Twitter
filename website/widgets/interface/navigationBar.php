<div id="navBarLoggedOut" style="display:none;position:fixed;" class="navbar navbar-fixed-top">
  <div class="navbar-inner">
    <a class="brand" style="margin-left:0px;" href="#">Twitter</a>
    <ul class="nav" style="float:none; display:inline-block;">
  		<img src="./img/icon.png" style="height:40px"></a></li>
    </ul>
    <ul class="nav pull-right">
      <li><a href="#">Settings</a></li>
    </ul>
  </div>
</div>

<div id="navBarLoggedIn" style="display:none;position:fixed;" class="navbar navbar-fixed-top">
  <div class="navbar-inner">
    <a class="brand" style="margin-left:0px;" href="#">Twitter</a>
    <ul class="nav" style="float:none; display:inline-block;">
  		<li id="navHomeButon" class="active"><a href="#">Home</a></li>
	    <li id="navProfileButon"><a href="#profile">Profile</a></li>
      <li><a href="#about">About</a></li>
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