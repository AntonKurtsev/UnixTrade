<?php

session_start();

$phone = preg_replace("/[^0-9]/", '', $_POST['phone']);;
$code = mt_rand(1000, 9999);

$ucallerApi = [
    'serviceId' => 833579,
    'secretKey' => 'C2jmdug7Uusxzgl4J5n7Pkf99yvDVzue'
];

$requestData = [
    'service_id' => $ucallerApi['serviceId'],
    'key' => $ucallerApi['secretKey'],
    'phone' => $phone,
    'code' => $code
];

$request = file_get_contents('https://api.ucaller.ru/v1.0/initCall?' . http_build_query($requestData));

$response = json_decode($request, true);

if ($response['status'] == true) {
    $_SESSION['code'] = $code;
}