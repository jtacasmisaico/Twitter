<?php
error_reporting(E_ALL);
  $file_id='image';
  $temp = explode(".", $_FILES["image"]["name"]);
  $extension = end($temp);
  $filename=$_POST['imageName'].'.'.$extension;
  $tmpfile=$_FILES[$file_id]['tmp_name'];
  if(!$_FILES[$file_id]['name']) {
        echo "<font color=\'red\'>no file specified</font>";
        return;
  }
  if(move_uploaded_file($tmpfile, "/var/www/twitter/img/profile/".$filename)){
    $status='Success';
  }else{
    $status='<font color=\'red\'>Failed</font>';
  }
  echo returnStatus($filename);

function returnStatus($filename){
  return "<html><body><script type='text/javascript'>function initPhoto(){if(top._$.utils.uploadComplete) top._$.utils.uploadComplete('".$filename."');}window.onload=initPhoto;</script></body></html>";
}

?>
