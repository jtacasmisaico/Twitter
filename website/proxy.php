<?php
    $curl = curl_init();
    curl_setopt ($curl, CURLOPT_URL, "http://localhost:8080/users/followers/4");
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec ($curl);
    curl_close ($curl);
    print $result;
?>