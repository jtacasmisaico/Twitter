<?
$dir = "widgets/interface/";

$files = scandir($dir);
for($iterator = 2; $iterator < count($files); $iterator++) {
	if(substr($files[$iterator],0,1)!="_") {
		include($dir.$files[$iterator]);
	}
}
?>