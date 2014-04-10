<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

	$data = $_POST['data'];

	//JSON
	/*
	$json = stripslashes($data);
	$arr = json_decode($json, true);
	var_dump($arr);
	$n = $arr["a"];
	echo $n;
	*/

	//Text
	$file = fopen('./collected_data.txt', 'a');
	fwrite($file, $data); //no .PHP_EOL
	fclose($file);
	echo "hoho\n";
	echo "data is ".$data;


	exit();
?>