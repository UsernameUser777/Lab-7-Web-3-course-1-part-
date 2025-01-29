<?php
function power($val, $pow) {
    if ($pow == 0) {
        return 1;
    }
    return $val * power($val, $pow - 1);
}

function getCurrentTime() {
    $hours = intval(date('H'));
    $minutes = intval(date('i'));

    $hoursStr = $hours % 100 % 10 === 1 && $hours % 100 !== 11 ? 'час' :
                ($hours % 100 > 1 && $hours % 100 < 5 && ($hours % 100 % 10 !== 11)) ? 'часа' : 'часов';

    $minutesStr = $minutes % 10 === 1 && $minutes !== 11 ? 'минута' :
                  ($minutes % 10 > 1 && $minutes % 10 < 5 && ($minutes !== 11)) ? 'минуты' : 'минут';

    return "$hours $hoursStr $minutes $minutesStr";
}

function transliterate($str) {
    $transliteration = [
        'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'yo',
        'ж' => 'zh', 'з' => 'z', 'и' => 'i', 'й' => 'y', 'к' => 'k', 'л' => 'l', 'м' => 'm',
        'н' => 'n', 'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't', 'у' => 'u',
        'ф' => 'f', 'х' => 'h', 'ц' => 'c', 'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sch', 'ъ' => '',
        'ы' => 'y', 'ь' => '', 'э' => 'e', 'ю' => 'yu', 'я' => 'ya'
    ];

    return strtr($str, $transliteration);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $task = $_POST['task'];
    $result = '';

    switch ($task) {
        case 'power':
            $val = $_POST['val'];
            $pow = $_POST['pow'];
            $result = "Результат: " . power($val, $pow);
            break;
        case 'time':
            $result = getCurrentTime();
            break;
        case 'divisibleByThree':
            $result = "Числа, делящиеся на 3 без остатка:<br>";
            $i = 0;
            while ($i <= 100) {
                if ($i % 3 == 0) {
                    $result .= $i . "<br>";
                }
                $i++;
            }
            break;
        case 'numbers0to10':
            $result = "";
            $i = 0;
            do {
                if ($i == 0) {
                    $result .= $i . " - это ноль<br>";
                } elseif ($i % 2 == 0) {
                    $result .= $i . " - четное число<br>";
                } else {
                    $result .= $i . " - нечетное число<br>";
                }
                $i++;
            } while ($i <= 10);
            break;
        case 'numbers0to9':
            $result = "";
            for ($i = 0; $i <= 9; $i++) {
                $result .= $i . "<br>";
            }
            break;
        case 'cities':
            $regions = [
                'Московская область' => ['Москва', 'Зеленоград', 'Клин'],
                'Ленинградская область' => ['Санкт-Петербург', 'Всеволожск', 'Павловск', 'Кронштадт'],
                'Рязанская область' => ['Рязань', 'Касимов', 'Сасово']
            ];
            foreach ($regions as $region => $cities) {
                $result .= $region . ": " . implode(", ", $cities) . "<br>";
            }
            break;
        case 'citiesWithK':
            $regions = [
                'Московская область' => ['Москва', 'Зеленоград', 'Клин'],
                'Ленинградская область' => ['Санкт-Петербург', 'Всеволожск', 'Павловск', 'Кронштадт'],
                'Рязанская область' => ['Рязань', 'Касимов', 'Сасово']
            ];
            foreach ($regions as $region => $cities) {
                $filteredCities = array_filter($cities, function($city) {
                    return strpos($city, 'К') === 0;
                });
                if (!empty($filteredCities)) {
                    $result .= $region . ": " . implode(", ", $filteredCities) . "<br>";
                }
            }
            break;
        case 'transliterate':
            $str = $_POST['transliterate'];
            $result = str_replace(' ', '_', transliterate($str));
            break;
        case 'calculator':
            $num1 = $_POST['num1'];
            $num2 = $_POST['num2'];
            $operation = $_POST['operation'];
            switch ($operation) {
                case 'add':
                    $result = $num1 + $num2;
                    break;
                case 'subtract':
                    $result = $num1 - $num2;
                    break;
                case 'multiply':
                    $result = $num1 * $num2;
                    break;
                case 'divide':
                    $result = $num1 / $num2;
                    break;
            }
            $result = "Результат: " . $result;
            break;
        case 'upload':
            if (isset($_FILES['file']) && $_FILES['file']['error'] == UPLOAD_ERR_OK) {
                $fileName = $_FILES['file']['name'];
                $result = "Загруженный файл: " . $fileName;
            } else {
                $result = "Ошибка загрузки файла.";
            }
            break;
    }

    header("Location: index.html?result=" . urlencode($result));
    exit();
}
?>
