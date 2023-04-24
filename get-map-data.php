<?php

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
		$data='[{"sl": 1,"type": "Gas station","name": "bp","latitude": 40.68154295,"longitude": -73.90318024,"address": "1610 Bushwick Ave, Brooklyn, NY 11207, United States","phone": 17184558053,"icon_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOtmca89KWeHflXgnctKgEBuwOU0YGL2xz-w&usqp=CAU"}]';
	$dataRes["success"]=true;
	$dataRes["data"]=json_decode($data);
	echo json_encode($dataRes);
}
