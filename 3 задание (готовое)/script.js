let currentIndex = 0;
let currentRotation = 0;
let recentImages = [];
let frequentImages = [];
let favoriteImages = [];
let trashImages = [];
let albums = [];
let categories = [];
let slideShowInterval;

// Функция для загрузки изображений
function uploadImages() {
    const fileInput = document.getElementById('file-input');
    const files = fileInput.files;
    const galleryGrid = document.getElementById('gallery-grid');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        const date = new Date();

        reader.onload = function(event) {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('gallery-image-container');
            imgContainer.setAttribute('data-date', date.toISOString().split('T')[0]);
            imgContainer.setAttribute('data-tags', '');
            imgContainer.setAttribute('data-favorite', 'false');
            imgContainer.setAttribute('data-description', '');
            imgContainer.setAttribute('data-comments', '');

            const img = document.createElement('img');
            img.src = event.target.result;
            img.classList.add('gallery-image');
            img.onclick = function() { openModal(this.src); };

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '&times;';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = function() { moveToTrash(imgContainer); };

            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteButton);
            galleryGrid.appendChild(imgContainer);

            saveGalleryState();
        };

        reader.readAsDataURL(file);
    }
}

// Функция для открытия модального окна
function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    modal.style.display = 'block';
    modalImg.src = src;
    currentIndex = getImageIndex(src);
    currentRotation = 0;
    addToRecent(src);
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Функция для удаления изображения
function removeImage(container) {
    container.remove();
    saveGalleryState();
}

// Функция для фильтрации изображений
function filterImages() {
    const filterDate = document.getElementById('filter-date').value;
    const galleryGrid = document.getElementById('gallery-grid');
    const images = galleryGrid.getElementsByClassName('gallery-image-container');

    for (let i = 0; i < images.length; i++) {
        const imageDate = images[i].getAttribute('data-date');
        if (filterDate && imageDate < filterDate) {
            images[i].style.display = 'none';
        } else {
            images[i].style.display = 'inline-block';
        }
    }
}

// Функция для поиска изображений по тегам
function searchImages() {
    const searchTags = document.getElementById('search-tags').value.toLowerCase().split(',');
    const galleryGrid = document.getElementById('gallery-grid');
    const images = galleryGrid.getElementsByClassName('gallery-image-container');

    for (let i = 0; i < images.length; i++) {
        const imageTags = images[i].getAttribute('data-tags').toLowerCase().split(',');
        const match = searchTags.every(tag => imageTags.includes(tag.trim()));
        images[i].style.display = match ? 'inline-block' : 'none';
    }
}

// Функция для сохранения состояния галереи
function saveGalleryState() {
    const galleryGrid = document.getElementById('gallery-grid');
    const images = galleryGrid.getElementsByClassName('gallery-image-container');
    const imageSources = [];

    for (let i = 0; i < images.length; i++) {
        const img = images[i].getElementsByTagName('img')[0];
        const tags = images[i].getAttribute('data-tags');
        const favorite = images[i].getAttribute('data-favorite');
        const description = images[i].getAttribute('data-description');
        const comments = images[i].getAttribute('data-comments');
        imageSources.push({ src: img.src, tags: tags, favorite: favorite, description: description, comments: comments });
    }

    localStorage.setItem('galleryState', JSON.stringify(imageSources));
    localStorage.setItem('recentImages', JSON.stringify(recentImages));
    localStorage.setItem('frequentImages', JSON.stringify(frequentImages));
    localStorage.setItem('favoriteImages', JSON.stringify(favoriteImages));
    localStorage.setItem('trashImages', JSON.stringify(trashImages));
    localStorage.setItem('albums', JSON.stringify(albums));
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Функция для восстановления состояния галереи
function restoreGalleryState() {
    const galleryState = localStorage.getItem('galleryState');
    if (galleryState) {
        const imageSources = JSON.parse(galleryState);
        const galleryGrid = document.getElementById('gallery-grid');

        imageSources.forEach(image => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('gallery-image-container');
            imgContainer.setAttribute('data-tags', image.tags);
            imgContainer.setAttribute('data-favorite', image.favorite);
            imgContainer.setAttribute('data-description', image.description);
            imgContainer.setAttribute('data-comments', image.comments);

            const img = document.createElement('img');
            img.src = image.src;
            img.classList.add('gallery-image');
            img.onclick = function() { openModal(this.src); };

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '&times;';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = function() { moveToTrash(imgContainer); };

            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteButton);
            galleryGrid.appendChild(imgContainer);
        });
    }

    recentImages = JSON.parse(localStorage.getItem('recentImages')) || [];
    frequentImages = JSON.parse(localStorage.getItem('frequentImages')) || [];
    favoriteImages = JSON.parse(localStorage.getItem('favoriteImages')) || [];
    trashImages = JSON.parse(localStorage.getItem('trashImages')) || [];
    albums = JSON.parse(localStorage.getItem('albums')) || [];
    categories = JSON.parse(localStorage.getItem('categories')) || [];

    updateRecentGrid();
    updateFrequentGrid();
    updateFavoritesGrid();
    updateTrashGrid();
    updateAlbumsGrid();
    updateCategoriesGrid();

    const theme = localStorage.getItem('theme') || 'light';
    document.body.className = theme;
    document.getElementById('theme-select').value = theme;
    const imagesPerPage = localStorage.getItem('imagesPerPage') || 20;
    document.getElementById('images-per-page').value = imagesPerPage;
}

