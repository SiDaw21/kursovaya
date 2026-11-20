// Обработка ошибок загрузки ресурсов
window.addEventListener('error', function(e) {
    console.log('Ошибка загрузки:', e.target.src || e.target.href);
});

// Проверяем, загружены ли все скрипты
console.log('script.js загружен успешно');
// Проверка авторизации при загрузке любой страницы
document.addEventListener('DOMContentLoaded', function() {
    // Если пользователь не авторизован и это не страница входа - перенаправляем
    if (!window.location.pathname.includes('login.html')) {
        const currentUser = sessionStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
    }
    
});
// Базовый JavaScript для функциональности портала
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем функции...');
    
    // ПЕРВОЕ ДЕЛО: Загружаем и применяем тему
    initTheme();
    
    // Затем остальные функции
    initProfileNavigation();
    initNotifications();
    initWidgets();
    initNavigationCards();
    addLoadingAnimations();
    updateTime();
    initPageSpecificFunctions();
});

// НОВАЯ ФУНКЦИЯ: Инициализация темы
function initTheme() {
    console.log('Инициализация темы...');
    
    // Загружаем тему из localStorage
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    console.log('Текущая тема из localStorage:', isDarkTheme);
    
    // Применяем тему
    applyTheme(isDarkTheme);
    
    // Слушаем изменения темы из других вкладок
    window.addEventListener('storage', (e) => {
        if (e.key === 'darkTheme') {
            const newTheme = e.newValue === 'true';
            console.log('Тема изменена в другой вкладке:', newTheme);
            applyTheme(newTheme);
        }
    });
}

// Функция применения темы
function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-theme');
        console.log('Применена темная тема');
    } else {
        document.body.classList.remove('dark-theme');
        console.log('Применена светлая тема');
    }
}

// Остальные функции остаются без изменений...
function initProfileNavigation() {
    console.log('Инициализация перехода на профиль...');
    
    let userProfileBtn = document.getElementById('userProfileBtn');
    
    if (!userProfileBtn) {
        userProfileBtn = document.querySelector('.user-profile');
        console.log('Найден элемент по классу:', userProfileBtn);
    }
    
    if (userProfileBtn) {
        console.log('Элемент профиля найден, добавляем обработчик...');
        
        userProfileBtn.replaceWith(userProfileBtn.cloneNode(true));
        userProfileBtn = document.getElementById('userProfileBtn') || document.querySelector('.user-profile');
        
        userProfileBtn.addEventListener('click', function(e) {
            console.log('Клик по профилю!');
            e.preventDefault();
            e.stopPropagation();
            
            const currentPage = window.location.pathname;
            console.log('Текущая страница:', currentPage);
            
            if (currentPage.includes('profile.html')) {
                console.log('Уже на странице профиля');
                return;
            }
            
            console.log('Переходим на profile.html');
            window.location.href = 'profile.html';
        });
        
        userProfileBtn.style.cursor = 'pointer';
        
    } else {
        console.log('Элемент профиля НЕ НАЙДЕН!');
        console.log('Доступные элементы с классом user-profile:', document.querySelectorAll('.user-profile'));
    }
}
// Базовый JavaScript для функциональности портала
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация уведомлений
    initNotifications();
    
    // Инициализация быстрых виджетов
    initWidgets();
    
    // Инициализация навигационных карточек
    initNavigationCards();
    
    // Добавление анимаций при загрузке
    addLoadingAnimations();
    
    // Обновление времени
    updateTime();
    
    // Инициализация перехода на профиль (ДОБАВЛЯЕМ СЮДА)
    initProfileNavigation();
    
    // Инициализация специфичных для страниц функций
    initPageSpecificFunctions();
});

// Функция для работы с уведомлениями
function initNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationBadge = document.querySelector('.notification-badge');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            alert('Здесь будет панель уведомлений');
            if (notificationBadge) {
                notificationBadge.style.display = 'none';
            }
        });
    }
}

