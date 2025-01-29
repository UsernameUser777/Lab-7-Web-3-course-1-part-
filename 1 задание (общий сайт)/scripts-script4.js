// Задание 4: Цикл do...while для вывода чисел от 0 до 10 с указанием четности
let j = 0;
do {
    if (j % 2 === 0) {
        document.getElementById('numbers').innerHTML += `${j} - четное<br>`;
    } else {
        document.getElementById('numbers').innerHTML += `${j} - нечетное<br>`;
    }
    j++;
} while (j <= 10);
