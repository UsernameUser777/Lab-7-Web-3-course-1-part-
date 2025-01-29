<?php
$target_dir = "uploads/";
$target_thumb_dir = "uploads/thumbs/";
$target_file = $target_dir . basename($_FILES["image"]["name"]);
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
$max_file_size = 5 * 1024 * 1024; // 5 MB

// Проверка типа файла
$allowed_types = array("jpg", "jpeg", "png", "gif");
if (!in_array($imageFileType, $allowed_types)) {
    die("Извините, только файлы JPG, JPEG, PNG и GIF разрешены.");
}

// Проверка размера файла
if ($_FILES["image"]["size"] > $max_file_size) {
    die("Извините, ваш файл слишком большой.");
}

// Загрузка файла
if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
    // Создание уменьшенной копии
    $thumb_file = $target_thumb_dir . "thumb_" . basename($_FILES["image"]["name"]);
    createThumbnail($target_file, $thumb_file, 150);
    header("Location: index.php");
    exit();
} else {
    die("Извините, возникла ошибка при загрузке вашего файла.");
}

function createThumbnail($src, $dest, $max_width) {
    list($width, $height, $type) = getimagesize($src);
    $image_create_func = [
        IMAGETYPE_JPEG => 'imagecreatefromjpeg',
        IMAGETYPE_PNG => 'imagecreatefrompng',
        IMAGETYPE_GIF => 'imagecreatefromgif'
    ][$type];
    $image_save_func = [
        IMAGETYPE_JPEG => 'imagejpeg',
        IMAGETYPE_PNG => 'imagepng',
        IMAGETYPE_GIF => 'imagegif'
    ][$type];

    $thumb = imagecreatetruecolor($max_width, $max_width * $height / $width);
    $source = $image_create_func($src);
    imagecopyresampled($thumb, $source, 0, 0, 0, 0, $max_width, $max_width * $height / $width, $width, $height);
    $image_save_func($thumb, $dest);
}
?>
