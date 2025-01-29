// Задание 3: Цикл while для вывода чисел, делящихся на 3 без остатка, от 0 до 100
let i = 0;
while (i <= 100) {
    if (i % 3 === 0) {
        document.getElementById('numbers').innerHTML += `${i}<br>`;
    }
    i++;
}
