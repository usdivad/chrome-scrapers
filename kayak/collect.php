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
	//The current one is the one at the end (since last n get_city's will have placed them there)
	$cities_name = './cities_slave.txt';
	$cities = file($cities_name);
	$line = end($cities);
	echo "removed ".$line;
	//this goes in collect.php, not get_city, to prevent dropped lines
	array_pop($cities); //this is a permanent unset, unlike the one in get_city
	file_put_contents($cities_name, $cities);

	//time/log stuff
	$timelog = fopen('./timelog.txt', 'a');
	fwrite($timelog, 'Successful collection of '.rTrim($line)." on ".date(DATE_RFC2822).PHP_EOL);
	fclose($timelog);

	exit();
?>