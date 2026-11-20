// Функциональность для базы знаний
class KnowledgeBase {
    constructor() {
        this.materials = [
            {
                id: 1,
                title: 'Лекция по математическому анализу',
                description: 'Полный курс лекций по теме "Дифференциальные уравнения" с примерами и решениями',
                subject: 'math',
                type: 'lecture',
                fileType: 'pdf',
                fileSize: '2.4 MB',
                pages: 48,
                downloads: 124,
                rating: 4.8,
                date: '2024-05-24',
                isNew: true,
                isFeatured: true,
                isFavorite: false,
                tags: ['математика', 'лекции', 'дифференциальные уравнения'],
                content: 'Это полная версия лекции...'
            },
            {
                id: 2,
                title: 'Видеоурок по механике',
                description: 'Практическое занятие по решению задач по механике с разбором типичных ошибок',
                subject: 'physics',
                type: 'video',
                fileType: 'mp4',
                fileSize: '156 MB',
                duration: '45 минут',
                downloads: 89,
                rating: 4.6,
                date: '2024-05-23',
                isNew: false,
                isFeatured: true,
                isFavorite: false,
                tags: ['физика', 'видео', 'механика'],
                content: 'Видеоурок по решению задач...'
            },
            {
                id: 3,
                title: 'Лабораторная работа №5',
                description: 'Работа с базами данных: создание запросов, нормализация, оптимизация',
                subject: 'it',
                type: 'lab',
                fileType: 'zip',
                fileSize: '3.2 MB',
                downloads: 156,
                rating: 4.9,
                date: '2024-05-22',
                isNew: false,
                isFeatured: true,
                isFavorite: true,
                tags: ['информатика', 'лабораторная', 'базы данных'],
                content: 'Задание и примеры кода...'
            },
            {
                id: 4,
                title: 'Учебник по строительной механике',
                description: 'Основы строительной механики для начинающих',
                subject: 'construction',
                type: 'book',
                fileType: 'pdf',
                fileSize: '15.7 MB',
                pages: 320,
                downloads: 203,
                rating: 4.7,
                date: '2024-05-20',
                isNew: false,
                isFeatured: false,
                isFavorite: false,
                tags: ['строительство', 'учебник', 'механика']
            }
        ];

        this.favorites = [3];
        this.downloaded = [1, 2, 3, 4];
        this.recent = [1, 2, 3];
        this.currentView = 'grid';
        this.currentPage = 1;
        this.itemsPerPage = 8;
        this.currentPreviewMaterial = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderMaterials();
        this.setupSearch();
        this.setupCarousel();
    }

    setupEventListeners() {
        // Поиск
        document.getElementById('searchButton').addEventListener('click', () => this.performSearch());
        document.getElementById('knowledgeSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Фильтры
        document.getElementById('typeFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('subjectFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('sortFilter').addEventListener('change', () => this.applyFilters());

        // Быстрый доступ
        document.getElementById('refreshRecommendations').addEventListener('click', () => this.refreshRecommendations());
        document.getElementById('viewAllCategories').addEventListener('click', () => this.viewAllCategories());

        // Переключение вида
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleView(e.currentTarget.dataset.view));
        });

        // Загрузка еще
        document.getElementById('loadMoreBtn').addEventListener('click', () => this.loadMore());

