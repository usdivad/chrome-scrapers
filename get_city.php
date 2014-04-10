<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

	//$data = $_POST['data'];

	//JSON
	/*
	$json = stripslashes($data);
	$arr = json_decode($json, true);
	var_dump($arr);
	$n = $arr["a"];
	echo $n;
	*/

	//Text
	$file = fopen('./testUrlList.txt', 'r');
	//$reader = fread($file);
	$line = fgets($file);
	echo $line;
	fclose($file);

	exit();
?>