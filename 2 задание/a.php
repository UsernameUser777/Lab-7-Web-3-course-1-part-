<?php
session_start();

// Сохранение последней посещенной страницы
$_SESSION['last_page'] = 'a.php'; // или 'b.php' для файла b.php

// Ваш код для страницы a.php или b.php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Page A</title>
</head>
<body>
    <h1>Welcome to Page A</h1>
    <!-- Ваш контент для страницы A -->
</body>
</html>
