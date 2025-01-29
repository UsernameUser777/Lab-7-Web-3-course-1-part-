<?php
session_start();

// Проверка авторизации пользователя
if (!isset($_SESSION['user_id'])) {
    // Пользователь не авторизован, перенаправление на страницу регистрации или авторизации
    header("Location: login.php");
    exit();
} else {
    // Пользователь авторизован, перенаправление на последнюю посещенную страницу
    if (isset($_SESSION['last_page'])) {
        $last_page = $_SESSION['last_page'];
        header("Location: $last_page");
    } else {
        header("Location: a.php");
    }
    exit();
}
?>
