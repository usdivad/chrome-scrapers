<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');


$screenshot = $_POST["img"];
$label = $_POST["label"];
//echo $_POST["amc"];

$screenshot = str_replace("data:image/jpeg;base64,", "", $screenshot);
$screenshot = str_replace(" ", "+", $screenshot);
$data = base64_decode($screenshot);
$image = imagecreatefromstring($data);
$file = "screenshots/".date(DATE_W3C)."_".$label.".jpg";
//file_put_contents($file, $image);
if ($image !== "false") {
	//header('Content-Type: image/jpeg');
	imagejpeg($image, $file);
	imagedestroy($image);
}
echo $file;
//echo "screenshot data: ";
echo $data.length;

?>