<?php
	$cities_master = './cities_master.txt';
	$cities_slave = './cities_slave.txt';
	$timelog = './timelog.txt';
	$kayak_data = './kayak_data.csv';
	$kayak_data_template = './kayak_data_template.csv';

	copy($cities_master, $cities_slave);
	file_put_contents($timelog, '**Hard reset on '.date(DATE_RFC2822).PHP_EOL);
	copy($kayak_data_template, $kayak_data);

	echo 'files reset';
?>