// profile.js - Функциональность страницы профиля
class ProfileManager {
    constructor() {
        // ПРОВЕРКА АВТОРИЗАЦИИ
        const currentUser = sessionStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        this.currentTab = 'personal';
        this.userData = this.loadUserData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTabs();
        this.setupCharts();
        this.setupThemeSwitch();
        this.setupThemeSync();
    }

    loadUserData() {
        const savedData = localStorage.getItem('userProfileData');
        if (savedData) {
            return JSON.parse(savedData);
        }

        return {
            personal: {
                firstName: "Иван",
                lastName: "Петров",
                middleName: "Сергеевич",
                birthDate: "2003-03-15",
                gender: "male",
                citizenship: "Российская Федерация",
                email: "ivan.petrov@ktssa.ru",
                phone: "+79001234567",
                address: "г. Каменск-Шахтинский, ул. Ленина, д. 123, кв. 45",
                about: "Увлекаюсь программированием и робототехникой. Участвую в олимпиадах по математике."
            },
            academic: {
                group: "С-21",
                specialty: "Строительство и эксплуатация зданий и сооружений",
                course: 2,
                educationForm: "Очная",
                status: "active",
                admissionDate: "2022-09-01",
                averageGrade: 4.8,
                attendance: 87,
                subjects: [
                    { name: "Математика", teacher: "Иванова А.П.", grade: 4.9, icon: "fa-calculator" },
                    { name: "Физика", teacher: "Петров С.И.", grade: 4.7, icon: "fa-atom" },
                    { name: "Информатика", teacher: "Сидоров В.К.", grade: 5.0, icon: "fa-laptop-code" }
                ]
            },
            settings: {
                emailNotifications: true,
                pushNotifications: true,
                smsNotifications: false,
                gradeNotifications: true,
                darkTheme: false,
                compactMode: false,
                language: "ru"
            },
            security: {
                lastPasswordChange: "3 месяца назад",
                twoFactorAuth: false,
                activeSessions: 2
            }
        };
    }

