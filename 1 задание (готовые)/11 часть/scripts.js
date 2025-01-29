function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('fileName').innerText = `Загруженный файл: ${data.fileName}`;
        })
        .catch(error => {
            console.error('Ошибка загрузки файла:', error);
        });
    }
}
