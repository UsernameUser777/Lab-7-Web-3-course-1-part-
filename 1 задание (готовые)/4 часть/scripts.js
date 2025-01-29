let i = 0;
do {
    if (i % 2 === 0) {
        document.getElementById('numbers').innerHTML += `${i} - четное<br>`;
    } else {
        document.getElementById('numbers').innerHTML += `${i} - нечетное<br>`;
    }
    i++;
} while (i <= 10);