        // Модальные окна
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('knowledgeSearch');
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 500);
        });
    }

    setupCarousel() {
        const track = document.querySelector('.carousel-track');
        const cards = document.querySelectorAll('.material-card');
        const cardWidth = cards[0].offsetWidth + 20; // width + gap

        this.carouselState = {
            track,
            position: 0,
            maxPosition: (cards.length - 3) * cardWidth // Показываем 3 карточки
        };
    }

    performSearch(query = null) {
        const searchTerm = query || document.getElementById('knowledgeSearch').value.toLowerCase();
        
        if (searchTerm.trim() === '') {
            this.renderMaterials();
            return;
        }

        const filtered = this.materials.filter(material => 
            material.title.toLowerCase().includes(searchTerm) ||
            material.description.toLowerCase().includes(searchTerm) ||
            material.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );

        this.renderMaterials(filtered);
        this.showNotification(`Найдено материалов: ${filtered.length}`, 'info');
    }

    applyFilters() {
        const typeFilter = document.getElementById('typeFilter').value;
        const subjectFilter = document.getElementById('subjectFilter').value;
        const sortFilter = document.getElementById('sortFilter').value;

        let filtered = [...this.materials];

        // Фильтрация по типу
        if (typeFilter !== 'all') {
            filtered = filtered.filter(material => material.type === typeFilter);
        }

        // Фильтрация по предмету
        if (subjectFilter !== 'all') {
            filtered = filtered.filter(material => material.subject === subjectFilter);
        }

        // Сортировка
        switch (sortFilter) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'popular':
                filtered.sort((a, b) => b.downloads - a.downloads);
                break;
            case 'name':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        this.renderMaterials(filtered);
    }

    renderMaterials(materials = null) {
        const container = document.getElementById('materialsContainer');
        const data = materials || this.materials;
        
        // Сбрасываем пагинацию при новом рендере
        this.currentPage = 1;
        
        const paginatedData = data.slice(0, this.itemsPerPage);
        
        container.innerHTML = paginatedData.map(material => this.createMaterialCard(material)).join('');
        
        // Показываем/скрываем кнопку "Загрузить еще"
        this.toggleLoadMoreButton(data.length > this.itemsPerPage);
    }

    createMaterialCard(material) {
        const isFavorite = this.favorites.includes(material.id);
        const isDownloaded = this.downloaded.includes(material.id);
        
        return `
            <div class="material-card ${material.isNew ? 'new' : ''} ${this.currentView === 'list' ? 'list-view' : ''}" data-id="${material.id}">
                ${material.isNew ? '<div class="material-badge">Новое</div>' : ''}
                <div class="material-header">
                    <div class="material-type ${material.fileType}">
                        <i class="fas fa-${this.getFileTypeIcon(material.fileType)}"></i>
                    </div>
                    <div class="material-meta">
                        <span class="material-subject">${this.getSubjectName(material.subject)}</span>
                        <span class="material-date">${new Date(material.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                </div>
                <div class="material-content">
                    <h3 class="material-title">${material.title}</h3>
                    <p class="material-description">${material.description}</p>
                    <div class="material-info">
                        ${this.getMaterialInfo(material)}
                    </div>
                    ${material.tags ? `
                    <div class="material-tags">
                        ${material.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    ` : ''}
                </div>
                <div class="material-actions">
                    <button class="btn-icon" title="Предпросмотр" onclick="previewMaterial(${material.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon ${isFavorite ? 'active' : ''}" title="В избранное" onclick="toggleMaterialFavorite(${material.id})">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-star"></i>
                    </button>
                    ${isDownloaded ? `
                    <span class="downloaded-badge" title="Уже скачано">
                        <i class="fas fa-check"></i>
                    </span>
                    ` : ''}
                    <button class="btn btn-primary btn-sm" onclick="${material.fileType === 'mp4' ? 'watchVideo' : 'downloadMaterial'}(${material.id})">
                        <i class="fas fa-${material.fileType === 'mp4' ? 'play' : 'download'}"></i>
                        ${material.fileType === 'mp4' ? 'Смотреть' : 'Скачать'}
                    </button>
                </div>
            </div>
        `;
    }

    getFileTypeIcon(fileType) {
        const icons = {
            'pdf': 'file-pdf',
            'mp4': 'video',
            'zip': 'file-archive',
            'doc': 'file-word',
            'ppt': 'file-powerpoint'
        };
        return icons[fileType] || 'file';
    }

    getSubjectName(subject) {
        const subjects = {
            'math': 'Математика',
            'physics': 'Физика',
            'it': 'Информатика',
            'construction': 'Строительство'
        };
        return subjects[subject] || subject;
    }

    getMaterialInfo(material) {
        let info = '';
        
        if (material.pages) {
            info += `<span class="info-item"><i class="fas fa-file-alt"></i>${material.pages} страниц</span>`;
        }
        if (material.duration) {
            info += `<span class="info-item"><i class="fas fa-clock"></i>${material.duration}</span>`;
        }
        if (material.fileSize) {
            info += `<span class="info-item"><i class="fas fa-weight-hanging"></i>${material.fileSize}</span>`;
        }
        
        info += `<span class="info-item"><i class="fas fa-download"></i>${material.downloads}</span>`;
        info += `<span class="info-item"><i class="fas fa-star"></i>${material.rating}</span>`;
        
        return info;
    }

    toggleView(view) {
        this.currentView = view;
        
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.view-btn[data-view="${view}"]`).classList.add('active');
        
        const container = document.getElementById('materialsContainer');
        container.className = `materials-container ${view}-view`;
        
        // Перерисовываем материалы с новым видом
        this.renderMaterials();
    }

    loadMore() {
        this.currentPage++;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        
        const container = document.getElementById('materialsContainer');
        const additionalMaterials = this.materials.slice(startIndex, endIndex)
            .map(material => this.createMaterialCard(material))
            .join('');
        
        container.innerHTML += additionalMaterials;
        
        // Проверяем, есть ли еще материалы для загрузки
        this.toggleLoadMoreButton(endIndex < this.materials.length);
    }

    toggleLoadMoreButton(show) {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.style.display = show ? 'block' : 'none';
    }

    scrollCarousel(direction) {
        if (!this.carouselState) return;
        
        const { track, position, maxPosition } = this.carouselState;
        const newPosition = position + (direction * 320); // Шаг прокрутки
        
        if (newPosition <= 0 && newPosition >= -maxPosition) {
            this.carouselState.position = newPosition;
            track.style.transform = `translateX(${newPosition}px)`;
        }
    }

    refreshRecommendations() {
        const btn = document.getElementById('refreshRecommendations');
        const originalHtml = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обновление...';
        btn.disabled = true;
        
        // Имитация обновления рекомендаций
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
            this.showNotification('Рекомендации обновлены!', 'success');
        }, 1500);
    }

    viewAllCategories() {
        alert('Просмотр всех категорий материалов');
        // Можно реализовать расширенный просмотр категорий
    }

    // Методы для работы с материалами
    previewMaterial(materialId) {
        const material = this.materials.find(m => m.id === materialId);
        if (!material) return;
        
        this.currentPreviewMaterial = material;
        
        const modal = document.getElementById('previewModal');
        const content = document.getElementById('previewContent');
        
        content.innerHTML = `
            <div class="preview-header">
                <h4>${material.title}</h4>
                <div class="preview-meta">
                    <span>${this.getSubjectName(material.subject)} • ${new Date(material.date).toLocaleDateString('ru-RU')}</span>
                </div>
            </div>
            <div class="preview-body">
                <p>${material.description}</p>
                ${material.content ? `<div class="preview-text">${material.content}</div>` : ''}
                <div class="preview-stats">
                    <div class="stat">Размер: ${material.fileSize}</div>
                    <div class="stat">Скачиваний: ${material.downloads}</div>
                    <div class="stat">Рейтинг: ${material.rating}/5</div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }

    downloadMaterial(materialId) {
        const material = this.materials.find(m => m.id === materialId);
        if (!material) return;
        
        // Имитация скачивания
        this.showNotification(`Начинается скачивание: ${material.title}`, 'info');
        
        // Добавляем в список скачанных
        if (!this.downloaded.includes(materialId)) {
            this.downloaded.push(materialId);
        }
        
        // Увеличиваем счетчик скачиваний
        material.downloads++;
        
        setTimeout(() => {
            this.showNotification(`${material.title} успешно скачан!`, 'success');
        }, 2000);
    }

    toggleMaterialFavorite(materialId) {
        const index = this.favorites.indexOf(materialId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showNotification('Убрано из избранного', 'info');
        } else {
            this.favorites.push(materialId);
            this.showNotification('Добавлено в избранное', 'success');
        }
        
        // Обновляем отображение
        this.renderMaterials();
    }

    showRecentMaterials() {
        const recentMaterials = this.materials.filter(m => this.recent.includes(m.id));
        this.renderMaterials(recentMaterials);
        this.showNotification('Показаны недавние материалы', 'info');
    }

    showFavorites() {
        const favoriteMaterials = this.materials.filter(m => this.favorites.includes(m.id));
        this.renderMaterials(favoriteMaterials);
        this.showNotification('Показаны избранные материалы', 'info');
    }

    showDownloaded() {
        const downloadedMaterials = this.materials.filter(m => this.downloaded.includes(m.id));
        this.renderMaterials(downloadedMaterials);
        this.showNotification('Показаны скачанные материалы', 'info');
    }

    uploadMaterial() {
        document.getElementById('uploadModal').classList.add('active');
    }

    submitUpload() {
        const form = document.getElementById('uploadForm');
        if (!form.checkValidity()) {
            this.showNotification('Заполните все обязательные поля', 'error');
            return;
        }
        
        // Имитация загрузки
        this.showNotification('Материал загружается...', 'info');
        
        setTimeout(() => {
            this.closeModal();
            this.showNotification('Материал успешно загружен!', 'success');
            form.reset();
        }, 2000);
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Глобальные функции
function showCategory(category) {
    const knowledgeBase = new KnowledgeBase();
    const categoryMaterials = knowledgeBase.materials.filter(m => m.subject === category);
    knowledgeBase.renderMaterials(categoryMaterials);
    knowledgeBase.showNotification(`Показаны материалы по: ${knowledgeBase.getSubjectName(category)}`, 'info');
}

function toggleFavorite(category) {
    alert(`Добавление категории "${category}" в избранное`);
    // Реализация добавления категории в избранное
}

function previewMaterial(materialId) {
    const knowledgeBase = new KnowledgeBase();
    knowledgeBase.previewMaterial(materialId);
}

function toggleMaterialFavorite(materialId) {
    const knowledgeBase = new KnowledgeBase();
    knowledgeBase.toggleMaterialFavorite(materialId);
}

function downloadMaterial(materialId) {
    const knowledgeBase = new KnowledgeBase();
    knowledgeBase.downloadMaterial(materialId);
}

function watchVideo(materialId) {
    alert(`Воспроизведение видео материала ID: ${materialId}`);
    // Реализация воспроизведения видео
}

function uploadMaterial() {
    const knowledgeBase = new KnowledgeBase();
    knowledgeBase.uploadMaterial();
}

function submitUpload() {
    const knowledgeBase = new KnowledgeBase();
    knowledgeBase.submitUpload();
}

function closeModal() {
    const knowledgeBase = new KnowledgeBase();
    knowledgeBase.closeModal();
}

function scrollCarousel(direction) {
    const knowledgeBase = new KnowledgeBase();
    knowledgeBase.scrollCarousel(direction);
}

function downloadCurrentMaterial() {
    const knowledgeBase = new KnowledgeBase();
    if (knowledgeBase.currentPreviewMaterial) {
        knowledgeBase.downloadMaterial(knowledgeBase.currentPreviewMaterial.id);
        knowledgeBase.closeModal();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new KnowledgeBase();
});