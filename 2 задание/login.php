<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Логика авторизации пользователя
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Проверка учетных данных (пример)
    if ($username === 'admin' && $password === 'password') {
        $_SESSION['user_id'] = 1; // Установите идентификатор пользователя
        header("Location: index.php");
        exit();
    } else {
        $error = "Invalid username or password";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
</head>
<body>
    <h1>Login</h1>
    <?php if (isset($error)): ?>
        <p style="color: red;"><?php echo $error; ?></p>
    <?php endif; ?>
    <form method="POST" action="login.php">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required><br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required><br>
        <button type="submit">Login</button>
    </form>
</body>
</html>