// Функция для инициализации интерактивных виджетов
function initWidgets() {
    const widgets = document.querySelectorAll('.widget');
    widgets.forEach(widget => {
        widget.addEventListener('click', function(e) {
            if (e.target.closest('.widget-link')) {
                return;
            }
            const widgetTitle = this.querySelector('.widget-title').textContent;
            console.log(`Открытие полной версии: ${widgetTitle}`);
        });
    });
    
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.querySelector('span').textContent;
            console.log(`Переход к: ${linkText}`);
        });
    });
}

// Функция для инициализации навигационных карточек
function initNavigationCards() {
    const navCards = document.querySelectorAll('.nav-card');
    
    navCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Активный класс теперь управляется сервером через HTML
            const navText = this.querySelector('.nav-text').textContent;
            console.log(`Навигация к: ${navText}`);
        });
    });
}

// Функция для добавления анимаций загрузки
function addLoadingAnimations() {
    const elements = document.querySelectorAll('.widget, .announcement-card, .nav-card, .lesson-card, .subject-card, .category-card, .material-item');
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in');
    });
}

// Функция для обновления времени
function updateTime() {
    const timeElement = document.querySelector('.welcome-subtitle');
    if (timeElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        const dateString = now.toLocaleDateString('ru-RU', options);
        timeElement.textContent = `Сегодня ${dateString}. У вас запланировано 3 пары`;
    }
}

// ФУНКЦИЯ ДЛЯ ПЕРЕХОДА НА ПРОФИЛЬ (ДОБАВЛЯЕМ ЭТУ ФУНКЦИЮ)
function initProfileNavigation() {
    const userProfileBtn = document.getElementById('userProfileBtn');
    
    if (userProfileBtn) {
        console.log('Найден элемент userProfileBtn, добавляем обработчик...');
        
        userProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Проверяем, не находимся ли мы уже на странице профиля
            const currentPage = window.location.pathname;
            if (currentPage.includes('profile.html')) {
                console.log('Уже на странице профиля');
                return;
            }
            
            console.log('Переход на страницу профиля...');
            window.location.href = 'profile.html';
        });
        
        // Также добавляем обработчик для клавиатуры (доступность)
        userProfileBtn.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const currentPage = window.location.pathname;
                if (!currentPage.includes('profile.html')) {
                    window.location.href = 'profile.html';
                }
            }
        });
    } else {
        console.log('Элемент userProfileBtn не найден');
    }
}

