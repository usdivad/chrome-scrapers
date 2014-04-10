<?php
	header('Access-Control-Allow-Origin: *');

	$data = $_POST['data'];
	$file = fopen('./collected_data.txt', 'a');
	fwrite($file, $data.PHP_EOL);
	fclose($file);
	echo "hoho\n";
	echo "data is ".$data;
	//header("Content-Type: text/plain");
	exit();
?>