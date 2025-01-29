// Задание 7: Вывод городов, начинающихся с буквы «К»
const regions = {
    "Московская область": ["Москва", "Подольск", "Химки"],
    "Ленинградская область": ["Санкт-Петербург", "Всеволожск", "Гатчина"],
    "Свердловская область": ["Екатеринбург", "Нижний Тагил", "Каменск-Уральский"]
};

for (const cities of Object.values(regions)) {
    for (const city of cities) {
        if (city.startsWith('К')) {
            document.getElementById('cities').innerHTML += `${city}<br>`;
        }
    }
}