function initSchedulePage() {
    console.log('Инициализация страницы расписания...');
    
    // Переключение дней недели
    const dayButtons = document.querySelectorAll('.day-btn');
    console.log('Найдено кнопок дней:', dayButtons.length);
    
    dayButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Клик по дню:', this.querySelector('.day-name').textContent);
            
            // Убираем активный класс у всех кнопок
            dayButtons.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            const day = this.getAttribute('data-day');
            console.log(`Выбран день: ${day}`);
            // Здесь будет загрузка расписания для выбранного дня
        });
    });

    // Навигация по неделям
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    const todayBtn = document.getElementById('todayBtn');
    const currentPeriod = document.getElementById('currentPeriod');

    console.log('Элементы навигации:', {
        prevWeekBtn: !!prevWeekBtn,
        nextWeekBtn: !!nextWeekBtn,
        todayBtn: !!todayBtn,
        currentPeriod: !!currentPeriod
    });

    let currentDate = new Date();

    function updateWeekDisplay() {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Понедельник
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Воскресенье
        
        const options = { day: 'numeric', month: 'long' };
        const startStr = startOfWeek.toLocaleDateString('ru-RU', options);
        const endStr = endOfWeek.toLocaleDateString('ru-RU', options);
        const year = startOfWeek.getFullYear();
        
        currentPeriod.textContent = `Неделя ${startStr} - ${endStr} ${year}`;
        
        // Обновляем даты в кнопках дней
        updateDayButtons(startOfWeek);
    }

    function updateDayButtons(startDate) {
        const dayDates = document.querySelectorAll('.day-date');
        const dayButtons = document.querySelectorAll('.day-btn');
        
        dayButtons.forEach((btn, index) => {
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + index);
            
            const dayStr = dayDate.toLocaleDateString('ru-RU', { 
                day: '2-digit', 
                month: '2-digit' 
            });
            
            dayDates[index].textContent = dayStr;
            
            // Обновляем индикатор "сегодня"
            const today = new Date();
            const isToday = dayDate.toDateString() === today.toDateString();
            
            const indicator = btn.querySelector('.day-indicator');
            if (indicator) {
                if (isToday) {
                    indicator.classList.add('today');
                } else {
                    indicator.classList.remove('today');
                }
            }
        });
    }

    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', function() {
            console.log('Предыдущая неделя');
            currentDate.setDate(currentDate.getDate() - 7);
            updateWeekDisplay();
        });
    }

    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', function() {
            console.log('Следующая неделя');
            currentDate.setDate(currentDate.getDate() + 7);
            updateWeekDisplay();
        });
    }

    if (todayBtn) {
        todayBtn.addEventListener('click', function() {
            console.log('Сегодня');
            currentDate = new Date();
            updateWeekDisplay();
            
            // Активируем сегодняшний день
            dayButtons.forEach(btn => {
                const indicator = btn.querySelector('.day-indicator');
                if (indicator && indicator.classList.contains('today')) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
    }

    // Кнопка "Экспорт"
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            console.log('Экспорт расписания');
            alert('Функция экспорта будет реализована в ближайшее время');
        });
    }

    // Фильтры
    const groupFilter = document.getElementById('groupFilter');
    const teacherFilter = document.getElementById('teacherFilter');

    if (groupFilter) {
        groupFilter.addEventListener('change', function() {
            console.log('Фильтр группы:', this.value);
            applyFilters();
        });
    }

    if (teacherFilter) {
        teacherFilter.addEventListener('change', function() {
            console.log('Фильтр преподавателя:', this.value);
            applyFilters();
        });
    }

    function applyFilters() {
        const group = groupFilter ? groupFilter.value : 'all';
        const teacher = teacherFilter ? teacherFilter.value : 'all';
        console.log('Применение фильтров:', { group, teacher });
        // Здесь будет фильтрация расписания
    }

    // Инициализация при загрузке
    updateWeekDisplay();
    console.log('Страница расписания инициализирована');
}


function initMessagesPage() {
    const conversations = document.querySelectorAll('.conversation');
    const sendBtn = document.querySelector('.send-btn');
    const messageInput = document.querySelector('.message-input');
    
    conversations.forEach(conv => {
        conv.addEventListener('click', function() {
            conversations.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            const userName = this.querySelector('.conversation-name').textContent;
            console.log(`Открыт чат с: ${userName}`);
        });
    });
    
    if (sendBtn && messageInput) {
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            console.log(`Отправлено сообщение: ${message}`);
            messageInput.value = '';
            
            // В реальном приложении здесь будет AJAX запрос
            const chatMessages = document.querySelector('.chat-messages');
            if (chatMessages) {
                const newMessage = document.createElement('div');
                newMessage.className = 'message sent';
                newMessage.innerHTML = `
                    <div class="message-content">
                        <p>${message}</p>
                    </div>
                    <div class="message-time">${new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</div>
                `;
                chatMessages.appendChild(newMessage);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    }
}

function initKnowledgePage() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    const categoryCards = document.querySelectorAll('.category-card');
    const downloadBtns = document.querySelectorAll('.btn-outline');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('.category-name').textContent;
            console.log(`Выбрана категория: ${categoryName}`);
            // Здесь будет фильтрация материалов по категории
        });
    });
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const materialTitle = this.closest('.material-item').querySelector('.material-title').textContent;
            console.log(`Скачивание: ${materialTitle}`);
        });
    });
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            console.log(`Поиск: ${query}`);
            // Здесь будет поиск по материалам
        }
    }
}

