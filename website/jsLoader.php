<?
$dir = "widgets/js/";
$scriptFile = "js/twitter.js";

$loadedModules = array();

$files = scandir($dir);
for($iterator = 2; $iterator < count($files); $iterator++) {
	if(substr($files[$iterator],0,1)!="_") {
		//echo file_get_contents($dir.$files[$iterator]);
        //print "\nMounting ".$files[$iterator]."\n\n";
        loadJSFile($files[$iterator]);
	}
}

//print_r($loadedModules);

$scriptContent = "";

foreach ($loadedModules as &$module) {
    $scriptContent.=file_get_contents($module);
}
file_put_contents($scriptFile, $scriptContent);

function loadJSFile($file) {
    //print "<br>loadJSFile : ".$file."<br>";
    global $dir, $loadedModules;
    $fileToLoad = $dir.$file;
    if(isAnElement($fileToLoad, $loadedModules)) {
        //print "Already exists : ".$fileToLoad;
        return;
    }
    
    $dependency = findDependencies($fileToLoad);
    if(strlen($dependency) > 1) {
        //print "Dependency found : ".$dependency."\n";
        $dependencies = explode(' ', $dependency);
        foreach($dependencies as &$file) {
            loadJSFile(trim($file));
        }
    }
    //else print "No dependency found\n";
    //print("Loading : ".$fileToLoad."\n");
    $loadedModules[] = $fileToLoad;
    //print("Loaded Modules : ");
}

function findDependencies($file) {
    //print "Finding dependencies : ".$file."\n";
    return substr(`head -n1 $file`, 2);
}

function isAnElement($element, $array) {
    foreach($array as &$value) {
        //print "Comparing -> \n".$element."\n".$value."";
        if(trim($value) == trim($element)) return true;
        //else print "Not equal\n";
    }
    return false;
}

?>