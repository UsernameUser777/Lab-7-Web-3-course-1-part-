function power(base, exponent) {
    if (exponent === 0) {
        return 1;
    } else {
        return base * power(base, exponent - 1);
    }
}

function calculatePower() {
    const base = parseFloat(document.getElementById('base').value);
    const exponent = parseInt(document.getElementById('exponent').value);
    const result = power(base, exponent);
    document.getElementById('result').innerText = `Результат: ${result}`;
}