// Дополнения к существующему скрипту для главной страницы
function initHomePage() {
    updateDateTime();
    initRefreshButton();
    initFilters();
    initProgressBars();
    initLiveStatus();
}

function updateDateTime() {
    const timeElement = document.querySelector('.welcome-subtitle');
    if (timeElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
        };
        const dateString = now.toLocaleDateString('ru-RU', options);
        timeElement.textContent = `${dateString}`;
    }
}

function initRefreshButton() {
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('refreshing');
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обновление...';
            
            // Имитация обновления данных
            setTimeout(() => {
                this.classList.remove('refreshing');
                this.innerHTML = '<i class="fas fa-check"></i> Обновлено';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить';
                }, 2000);
            }, 1500);
        });
    }
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.textContent.toLowerCase();
            console.log(`Фильтр: ${filter}`);
            // Здесь будет фильтрация контента
        });
    });
}

function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1s ease-in-out';
            bar.style.width = width;
        }, 100);
    });
}

function initLiveStatus() {
    // Обновление статуса "Сейчас" каждую минуту
    setInterval(() => {
        const currentItems = document.querySelectorAll('.schedule-item.current');
        currentItems.forEach(item => {
            const timeElement = item.querySelector('.time');
            const statusElement = item.querySelector('.status');
            
            if (timeElement && statusElement) {
                const timeText = timeElement.textContent;
                const [start, end] = timeText.split(' - ');
                
                const now = new Date();
                const currentTime = now.getHours() * 60 + now.getMinutes();
                
                const [startHour, startMinute] = start.split(':').map(Number);
                const [endHour, endMinute] = end.split(':').map(Number);
                
                const startTime = startHour * 60 + startMinute;
                const endTime = endHour * 60 + endMinute;
                
                if (currentTime >= startTime && currentTime <= endTime) {
                    statusElement.textContent = 'Сейчас';
                    statusElement.className = 'status live';
                } else if (currentTime > endTime) {
                    statusElement.textContent = 'Завершено';
                    statusElement.className = 'status';
                    item.classList.remove('current');
                }
            }
        });
    }, 60000); // Каждую минуту
}

// Система уведомлений
const notificationSystem = {
    notifications: [
        {
            id: 1,
            type: 'deadline',
            title: 'Срок сдачи курсовой работы',
            message: 'Курсовая по строительству должна быть сдана до 27.05.2024',
            time: '10:30',
            date: '25.05.2024',
            read: false,
            urgent: true
        },
        {
            id: 2,
            type: 'grade',
            title: 'Новая оценка',
            message: 'По математике получена оценка 5',
            time: '09:15',
            date: '25.05.2024',
            read: false,
            urgent: false
        },
        {
            id: 3,
            type: 'news',
            title: 'Технический день',
            message: '28 мая занятия отменяются',
            time: '08:45',
            date: '24.05.2024',
            read: false,
            urgent: false
        },
        {
            id: 4,
            type: 'message',
            title: 'Новое сообщение',
            message: 'Преподаватель Иванова А.П. отправил вам сообщение',
            time: 'Вчера',
            date: '24.05.2024',
            read: true,
            urgent: false
        }
    ],

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    },

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
        }
    },

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
    },

    getNotifications() {
        return this.notifications;
    }
};

