<?php

session_start();

if ($_POST['code']) {
    $response = '';

    if ($_POST['code'] == $_SESSION['code']) {
        $response = ['status' => 'ok'];
    } else {
        $response = ['status' => 'error'];
    }
    echo json_encode($response);
}