    setupEventListeners() {
        const userProfileBtn = document.getElementById('userProfileBtn');
        if (userProfileBtn && window.location.href.includes('profile.html')) {
            userProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Вы уже на странице профиля', 'info');
            });
        }

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.action-btn').textContent.trim();
                this.handleQuickAction(action);
            });
        });

        document.querySelectorAll('.switch input').forEach(switchEl => {
            switchEl.addEventListener('change', (e) => {
                this.handleSettingChange(e.target);
            });
        });

        const languageSelect = document.querySelector('.form-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.profile-tab');
        const panes = document.querySelectorAll('.tab-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                // Удаляем активный класс у всех вкладок и панелей
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));
                
                // Добавляем активный класс текущей вкладке и панели
                tab.classList.add('active');
                const targetPane = document.getElementById(`${tabName}-tab`);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
                
                this.currentTab = tabName;
                console.log('Переключено на вкладку:', tabName);
            });
        });
    }

    setupCharts() {
        const circles = document.querySelectorAll('.chart-circle');
        circles.forEach(circle => {
            const percent = circle.dataset.percent;
            this.animateCircle(circle, percent);
        });
    }

    animateCircle(circle, percent) {
        circle.style.background = `conic-gradient(var(--primary-red) 0% ${percent}%, rgba(255, 255, 255, 0.1) ${percent}% 100%)`;
    }

    setupThemeSwitch() {
        const themeSwitch = document.getElementById('darkThemeSwitch');
        if (themeSwitch) {
            const currentTheme = localStorage.getItem('darkTheme') === 'true';
            themeSwitch.checked = currentTheme;
            this.applyTheme(currentTheme);
            
            themeSwitch.addEventListener('change', (e) => {
                this.toggleTheme(e.target.checked);
            });
        }
    }

    setupThemeSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'darkTheme') {
                const newTheme = e.newValue === 'true';
                console.log('Тема изменена в другой вкладке:', newTheme);
                this.applyTheme(newTheme);
                
                const themeSwitch = document.getElementById('darkThemeSwitch');
                if (themeSwitch) {
                    themeSwitch.checked = newTheme;
                }
            }
        });
    }

    toggleTheme(isDark) {
        console.log('Переключение темы:', isDark);
        localStorage.setItem('darkTheme', isDark);
        this.userData.settings.darkTheme = isDark;
        this.saveUserData();
        this.applyTheme(isDark);
        this.showNotification(isDark ? 'Темная тема включена' : 'Светлая тема включена', 'success');
        this.triggerStorageEvent('darkTheme', isDark.toString());
    }

    applyTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
            this.applyDarkThemeToElements();
        } else {
            document.body.classList.remove('dark-theme');
            this.applyLightThemeToElements();
        }
    }

    applyDarkThemeToElements() {
        const elements = document.querySelectorAll('.profile-card, .profile-actions, .contact-card, .profile-content, .widget, .announcement-card');
        elements.forEach(el => {
            el.classList.add('dark-theme-element');
        });
    }

    applyLightThemeToElements() {
        const elements = document.querySelectorAll('.profile-card, .profile-actions, .contact-card, .profile-content, .widget, .announcement-card');
        elements.forEach(el => {
            el.classList.remove('dark-theme-element');
        });
    }

    triggerStorageEvent(key, value) {
        try {
            const event = new StorageEvent('storage', {
                key: key,
                newValue: value,
                oldValue: localStorage.getItem(key),
                url: window.location.href,
                storageArea: localStorage
            });
            window.dispatchEvent(event);
        } catch (e) {
            console.log('Не удалось создать событие storage:', e);
        }
    }

    handleQuickAction(action) {
        switch(action) {
            case 'Редактировать профиль':
                this.editProfile();
                break;
            case 'Сменить пароль':
                this.changePassword();
                break;
            case 'Скачать данные':
                this.downloadData();
                break;
            case 'Мои достижения':
                this.showAchievements();
                break;
        }
    }

    editProfile() {
        document.getElementById('editProfileModal').classList.add('active');
        this.populateEditForm();
    }

    populateEditForm() {
        const form = document.getElementById('editProfileForm');
        const data = this.userData.personal;
        
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'text' && input.value === "Петров") input.value = data.lastName;
            if (input.type === 'text' && input.value === "Иван") input.value = data.firstName;
            if (input.type === 'text' && input.value === "Сергеевич") input.value = data.middleName;
            if (input.type === 'date') input.value = data.birthDate;
            if (input.type === 'email') input.value = data.email;
            if (input.type === 'tel') input.value = data.phone;
            if (input.tagName === 'TEXTAREA' && !input.placeholder) input.value = data.about;
        });
    }

    saveProfile() {
        const form = document.getElementById('editProfileForm');
        const formData = new FormData(form);
        
        this.userData.personal = {
            ...this.userData.personal,
            lastName: form.querySelector('input[value="Петров"]')?.value || this.userData.personal.lastName,
            firstName: form.querySelector('input[value="Иван"]')?.value || this.userData.personal.firstName,
            middleName: form.querySelector('input[value="Сергеевич"]')?.value || this.userData.personal.middleName,
            email: form.querySelector('input[type="email"]')?.value || this.userData.personal.email,
            phone: form.querySelector('input[type="tel"]')?.value || this.userData.personal.phone,
            about: form.querySelector('textarea')?.value || this.userData.personal.about
        };

        this.saveUserData();
        this.closeModal(document.getElementById('editProfileModal'));
        this.showNotification('Профиль успешно обновлен', 'success');
        this.updateProfileDisplay();
    }

    changePassword() {
        document.getElementById('changePasswordModal').classList.add('active');
        
        const newPasswordInput = document.querySelector('#passwordForm input[type="password"]:nth-of-type(2)');
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        const strengthLevels = ['Слабый', 'Средний', 'Хороший', 'Отличный'];
        const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];
        
        strengthBar.style.width = `${(strength / 4) * 100}%`;
        strengthBar.style.background = colors[strength] || '#EF4444';
        strengthText.textContent = strengthLevels[strength] || 'Слабый';
    }

    updatePassword() {
        const form = document.getElementById('passwordForm');
        const inputs = form.querySelectorAll('input[type="password"]');
        
        const currentPassword = inputs[0]?.value;
        const newPassword = inputs[1]?.value;
        const confirmPassword = inputs[2]?.value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showNotification('Пароли не совпадают', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            this.showNotification('Пароль должен содержать минимум 8 символов', 'error');
            return;
        }
        
        this.userData.security.lastPasswordChange = 'только что';
        this.saveUserData();
        
        this.closeModal(document.getElementById('changePasswordModal'));
        this.showNotification('Пароль успешно изменен', 'success');
        form.reset();
    }

    downloadData() {
        const dataStr = JSON.stringify(this.userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Данные успешно скачаны', 'success');
    }

    showAchievements() {
        this.showNotification('Функция "Мои достижения" в разработке', 'info');
    }

    handleSettingChange(setting) {
        console.log('Переключатель изменен:', setting);
        
        const settingName = this.getSettingName(setting);
        const value = setting.checked;
        
        console.log('Настройка:', settingName, 'Значение:', value);
        
        this.userData.settings[settingName] = value;
        this.saveUserData();
        
        this.showNotification(`Настройка "${this.getSettingDisplayName(settingName)}" ${value ? 'включена' : 'выключена'}`, 'success');
    }

    getSettingName(settingElement) {
        const settingItem = settingElement.closest('.setting-item');
        if (!settingItem) return '';
        
        const label = settingItem.querySelector('h4');
        const labelText = label ? label.textContent.trim() : '';
        
        console.log('Найден текст:', labelText);
        
        const labels = {
            'Email уведомления': 'emailNotifications',
            'Push-уведомления': 'pushNotifications',
            'SMS уведомления': 'smsNotifications',
            'Уведомления о новых оценках': 'gradeNotifications',
            'Темная тема': 'darkTheme',
            'Компактный режим': 'compactMode',
            'Двухфакторная аутентификация': 'twoFactorAuth'
        };
        
        return labels[labelText] || labelText;
    }

    getSettingDisplayName(settingName) {
        const names = {
            'emailNotifications': 'Email уведомления',
            'pushNotifications': 'Push-уведомления',
            'smsNotifications': 'SMS уведомления',
            'gradeNotifications': 'Уведомления о новых оценках',
            'darkTheme': 'Темная тема',
            'compactMode': 'Компактный режим',
            'twoFactorAuth': 'Двухфакторная аутентификация'
        };
        
        return names[settingName] || settingName;
    }

    changeLanguage(lang) {
        this.userData.settings.language = lang;
        this.saveUserData();
        this.showNotification(`Язык изменен на ${lang === 'ru' ? 'Русский' : 'English'}`, 'success');
    }

    viewSessions() {
        this.showNotification('Активные сессии: 2 устройства', 'info');
    }

    updateProfileDisplay() {
        const profileName = document.querySelector('.profile-name');
        if (profileName) {
            profileName.textContent = `${this.userData.personal.firstName} ${this.userData.personal.lastName}`;
        }
        
        const userName = document.querySelector('.user-name');
        if (userName) {
            userName.textContent = `${this.userData.personal.firstName} ${this.userData.personal.lastName}`;
        }
        
        const contactItems = document.querySelectorAll('.contact-item span');
        if (contactItems[0]) contactItems[0].textContent = this.userData.personal.email;
        if (contactItems[1]) contactItems[1].textContent = this.userData.personal.phone;
    }

    saveUserData() {
        localStorage.setItem('userProfileData', JSON.stringify(this.userData));
    }

    closeModal(modal) {
        modal.classList.remove('active');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
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
function changeAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const avatar = document.querySelector('.profile-avatar');
                avatar.innerHTML = `<img src="${e.target.result}" alt="Аватар">`;
                if (window.profileManager) {
                    window.profileManager.showNotification('Аватар успешно изменен', 'success');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function editProfile() {
    if (window.profileManager) {
        window.profileManager.editProfile();
    }
}

function changePassword() {
    if (window.profileManager) {
        window.profileManager.changePassword();
    }
}

function downloadData() {
    if (window.profileManager) {
        window.profileManager.downloadData();
    }
}

function showAchievements() {
    if (window.profileManager) {
        window.profileManager.showAchievements();
    }
}

function saveProfile() {
    if (window.profileManager) {
        window.profileManager.saveProfile();
    }
}

function updatePassword() {
    if (window.profileManager) {
        window.profileManager.updatePassword();
    }
}

function viewSessions() {
    if (window.profileManager) {
        window.profileManager.viewSessions();
    }
}

function closeModal() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Функция выхода
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Инициализация при загрузке страницы профиля
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.href.includes('profile.html')) {
        window.profileManager = new ProfileManager();
    }
});