// Функция для работы с уведомлениями
function initNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationBadge = document.querySelector('.notification-badge');
    
    // Обновляем бейдж
    function updateNotificationBadge() {
        if (notificationBadge) {
            const unreadCount = notificationSystem.getUnreadCount();
            if (unreadCount > 0) {
                notificationBadge.textContent = unreadCount;
                notificationBadge.style.display = 'flex';
            } else {
                notificationBadge.style.display = 'none';
            }
        }
    }
    
    // Создаем панель уведомлений
    function createNotificationPanel() {
        const panel = document.createElement('div');
        panel.className = 'notification-panel';
        panel.innerHTML = `
            <div class="notification-header">
                <h3>Уведомления</h3>
                <div class="notification-actions">
                    <button class="btn-mark-all">Прочитать все</button>
                    <button class="btn-close-panel">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="notification-list">
                ${renderNotificationList()}
            </div>
            <div class="notification-footer">
                <a href="#" class="view-all-link">Все уведомления</a>
            </div>
        `;
        
        document.body.appendChild(panel);
        return panel;
    }
    
    function renderNotificationList() {
        const notifications = notificationSystem.getNotifications();
        return notifications.map(notification => `
            <div class="notification-item ${notification.urgent ? 'urgent' : ''} ${notification.read ? 'read' : ''}" data-id="${notification.id}">
                <div class="notification-icon">
                    <i class="fas ${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <h4 class="notification-title">${notification.title}</h4>
                    <p class="notification-message">${notification.message}</p>
                    <div class="notification-meta">
                        <span class="notification-time">${notification.time}</span>
                        <span class="notification-date">${notification.date}</span>
                    </div>
                </div>
                <div class="notification-actions">
                    ${!notification.read ? '<button class="btn-mark-read" title="Отметить как прочитанное"><i class="fas fa-check"></i></button>' : ''}
                </div>
            </div>
        `).join('');
    }
    
    function getNotificationIcon(type) {
        const icons = {
            'deadline': 'exclamation-circle',
            'grade': 'star',
            'news': 'newspaper',
            'message': 'comment'
        };
        return icons[type] || 'bell';
    }
    
    if (notificationBtn) {
        let notificationPanel = null;
        let isPanelOpen = false;
        
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (!isPanelOpen) {
                // Открываем панель
                notificationPanel = createNotificationPanel();
                isPanelOpen = true;
                
                // Позиционируем панель
                const rect = notificationBtn.getBoundingClientRect();
                notificationPanel.style.top = (rect.bottom + 10) + 'px';
                notificationPanel.style.right = (window.innerWidth - rect.right) + 'px';
                
                // Анимация появления
                setTimeout(() => {
                    notificationPanel.classList.add('active');
                }, 10);
                
                // Обработчики для панели
                initNotificationPanelEvents(notificationPanel);
                
            } else {
                // Закрываем панель
                closeNotificationPanel();
            }
        });
        
        function closeNotificationPanel() {
            if (notificationPanel) {
                notificationPanel.classList.remove('active');
                setTimeout(() => {
                    if (notificationPanel.parentNode) {
                        notificationPanel.parentNode.removeChild(notificationPanel);
                    }
                    notificationPanel = null;
                    isPanelOpen = false;
                }, 300);
            }
        }
        
        function initNotificationPanelEvents(panel) {
            // Кнопка закрытия
            const closeBtn = panel.querySelector('.btn-close-panel');
            closeBtn.addEventListener('click', closeNotificationPanel);
            
            // Кнопка "Прочитать все"
            const markAllBtn = panel.querySelector('.btn-mark-all');
            markAllBtn.addEventListener('click', function() {
                notificationSystem.markAllAsRead();
                updateNotificationBadge();
                panel.querySelector('.notification-list').innerHTML = renderNotificationList();
                initNotificationItemsEvents(panel);
            });
            
            // Обработчики для отдельных уведомлений
            initNotificationItemsEvents(panel);
            
            // Закрытие при клике вне панели
            document.addEventListener('click', function outsideClickHandler(e) {
                if (!panel.contains(e.target) && e.target !== notificationBtn) {
                    closeNotificationPanel();
                    document.removeEventListener('click', outsideClickHandler);
                }
            });
        }
        
        function initNotificationItemsEvents(panel) {
            const notificationItems = panel.querySelectorAll('.notification-item');
            notificationItems.forEach(item => {
                const markReadBtn = item.querySelector('.btn-mark-read');
                if (markReadBtn) {
                    markReadBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const notificationId = parseInt(item.dataset.id);
                        notificationSystem.markAsRead(notificationId);
                        item.classList.add('read');
                        markReadBtn.remove();
                        updateNotificationBadge();
                    });
                }
                
                // Клик на уведомление
                item.addEventListener('click', function() {
                    const notificationId = parseInt(item.dataset.id);
                    const notification = notificationSystem.notifications.find(n => n.id === notificationId);
                    
                    if (notification && !notification.read) {
                        notificationSystem.markAsRead(notificationId);
                        item.classList.add('read');
                        const markReadBtn = item.querySelector('.btn-mark-read');
                        if (markReadBtn) markReadBtn.remove();
                        updateNotificationBadge();
                    }
                    
                    // Действие при клике на уведомление
                    handleNotificationClick(notification);
                });
            });
        }
        
        function handleNotificationClick(notification) {
            if (!notification) return;
            
            switch (notification.type) {
                case 'deadline':
                    window.location.href = 'journal.html';
                    break;
                case 'grade':
                    window.location.href = 'journal.html';
                    break;
                case 'news':
                    // Прокрутка к новостям на главной
                    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                        document.querySelector('.widget-news').scrollIntoView({ behavior: 'smooth' });
                    } else {
                        window.location.href = 'index.html';
                    }
                    break;
                case 'message':
                    window.location.href = 'messages.html';
                    break;
            }
            
            closeNotificationPanel();
        }
        
        // Инициализируем бейдж
        updateNotificationBadge();
    }
}

