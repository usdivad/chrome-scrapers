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
	$file = fopen('./kayak_data.csv', 'a');
	fwrite($file, $data); //no .PHP_EOL
	fclose($file);
	echo "hoho\n";
	echo "data is ".$data;

	//Remove the current city (cos we've already collected the data)
	$cities_name = './cities_slave.txt';
	$cities = file($cities_name);
	$line = $cities[0];
	echo "removed ".$line;
	unset($cities[0]);
	file_put_contents($cities_name, $cities);

	exit();
?>