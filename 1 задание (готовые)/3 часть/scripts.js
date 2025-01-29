let i = 0;
while (i <= 100) {
    if (i % 3 === 0) {
        document.getElementById('numbers').innerHTML += `${i}<br>`;
    }
    i++;
}