// Дополнительные утилитарные функции
function showLoading() {
    console.log('Загрузка...');
}

function hideLoading() {
    console.log('Загрузка завершена');
}

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
});
// Базовый JavaScript для функциональности портала
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем функции...');
    
    // СНАЧАЛА инициализируем переход на профиль
    initProfileNavigation();
    
    // Затем остальные функции
    initNotifications();
    initWidgets();
    initNavigationCards();
    addLoadingAnimations();
    updateTime();
    initPageSpecificFunctions();
});

// ФУНКЦИЯ ДЛЯ ПЕРЕХОДА НА ПРОФИЛЬ - ПЕРВОЙ ДЕЛАЕМ ЕЕ
function initProfileNavigation() {
    console.log('Инициализация перехода на профиль...');
    
    // Несколько способов найти элемент
    let userProfileBtn = document.getElementById('userProfileBtn');
    
    // Если не нашли по ID, ищем по классу
    if (!userProfileBtn) {
        userProfileBtn = document.querySelector('.user-profile');
        console.log('Найден элемент по классу:', userProfileBtn);
    }
    
    if (userProfileBtn) {
        console.log('Элемент профиля найден, добавляем обработчик...');
        
        // Удаляем старые обработчики чтобы избежать дублирования
        userProfileBtn.replaceWith(userProfileBtn.cloneNode(true));
        userProfileBtn = document.getElementById('userProfileBtn') || document.querySelector('.user-profile');
        
        userProfileBtn.addEventListener('click', function(e) {
            console.log('Клик по профилю!');
            e.preventDefault();
            e.stopPropagation();
            
            // Проверяем текущую страницу
            const currentPage = window.location.pathname;
            console.log('Текущая страница:', currentPage);
            
            if (currentPage.includes('profile.html')) {
                console.log('Уже на странице профиля');
                return;
            }
            
            console.log('Переходим на profile.html');
            window.location.href = 'profile.html';
        });
        
        // Добавляем курсор pointer для интерактивности
        userProfileBtn.style.cursor = 'pointer';
        
    } else {
        console.log('Элемент профиля НЕ НАЙДЕН!');
        console.log('Доступные элементы с классом user-profile:', document.querySelectorAll('.user-profile'));
    }
}

// ОСТАЛЬНЫЕ ФУНКЦИИ ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ
function initNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationBadge = document.querySelector('.notification-badge');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            alert('Здесь будет панель уведомлений');
            if (notificationBadge) {
                notificationBadge.style.display = 'none';
            }
        });
    }
}

