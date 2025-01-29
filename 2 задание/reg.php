<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Логика регистрации пользователя
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Сохранение учетных данных (пример)
    // Здесь можно добавить логику для сохранения данных в базе данных

    $_SESSION['user_id'] = 1; // Установите идентификатор пользователя
    header("Location: index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register</title>
</head>
<body>
    <h1>Register</h1>
    <form method="POST" action="reg.php">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required><br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required><br>
        <button type="submit">Register</button>
    </form>
</body>
</html>
