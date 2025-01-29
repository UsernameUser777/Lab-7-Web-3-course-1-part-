<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $selected_style = $_POST['style'];
    setcookie('selected_style', $selected_style, time() + (86400 * 30), "/"); // 86400 = 1 day
    header("Location: index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Select Style</title>
</head>
<body>
    <h1>Select Style</h1>
    <form method="POST" action="setting.php">
        <label>
            <input type="radio" name="style" value="style1.css" required> Style 1
        </label><br>
        <label>
            <input type="radio" name="style" value="style2.css" required> Style 2
        </label><br>
        <label>
            <input type="radio" name="style" value="style3.css" required> Style 3
        </label><br>
        <button type="submit">Save</button>
    </form>
</body>
</html>