function initWidgets() {
    const widgets = document.querySelectorAll('.widget');
    widgets.forEach(widget => {
        widget.addEventListener('click', function(e) {
            if (e.target.closest('.widget-link')) {
                return;
            }
            const widgetTitle = this.querySelector('.widget-title').textContent;
            console.log(`Открытие полной версии: ${widgetTitle}`);
        });
    });
    
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.querySelector('span').textContent;
            console.log(`Переход к: ${linkText}`);
        });
    });
}

function initNavigationCards() {
    const navCards = document.querySelectorAll('.nav-card');
    
    navCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const navText = this.querySelector('.nav-text').textContent;
            console.log(`Навигация к: ${navText}`);
        });
    });
}

function addLoadingAnimations() {
    const elements = document.querySelectorAll('.widget, .announcement-card, .nav-card, .lesson-card, .subject-card, .category-card, .material-item');
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in');
    });
}

function updateTime() {
    const timeElement = document.querySelector('.welcome-subtitle');
    if (timeElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        const dateString = now.toLocaleDateString('ru-RU', options);
        timeElement.textContent = `Сегодня ${dateString}. У вас запланировано 3 пары`;
    }
}

function initPageSpecificFunctions() {
    if (document.querySelector('.schedule-controls')) {
        initSchedulePage();
    }
    
    if (document.querySelector('.messages-container')) {
        initMessagesPage();
    }
    
    if (document.querySelector('.search-container')) {
        initKnowledgePage();
    }
    
    if (document.querySelector('.welcome-stats')) {
        initHomePage();
    }
}

function initSchedulePage() {
    const dayButtons = document.querySelectorAll('.week-selector .btn');
    dayButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            dayButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const day = this.textContent.trim();
            console.log(`Выбран день: ${day}`);
        });
    });
}

function initMessagesPage() {
    const conversations = document.querySelectorAll('.conversation');
    const sendBtn = document.querySelector('.send-btn');
    const messageInput = document.querySelector('.message-input');
    
    conversations.forEach(conv => {
        conv.addEventListener('click', function() {
            conversations.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            const userName = this.querySelector('.conversation-name').textContent;
            console.log(`Открыт чат с: ${userName}`);
        });
    });
    
    if (sendBtn && messageInput) {
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            console.log(`Отправлено сообщение: ${message}`);
            messageInput.value = '';
            
            const chatMessages = document.querySelector('.chat-messages');
            if (chatMessages) {
                const newMessage = document.createElement('div');
                newMessage.className = 'message sent';
                newMessage.innerHTML = `
                    <div class="message-content">
                        <p>${message}</p>
                    </div>
                    <div class="message-time">${new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</div>
                `;
                chatMessages.appendChild(newMessage);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    }
}

function initKnowledgePage() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    const categoryCards = document.querySelectorAll('.category-card');
    const downloadBtns = document.querySelectorAll('.btn-outline');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('.category-name').textContent;
            console.log(`Выбрана категория: ${categoryName}`);
        });
    });
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const materialTitle = this.closest('.material-item').querySelector('.material-title').textContent;
            console.log(`Скачивание: ${materialTitle}`);
        });
    });
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            console.log(`Поиск: ${query}`);
        }
    }
}

function initHomePage() {
    updateDateTime();
    initRefreshButton();
    initFilters();
    initProgressBars();
    initLiveStatus();
}

function updateDateTime() {
    const timeElement = document.querySelector('.welcome-subtitle');
    if (timeElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
        };
        const dateString = now.toLocaleDateString('ru-RU', options);
        timeElement.textContent = `${dateString}`;
    }
}

function initRefreshButton() {
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('refreshing');
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обновление...';
            
            setTimeout(() => {
                this.classList.remove('refreshing');
                this.innerHTML = '<i class="fas fa-check"></i> Обновлено';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить';
                }, 2000);
            }, 1500);
        });
    }
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.textContent.toLowerCase();
            console.log(`Фильтр: ${filter}`);
        });
    });
}

