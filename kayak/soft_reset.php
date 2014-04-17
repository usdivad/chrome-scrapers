<?php
	$cities_master = './cities_master.txt';
	$cities_slave = './cities_slave.txt';

	copy($cities_master, $cities_slave);

	echo 'cities reset';
?>