function getSuffix(number) {
    if (number % 10 === 1 && number % 100 !== 11) {
        return '';
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
        return 'а';
    } else {
        return 'ов';
    }
}

function currentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourSuffix = getSuffix(hours);
    const minuteSuffix = getSuffix(minutes);
    const secondSuffix = getSuffix(seconds);

    document.getElementById('current-time').innerText = `Текущее время: ${hours} час${hourSuffix} ${minutes} минут${minuteSuffix} ${seconds} секунд${secondSuffix}`;
}

setInterval(currentTime, 1000);