function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1s ease-in-out';
            bar.style.width = width;
        }, 100);
    });
}

function initLiveStatus() {
    setInterval(() => {
        const currentItems = document.querySelectorAll('.schedule-item.current');
        currentItems.forEach(item => {
            const timeElement = item.querySelector('.time');
            const statusElement = item.querySelector('.status');
            
            if (timeElement && statusElement) {
                const timeText = timeElement.textContent;
                const [start, end] = timeText.split(' - ');
                
                const now = new Date();
                const currentTime = now.getHours() * 60 + now.getMinutes();
                
                const [startHour, startMinute] = start.split(':').map(Number);
                const [endHour, endMinute] = end.split(':').map(Number);
                
                const startTime = startHour * 60 + startMinute;
                const endTime = endHour * 60 + endMinute;
                
                if (currentTime >= startTime && currentTime <= endTime) {
                    statusElement.textContent = 'Сейчас';
                    statusElement.className = 'status live';
                } else if (currentTime > endTime) {
                    statusElement.textContent = 'Завершено';
                    statusElement.className = 'status';
                    item.classList.remove('current');
                }
            }
        });
    }, 60000);
}

// Дополнительные утилитарные функции
function showLoading() {
    console.log('Загрузка...');
}

function hideLoading() {
    console.log('Загрузка завершена');
}

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
});
// Функции для действий с парами
function openMaterials(lessonId) {
    console.log('Открытие материалов для пары:', lessonId);
    alert(`Материалы для пары ${lessonId} будут открыты`);
}

function openAssignments(lessonId) {
    console.log('Открытие заданий для пары:', lessonId);
    alert(`Задания для пары ${lessonId} будут открыты`);
}

function messageTeacher(teacherName) {
    console.log('Сообщение преподавателю:', teacherName);
    alert(`Открытие чата с ${teacherName}`);
}

function addNote(lessonId) {
    console.log('Добавление заметки для пары:', lessonId);
    const modal = document.getElementById('noteModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function viewHomework(lessonId) {
    console.log('Просмотр домашнего задания для пары:', lessonId);
    alert(`Домашнее задание для пары ${lessonId}`);
}

function prepareForLesson(lessonId) {
    console.log('Подготовка к паре:', lessonId);
    alert(`Подготовка к паре ${lessonId}`);
}

function setReminder(lessonId) {
    console.log('Установка напоминания для пары:', lessonId);
    alert(`Напоминание для пары ${lessonId}`);
}

function openLabWork(lessonId) {
    console.log('Открытие лабораторной работы для пары:', lessonId);
    alert(`Лабораторная работа для пары ${lessonId}`);
}

function markAttendance(lessonId) {
    console.log('Отметка посещения для пары:', lessonId);
    alert(`Отметка посещения для пары ${lessonId}`);
}

// Функции для быстрых действий
function viewWeeklySchedule() {
    console.log('Просмотр расписания на всю неделю');
    alert('Открытие расписания на всю неделю');
}

function syncWithCalendar() {
    console.log('Синхронизация с календарем');
    alert('Синхронизация с календарем');
}

function setPersonalSchedule() {
    console.log('Настройка личного расписания');
    alert('Настройка личного расписания');
}

function openScheduleSettings() {
    console.log('Открытие настроек расписания');
    alert('Открытие настроек расписания');
}

// Функции для модального окна
function closeModal() {
    const modal = document.getElementById('noteModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function saveNote() {
    console.log('Сохранение заметки');
    const textarea = document.querySelector('#noteModal textarea');
    if (textarea) {
        console.log('Текст заметки:', textarea.value);
    }
    closeModal();
    alert('Заметка сохранена');
}

// Закрытие модального окна при клике на крестик
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Закрытие модального окна при клике вне его
    const modal = document.getElementById('noteModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});