<?PHP
################################################################################
#### ChiavistelloAPI - example.php
#### vim: tabstop=4:shiftwidth=4
################################################################################
require_once("chiavistello-api.class.php");
$apiKey="xxxxxxxxxxxxxxxxxxxxxxx";

$cvl=new ChiavistelloAPI($apiKey);
$r=$cvl->info();
// $r=$cvl->switchList();
// $r=$cvl->partitionList();
// $cvl->roomPartitionMap(101,1);
// $r=$cvl->bookingList();
$data=array(
	"name" => "API test partition",
	"checkIn" => "2021-09-01 12:00",
	"checkOut" => "2021-09-03 12:00",
	"documentRequest" => 2,
	"AKSFFER3423"=>"",
	"partition" => $cvl->room2partition(101)
);
// $r=$cvl->bookingSet($data);
// $r=$cvl->bookingGet(0,'AKSFFER3423');
// $r=$cvl->bookingDelete(28524);
// $r=$cvl->guestList();
// $r=$cvl->paymentList();
// $r=$cvl->paymentGet(1351);
$data=array(
	"amount" => 100,
	"purpose" => "Soggiorno"
);
// $r=$cvl->paymentSet($data);
// $r=$cvl->paymentDelete(1590);
if($cvl->errno) {
	echo "Errore: $cvl->error\n";
} else {
	print_r($r);
}