// Функция для получения индекса текущего изображения
function getImageIndex(src) {
    const galleryGrid = document.getElementById('gallery-grid');
    const images = galleryGrid.getElementsByClassName('gallery-image-container');
    for (let i = 0; i < images.length; i++) {
        const img = images[i].getElementsByTagName('img')[0];
        if (img.src === src) {
            return i;
        }
    }
    return -1;
}

// Функция для свайпа влево
function swipeLeft() {
    const galleryGrid = document.getElementById('gallery-grid');
    const images = galleryGrid.getElementsByClassName('gallery-image-container');
    if (currentIndex > 0) {
        currentIndex--;
        const img = images[currentIndex].getElementsByTagName('img')[0];
        document.getElementById('modal-image').src = img.src;
    }
}

// Функция для свайпа вправо
function swipeRight() {
    const galleryGrid = document.getElementById('gallery-grid');
    const images = galleryGrid.getElementsByClassName('gallery-image-container');
    if (currentIndex < images.length - 1) {
        currentIndex++;
        const img = images[currentIndex].getElementsByTagName('img')[0];
        document.getElementById('modal-image').src = img.src;
    }
}

// Функция для поворота фото влево
function rotateLeft() {
    const modalImg = document.getElementById('modal-image');
    currentRotation -= 90;
    modalImg.style.transform = `rotate(${currentRotation}deg)`;
}

// Функция для поворота фото вправо
function rotateRight() {
    const modalImg = document.getElementById('modal-image');
    currentRotation += 90;
    modalImg.style.transform = `rotate(${currentRotation}deg)`;
}

// Функция для скачивания фото
function downloadImage() {
    const modalImg = document.getElementById('modal-image');
    const link = document.createElement('a');
    link.href = modalImg.src;
    link.download = 'image.png';
    link.click();
}

// Функция для добавления изображения в недавно просмотренные
function addToRecent(src) {
    if (!recentImages.includes(src)) {
        recentImages.unshift(src);
        if (recentImages.length > 10) {
            recentImages.pop();
        }
        updateRecentGrid();
        saveGalleryState();
    }
}

// Функция для обновления сетки недавно просмотренных изображений
function updateRecentGrid() {
    const recentGrid = document.getElementById('recent-grid');
    recentGrid.innerHTML = '';
    recentImages.forEach(src => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('gallery-image-container');

        const img = document.createElement('img');
        img.src = src;
        img.classList.add('gallery-image');
        img.onclick = function() { openModal(this.src); };

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Удалить';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function() { removeFromRecent(src); };

        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteButton);
        recentGrid.appendChild(imgContainer);
    });
}

// Функция для удаления изображения из недавно просмотренных
function removeFromRecent(src) {
    recentImages = recentImages.filter(imgSrc => imgSrc !== src);
    updateRecentGrid();
    saveGalleryState();
}

// Функция для добавления изображения в часто просмотренные
function addToFrequent(src) {
    if (!frequentImages.includes(src)) {
        frequentImages.unshift(src);
        if (frequentImages.length > 10) {
            frequentImages.pop();
        }
        updateFrequentGrid();
        saveGalleryState();
    }
}

// Функция для обновления сетки часто просмотренных изображений
function updateFrequentGrid() {
    const frequentGrid = document.getElementById('frequent-grid');
    frequentGrid.innerHTML = '';
    frequentImages.forEach(src => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('gallery-image-container');

        const img = document.createElement('img');
        img.src = src;
        img.classList.add('gallery-image');
        img.onclick = function() { openModal(this.src); };

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Удалить';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function() { removeFromFrequent(src); };

        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteButton);
        frequentGrid.appendChild(imgContainer);
    });
}

// Функция для удаления изображения из часто просмотренных
function removeFromFrequent(src) {
    frequentImages = frequentImages.filter(imgSrc => imgSrc !== src);
    updateFrequentGrid();
    saveGalleryState();
}

