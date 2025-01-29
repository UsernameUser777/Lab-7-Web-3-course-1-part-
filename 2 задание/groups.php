<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $filter_name = $_POST['filter_name'];
}

// Подключение библиотеки для работы с Excel
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$spreadsheet = IOFactory::load('path/to/your/file.xlsx');
$sheetData = $spreadsheet->getActiveSheet()->toArray();

// Фильтрация данных по имени
if (isset($filter_name) && !empty($filter_name)) {
    $sheetData = array_filter($sheetData, function($row) use ($filter_name) {
        return stripos($row[0], $filter_name) !== false;
    });
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Group Members</title>
</head>
<body>
    <h1>Group Members</h1>
    <form method="POST" action="groups.php">
        <label for="filter_name">Filter by Name:</label>
        <input type="text" id="filter_name" name="filter_name">
        <button type="submit">Filter</button>
    </form>
    <table border="1">
        <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Group</th>
        </tr>
        <?php foreach ($sheetData as $row): ?>
            <tr>
                <td><?php echo htmlspecialchars($row[0]); ?></td>
                <td><?php echo htmlspecialchars($row[1]); ?></td>
                <td><?php echo htmlspecialchars($row[2]); ?></td>
            </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>
