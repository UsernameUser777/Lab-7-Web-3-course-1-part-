document.addEventListener('DOMContentLoaded', () => {
    const newsList = document.getElementById('news-list');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');
    const searchInput = document.getElementById('search-input');
    const sortByTitleButton = document.getElementById('sort-by-title');
    const sortByDateButton = document.getElementById('sort-by-date');

    // Функция для сохранения данных в cookies
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Функция для получения данных из cookies
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Функция для сортировки новостей
    function sortNews(criteria) {
        const newsItems = Array.from(newsList.children);
        newsItems.sort((a, b) => {
            if (criteria === 'title') {
                return a.querySelector('.news-title').textContent.localeCompare(b.querySelector('.news-title').textContent);
            } else if (criteria === 'date') {
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            }
        });
        newsList.innerHTML = '';
        newsItems.forEach(item => newsList.appendChild(item));
    }

    // Функция для поиска новостей
    function searchNews() {
        const query = searchInput.value.toLowerCase().split(' ');
        const newsItems = document.querySelectorAll('.news-item');
        newsItems.forEach(item => {
            const title = item.querySelector('.news-title').textContent.toLowerCase();
            const content = item.querySelector('.news-content').textContent.toLowerCase();
            const matches = query.every(word => title.includes(word) || content.includes(word));
            if (matches) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
        setCookie('lastSearch', searchInput.value, 7);
    }

    // Функция для загрузки последнего поиска из cookies
    function loadLastSearch() {
        const lastSearch = getCookie('lastSearch');
        if (lastSearch) {
            searchInput.value = lastSearch;
            searchNews();
            const newsItems = document.querySelectorAll('.news-item:not([style="display: none;"])');
            newsItems.forEach(item => item.style.backgroundColor = '#e0f7fa');
        }
    }

    newsList.addEventListener('click', event => {
        if (event.target.classList.contains('more-info')) {
            const content = event.target.dataset.content;
            modalBody.innerHTML = content;
            modal.style.display = 'flex';
        }
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    searchInput.addEventListener('input', searchNews);

    sortByTitleButton.addEventListener('click', () => sortNews('title'));
    sortByDateButton.addEventListener('click', () => sortNews('date'));

    loadLastSearch();
});

let currentIndex = 0;
let recentFiles = [];
let frequentFiles = [];
let favoriteFiles = [];
let trashFiles = [];
let slideShowInterval;

// Функция для загрузки файлов
function uploadFiles() {
    const fileInput = document.getElementById('file-input');
    const files = fileInput.files;
    const galleryGrid = document.getElementById('gallery-grid');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        const date = new Date();

        reader.onload = function(event) {
            const fileContainer = document.createElement('div');
            fileContainer.classList.add('gallery-file-container');
            fileContainer.setAttribute('data-date', date.toISOString().split('T')[0]);
            fileContainer.setAttribute('data-favorite', 'false');

            const fileName = document.createElement('div');
            fileName.textContent = file.name;
            fileName.classList.add('file-name');
            fileName.onclick = function() { openModal(file.name, event.target.result); };

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '&times;';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = function() { moveToTrash(fileContainer); };

            fileContainer.appendChild(fileName);
            fileContainer.appendChild(deleteButton);
            galleryGrid.appendChild(fileContainer);

            saveGalleryState();
        };

        reader.readAsDataURL(file);
    }
}

// Функция для открытия модального окна
function openModal(fileName, fileData) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    modal.style.display = 'flex';
    modalContent.innerHTML = `<embed src="${fileData}" type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" width="100%" height="600px">`;
    currentIndex = getFileIndex(fileName);
    addToRecent(fileName);
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Функция для удаления файла
function removeFile(container) {
    container.remove();
    saveGalleryState();
}

// Функция для сохранения состояния галереи
function saveGalleryState() {
    const galleryGrid = document.getElementById('gallery-grid');
    const files = galleryGrid.getElementsByClassName('gallery-file-container');
    const fileData = [];

    for (let i = 0; i < files.length; i++) {
        const fileName = files[i].getElementsByClassName('file-name')[0].textContent;
        const favorite = files[i].getAttribute('data-favorite');
        fileData.push({ name: fileName, favorite: favorite });
    }

    localStorage.setItem('galleryState', JSON.stringify(fileData));
    localStorage.setItem('recentFiles', JSON.stringify(recentFiles));
    localStorage.setItem('frequentFiles', JSON.stringify(frequentFiles));
    localStorage.setItem('favoriteFiles', JSON.stringify(favoriteFiles));
    localStorage.setItem('trashFiles', JSON.stringify(trashFiles));
}

// Функция для восстановления состояния галереи
function restoreGalleryState() {
    const galleryState = localStorage.getItem('galleryState');
    if (galleryState) {
        const fileData = JSON.parse(galleryState);
        const galleryGrid = document.getElementById('gallery-grid');

        fileData.forEach(file => {
            const fileContainer = document.createElement('div');
            fileContainer.classList.add('gallery-file-container');
            fileContainer.setAttribute('data-favorite', file.favorite);

            const fileName = document.createElement('div');
            fileName.textContent = file.name;
            fileName.classList.add('file-name');
            fileName.onclick = function() { openModal(file.name, ''); };

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '&times;';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = function() { moveToTrash(fileContainer); };

            fileContainer.appendChild(fileName);
            fileContainer.appendChild(deleteButton);
            galleryGrid.appendChild(fileContainer);
        });
    }

    recentFiles = JSON.parse(localStorage.getItem('recentFiles')) || [];
    frequentFiles = JSON.parse(localStorage.getItem('frequentFiles')) || [];
    favoriteFiles = JSON.parse(localStorage.getItem('favoriteFiles')) || [];
    trashFiles = JSON.parse(localStorage.getItem('trashFiles')) || [];

    updateRecentGrid();
    updateFrequentGrid();
    updateFavoritesGrid();
    updateTrashGrid();

    const theme = localStorage.getItem('selectedTheme');
    if (theme) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = theme;
        document.head.appendChild(link);
    }

    const filesPerPage = localStorage.getItem('filesPerPage') || 20;
    if (document.getElementById('files-per-page')) {
        document.getElementById('files-per-page').value = filesPerPage;
    }
}

// Функция для получения индекса текущего файла
function getFileIndex(fileName) {
    const galleryGrid = document.getElementById('gallery-grid');
    const files = galleryGrid.getElementsByClassName('gallery-file-container');
    for (let i = 0; i < files.length; i++) {
        const file = files[i].getElementsByClassName('file-name')[0];
        if (file.textContent === fileName) {
            return i;
        }
    }
    return -1;
}

// Функция для свайпа влево
function swipeLeft() {
    const galleryGrid = document.getElementById('gallery-grid');
    const files = galleryGrid.getElementsByClassName('gallery-file-container');
    if (currentIndex > 0) {
        currentIndex--;
        const file = files[currentIndex].getElementsByClassName('file-name')[0];
        openModal(file.textContent, '');
    }
}

// Функция для свайпа вправо
function swipeRight() {
    const galleryGrid = document.getElementById('gallery-grid');
    const files = galleryGrid.getElementsByClassName('gallery-file-container');
    if (currentIndex < files.length - 1) {
        currentIndex++;
        const file = files[currentIndex].getElementsByClassName('file-name')[0];
        openModal(file.textContent, '');
    }
}

// Функция для скачивания файла
function downloadFile() {
    const modalContent = document.getElementById('modal-content');
    const link = document.createElement('a');
    link.href = modalContent.getElementsByTagName('embed')[0].src;
    link.download = 'file.xlsx';
    link.click();
}

// Функция для добавления файла в недавно просмотренные
function addToRecent(fileName) {
    if (!recentFiles.includes(fileName)) {
        recentFiles.unshift(fileName);
        if (recentFiles.length > 10) {
            recentFiles.pop();
        }
        updateRecentGrid();
        saveGalleryState();
    }
}

// Функция для обновления сетки недавно просмотренных файлов
function updateRecentGrid() {
    const recentGrid = document.getElementById('recent-grid');
    recentGrid.innerHTML = '';
    recentFiles.forEach(fileName => {
        const fileContainer = document.createElement('div');
        fileContainer.classList.add('gallery-file-container');

        const fileNameElement = document.createElement('div');
        fileNameElement.textContent = fileName;
        fileNameElement.classList.add('file-name');
        fileNameElement.onclick = function() { openModal(fileName, ''); };

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Удалить';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function() { removeFromRecent(fileName); };

        fileContainer.appendChild(fileNameElement);
        fileContainer.appendChild(deleteButton);
        recentGrid.appendChild(fileContainer);
    });
}

// Функция для удаления файла из недавно просмотренных
function removeFromRecent(fileName) {
    recentFiles = recentFiles.filter(file => file !== fileName);
    updateRecentGrid();
    saveGalleryState();
}

// Функция для добавления файла в часто просмотренные
function addToFrequent(fileName) {
    if (!frequentFiles.includes(fileName)) {
        frequentFiles.unshift(fileName);
        if (frequentFiles.length > 10) {
            frequentFiles.pop();
        }
        updateFrequentGrid();
        saveGalleryState();
    }
}

// Функция для обновления сетки часто просмотренных файлов
function updateFrequentGrid() {
    const frequentGrid = document.getElementById('frequent-grid');
    frequentGrid.innerHTML = '';
    frequentFiles.forEach(fileName => {
        const fileContainer = document.createElement('div');
        fileContainer.classList.add('gallery-file-container');

        const fileNameElement = document.createElement('div');
        fileNameElement.textContent = fileName;
        fileNameElement.classList.add('file-name');
        fileNameElement.onclick = function() { openModal(fileName, ''); };

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Удалить';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function() { removeFromFrequent(fileName); };

        fileContainer.appendChild(fileNameElement);
        fileContainer.appendChild(deleteButton);
        frequentGrid.appendChild(fileContainer);
    });
}

// Функция для удаления файла из часто просмотренных
function removeFromFrequent(fileName) {
    frequentFiles = frequentFiles.filter(file => file !== fileName);
    updateFrequentGrid();
    saveGalleryState();
}

// Функция для добавления файла в понравившиеся
function toggleFavorite() {
    const modalContent = document.getElementById('modal-content');
    const fileName = modalContent.getElementsByClassName('file-name')[0].textContent;
    const galleryGrid = document.getElementById('gallery-grid');
    const files = galleryGrid.getElementsByClassName('gallery-file-container');
    let fileContainer = null;

    for (let i = 0; i < files.length; i++) {
        const file = files[i].getElementsByClassName('file-name')[0];
        if (file.textContent === fileName) {
            fileContainer = files[i];
            break;
        }
    }

    if (fileContainer) {
        const isFavorite = fileContainer.getAttribute('data-favorite') === 'true';
        fileContainer.setAttribute('data-favorite', !isFavorite);

        if (!isFavorite) {
            favoriteFiles.push(fileName);
        } else {
            favoriteFiles = favoriteFiles.filter(favFile => favFile !== fileName);
        }

        updateFavoritesGrid();
        saveGalleryState();
    }
}

// Функция для обновления сетки понравившихся файлов
function updateFavoritesGrid() {
    const favoritesGrid = document.getElementById('favorites-grid');
    favoritesGrid.innerHTML = '';
    favoriteFiles.forEach(fileName => {
        const fileContainer = document.createElement('div');
        fileContainer.classList.add('gallery-file-container');

        const fileNameElement = document.createElement('div');
        fileNameElement.textContent = fileName;
        fileNameElement.classList.add('file-name');
        fileNameElement.onclick = function() { openModal(fileName, ''); };

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Удалить';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function() { removeFromFavorites(fileName); };

        fileContainer.appendChild(fileNameElement);
        fileContainer.appendChild(deleteButton);
        favoritesGrid.appendChild(fileContainer);
    });
}

// Функция для удаления файла из понравившихся
function removeFromFavorites(fileName) {
    favoriteFiles = favoriteFiles.filter(file => file !== fileName);
    updateFavoritesGrid();
    saveGalleryState();
}

// Функция для перемещения файла в корзину
function moveToTrash(container) {
    const fileName = container.getElementsByClassName('file-name')[0].textContent;
    trashFiles.push(fileName);
    container.remove();
    updateTrashGrid();
    saveGalleryState();
}

// Функция для обновления сетки корзины
function updateTrashGrid() {
    const trashGrid = document.getElementById('trash-grid');
    trashGrid.innerHTML = '';
    trashFiles.forEach(fileName => {
        const fileContainer = document.createElement('div');
        fileContainer.classList.add('gallery-file-container');

        const fileNameElement = document.createElement('div');
        fileNameElement.textContent = fileName;
        fileNameElement.classList.add('file-name');

        const restoreButton = document.createElement('button');
        restoreButton.innerHTML = 'Восстановить';
        restoreButton.classList.add('restore-button');
        restoreButton.onclick = function() { restoreFromTrash(fileContainer); };

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Удалить';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function() { removeFromTrash(fileName); };

        fileContainer.appendChild(fileNameElement);
        fileContainer.appendChild(restoreButton);
        fileContainer.appendChild(deleteButton);
        trashGrid.appendChild(fileContainer);
    });
}

// Функция для удаления файла из корзины
function removeFromTrash(fileName) {
    trashFiles = trashFiles.filter(file => file !== fileName);
    updateTrashGrid();
    saveGalleryState();
}

// Функция для восстановления файла из корзины
function restoreFromTrash(container) {
    const fileName = container.getElementsByClassName('file-name')[0].textContent;
    const galleryGrid = document.getElementById('gallery-grid');

    const fileContainer = document.createElement('div');
    fileContainer.classList.add('gallery-file-container');
    fileContainer.setAttribute('data-favorite', 'false');

    const fileNameElement = document.createElement('div');
    fileNameElement.textContent = fileName;
    fileNameElement.classList.add('file-name');
    fileNameElement.onclick = function() { openModal(fileName, ''); };

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times;';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = function() { moveToTrash(fileContainer); };

    fileContainer.appendChild(fileNameElement);
    fileContainer.appendChild(deleteButton);
    galleryGrid.appendChild(fileContainer);

    container.remove();
    trashFiles = trashFiles.filter(file => file !== fileName);
    updateTrashGrid();
    saveGalleryState();
}

// Функция для очистки корзины
function emptyTrash() {
    trashFiles = [];
    updateTrashGrid();
    saveGalleryState();
}

// Функция для удаления текущего файла
function deleteFile() {
    const modalContent = document.getElementById('modal-content');
    const fileName = modalContent.getElementsByClassName('file-name')[0].textContent;
    const galleryGrid = document.getElementById('gallery-grid');
    const files = galleryGrid.getElementsByClassName('gallery-file-container');

    for (let i = 0; i < files.length; i++) {
        const file = files[i].getElementsByClassName('file-name')[0];
        if (file.textContent === fileName) {
            moveToTrash(files[i]);
            break;
        }
    }

    closeModal();
}

// Функция для поделения файла
function shareFile() {
    const modalContent = document.getElementById('modal-content');
    const fileName = modalContent.getElementsByClassName('file-name')[0].textContent;
    const shareLink = document.createElement('input');
    shareLink.value = fileName;
    document.body.appendChild(shareLink);
    shareLink.select();
    document.execCommand('copy');
    document.body.removeChild(shareLink);
    alert('Ссылка на файл скопирована в буфер обмена!');
}

// Функция для изменения темы
function changeTheme(theme) {
    localStorage.setItem('selectedTheme', theme);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = theme;
    document.head.appendChild(link);
    window.location.reload();
}

// Функция для изменения количества файлов на странице
function changeFilesPerPage() {
    const filesPerPage = document.getElementById('files-per-page').value;
    localStorage.setItem('filesPerPage', filesPerPage);
    // Implement logic to update the display of files per page
}

// Восстановить состояние галереи при загрузке страницы
window.onload = function() {
    restoreGalleryState();
    updateNewsTitles();
};

// Добавить обработчики событий для свайпа
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        swipeLeft();
    } else if (event.key === 'ArrowRight') {
        swipeRight();
    }
});

// Добавить обработчики событий для свайпа на мобильных устройствах
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            swipeLeft();
        } else {
            swipeRight();
        }
    }

    xDown = null;
    yDown = null;
}

function getTouches(evt) {
    return evt.touches || evt.originalEvent.touches;
}

// Функция для отображения секции
function showSection(sectionId) {
    const sections = document.querySelectorAll('.gallery');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId + '-section').style.display = 'block';
}

// Функция для обновления заголовков новостей
function updateNewsTitles() {
    const newsLinks = document.querySelectorAll('.main-nav a');
    newsLinks.forEach((link, index) => {
        if (link.textContent.includes('Новости')) {
            link.textContent = `Новости №${index + 1}`;
        }
    });
}