// Функция для добавления изображения в понравившиеся
function toggleFavorite() {
    const modalImg = document.getElementById('modal-image');
    const src = modalImg.src;
    const galleryGrid = document.getElementById('gallery-grid');
    const images = galleryGrid.getElementsByClassName('gallery-image-container');
    let imgContainer = null;

    for (let i = 0; i < images.length; i++) {
        const img = images[i].getElementsByTagName('img')[0];
        if (img.src === src) {
            imgContainer = images[i];
            break;
        }
    }

    if (imgContainer) {
        const isFavorite = imgContainer.getAttribute('data-favorite') === 'true';
        imgContainer.setAttribute('data-favorite', !isFavorite);

        if (!isFavorite) {
            favoriteImages.push(src);
        } else {
            favoriteImages = favoriteImages.filter(favSrc => favSrc !== src);
        }

        updateFavoritesGrid();
        saveGalleryState();
    }
}

// Функция для обновления сетки понравившихся изображений
function updateFavoritesGrid() {
    const favoritesGrid = document.getElementById('favorites-grid');
    favoritesGrid.innerHTML = '';
    favoriteImages.forEach(src => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('gallery-image-container');

        const img = document.createElement('img');
        img.src = src;
        img.classList.add('gallery-image');
        img.onclick = function() { openModal(this.src); };

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Удалить';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function() { removeFromFavorites(src); };

        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteButton);
        favoritesGrid.appendChild(imgContainer);
    });
}

// Функция для удаления изображения из понравившихся
function removeFromFavorites(src) {
    favoriteImages = favoriteImages.filter(imgSrc => imgSrc !== src);
    updateFavoritesGrid();
    saveGalleryState();
}

// Функция для перемещения изображения в корзину
function moveToTrash(container) {
    const img = container.getElementsByTagName('img')[0];
    const src = img.src;
    trashImages.push(src);
    container.remove();
    updateTrashGrid();
    saveGalleryState();
}

// Функция для обновления сетки корзины
function updateTrashGrid() {
    const trashGrid = document.getElementById('trash-grid');
    trashGrid.innerHTML = '';
    trashImages.forEach(src => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('gallery-image-container');

        const img = document.createElement('img');
        img.src = src;
        img.classList.add('gallery-image');

        const restoreButton = document.createElement('button');
        restoreButton.innerHTML = 'Восстановить';
        restoreButton.classList.add('restore-button');
        restoreButton.onclick = function() { restoreFromTrash(imgContainer); };

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Удалить';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function() { removeFromTrash(src); };

        imgContainer.appendChild(img);
        imgContainer.appendChild(restoreButton);
        imgContainer.appendChild(deleteButton);
        trashGrid.appendChild(imgContainer);
    });
}

// Функция для удаления изображения из корзины
function removeFromTrash(src) {
    trashImages = trashImages.filter(trashSrc => trashSrc !== src);
    updateTrashGrid();
    saveGalleryState();
}

// Функция для восстановления изображения из корзины
function restoreFromTrash(container) {
    const img = container.getElementsByTagName('img')[0];
    const src = img.src;
    const galleryGrid = document.getElementById('gallery-grid');

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('gallery-image-container');
    imgContainer.setAttribute('data-tags', '');
    imgContainer.setAttribute('data-favorite', 'false');

    const newImg = document.createElement('img');
    newImg.src = src;
    newImg.classList.add('gallery-image');
    newImg.onclick = function() { openModal(this.src); };

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times;';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = function() { moveToTrash(imgContainer); };

    imgContainer.appendChild(newImg);
    imgContainer.appendChild(deleteButton);
    galleryGrid.appendChild(imgContainer);

    container.remove();
    trashImages = trashImages.filter(trashSrc => trashSrc !== src);
    updateTrashGrid();
    saveGalleryState();
}

// Функция для очистки корзины
function emptyTrash() {
    trashImages = [];
    updateTrashGrid();
    saveGalleryState();
}

// Функция для удаления текущего изображения
function deleteImage() {
    const modalImg = document.getElementById('modal-image');
    const src = modalImg.src;
    const galleryGrid = document.getElementById('gallery-grid');
    const images = galleryGrid.getElementsByClassName('gallery-image-container');

    for (let i = 0; i < images.length; i++) {
        const img = images[i].getElementsByTagName('img')[0];
        if (img.src === src) {
            moveToTrash(images[i]);
            break;
        }
    }

    closeModal();
}

