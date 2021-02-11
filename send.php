<?php
$fam = $_POST['fam'];
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$token = "1645688132:AAGayQrmD81YbUQYupv3Ul7hTZoCvn7QMO0";
$chat_id = "-1001478580538";
$arr = array(
  'Имя пользователя: ' => $name,
  'Фамилия пользователя' => $fam,
  'Телефон: ' => $phone,
  'Email: ' => $email
);

foreach($arr as $key => $value) {
  $txt .= "<b>".$key."</b> ".$value."%0A";
};

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");


if ($sendToTelegram) {
  header('Location: thank-you.html');
} else {
  echo "Ошибка";
}
?>