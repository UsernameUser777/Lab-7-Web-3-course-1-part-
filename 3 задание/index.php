<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Галерея фотографий</title>
    <style>
        .gallery {
            display: flex;
            flex-wrap: wrap;
        }
        .gallery img {
            width: 150px;
            height: auto;
            margin: 10px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Галерея фотографий</h1>
    <form action="upload.php" method="post" enctype="multipart/form-data">
        <input type="file" name="image" accept="image/*" required>
        <button type="submit">Загрузить изображение</button>
    </form>
    <div class="gallery">
        <?php
        $images = glob("uploads/thumbs/*.jpg");
        foreach ($images as $image) {
            echo '<a href="uploads/' . basename($image, 'thumb_') . '" target="_blank">';
            echo '<img src="' . $image . '" alt="' . basename($image) . '">';
            echo '</a>';
        }
        ?>
    </div>
</body>
</html>