// Функция для создания альбома
function createAlbum() {
    const albumName = document.getElementById('album-name').value;
    if (albumName) {
        albums.push({ name: albumName, images: [] });
        updateAlbumsGrid();
        saveGalleryState();
    }
}

// Функция для создания категории
function createCategory() {
    const categoryName = document.getElementById('category-name').value;
    if (categoryName) {
        categories.push(categoryName);
        updateCategoriesGrid();
        saveGalleryState();
    }
}

// Функция для обновления сетки альбомов
function updateAlbumsGrid() {
    const albumsGrid = document.getElementById('albums-grid');
    albumsGrid.innerHTML = '';
    albums.forEach(album => {
        const albumContainer = document.createElement('div');
        albumContainer.classList.add('album-container');
        albumContainer.innerHTML = `<h3>${album.name}</h3>`;
        albumsGrid.appendChild(albumContainer);
    });
}

// Функция для обновления сетки категорий
function updateCategoriesGrid() {
    const categoriesGrid = document.getElementById('categories-grid');
    categoriesGrid.innerHTML = '';
    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        categoryContainer.innerHTML = `<h3>${category}</h3>`;
        categoriesGrid.appendChild(categoryContainer);
    });
}

// Функция для сохранения описания
function saveDescription() {
    const description = document.getElementById('image-description').value;
    const modalImg = document.getElementById('modal-image');
    const src = modalImg.src;
    const galleryGrid = document.getElementById('gallery-grid');
    const images = galleryGrid.getElementsByClassName('gallery-image-container');

    for (let i = 0; i < images.length; i++) {
        const img = images[i].getElementsByTagName('img')[0];
        if (img.src === src) {
            images[i].setAttribute('data-description', description);
            saveGalleryState();
            break;
        }
    }
}

// Функция для сохранения комментария
function saveComment() {
    const comment = document.getElementById('image-comments').value;
    const modalImg = document.getElementById('modal-image');
    const src = modalImg.src;
    const galleryGrid = document.getElementById('gallery-grid');
    const images = galleryGrid.getElementsByClassName('gallery-image-container');

    for (let i = 0; i < images.length; i++) {
        const img = images[i].getElementsByTagName('img')[0];
        if (img.src === src) {
            const comments = images[i].getAttribute('data-comments') || '';
            images[i].setAttribute('data-comments', comments + '\n' + comment);
            saveGalleryState();
            break;
        }
    }
}

// Функция для применения фильтров
function applyFilters() {
    const brightness = document.getElementById('brightness-slider').value;
    const contrast = document.getElementById('contrast-slider').value;
    const modalImg = document.getElementById('modal-image');
    modalImg.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
}

// Функция для обрезки изображения
function cropImage() {
    // Implement cropping functionality using a library like Cropper.js
}

// Функция для поделения фото
function shareImage() {
    const modalImg = document.getElementById('modal-image');
    const src = modalImg.src;
    const shareLink = document.createElement('input');
    shareLink.value = src;
    document.body.appendChild(shareLink);
    shareLink.select();
    document.execCommand('copy');
    document.body.removeChild(shareLink);
    alert('Ссылка на фото скопирована в буфер обмена!');
}

// Функция для запуска слайд-шоу
function startSlideShow() {
    slideShowInterval = setInterval(() => {
        swipeRight();
    }, 3000);
}

// Функция для остановки слайд-шоу
function stopSlideShow() {
    clearInterval(slideShowInterval);
}

// Функция для изменения темы
function changeTheme() {
    const theme = document.getElementById('theme-select').value;
    document.body.className = theme;
    localStorage.setItem('theme', theme);
}

// Функция для изменения количества фото на странице
function changeImagesPerPage() {
    const imagesPerPage = document.getElementById('images-per-page').value;
    localStorage.setItem('imagesPerPage', imagesPerPage);
    // Implement logic to update the display of images per page
}

// Функция для расширенного поиска
function advancedSearch() {
    const searchDate = document.getElementById('search-date').value;
    const searchAlbum = document.getElementById('search-album').value.toLowerCase();
    const galleryGrid = document.getElementById('gallery-grid');
    const images = galleryGrid.getElementsByClassName('gallery-image-container');

    for (let i = 0; i < images.length; i++) {
        const imageDate = images[i].getAttribute('data-date');
        const imageAlbum = images[i].getAttribute('data-album') || '';
        const matchDate = !searchDate || imageDate === searchDate;
        const matchAlbum = !searchAlbum || imageAlbum.toLowerCase().includes(searchAlbum);
        images[i].style.display = matchDate && matchAlbum ? 'inline-block' : 'none';
    }
}

// Восстановить состояние галереи при загрузке страницы
window.onload = restoreGalleryState;

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
