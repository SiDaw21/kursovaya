// login.js - Функциональность страницы входа
class LoginManager {
    constructor() {
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkRememberedUser();
        this.applySavedTheme();
    }

    setupEventListeners() {
        // Форма входа
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Переключение видимости пароля
        const passwordToggle = document.getElementById('passwordToggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Восстановление пароля
        const forgotPassword = document.getElementById('forgotPassword');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordModal();
            });
        }

        // Регистрация
        const registerLink = document.getElementById('registerLink');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterModal();
            });
        }

        // Социальные кнопки
        document.querySelectorAll('.btn-social').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e.target));
        });

        // Закрытие модальных окон
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });
    }

    checkRememberedUser() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            try {
                const userData = JSON.parse(rememberedUser);
                document.getElementById('login').value = userData.login || '';
                document.getElementById('rememberMe').checked = true;
            } catch (e) {
                console.log('Ошибка при загрузке сохраненного пользователя:', e);
            }
        }
    }

    applySavedTheme() {
        const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        if (this.isLoading) return;
        
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Валидация
        if (!this.validateForm(login, password)) {
            return;
        }
        
        this.setLoading(true);
        
        try {
            // Имитация запроса к серверу
            await this.mockLoginRequest(login, password);
            
            // Сохраняем данные пользователя
            this.saveUserData(login, rememberMe);
            
            // Показываем успешное сообщение
            this.showSuccessMessage();
            
            // Перенаправляем в профиль
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
            
        } catch (error) {
            this.showError(error.message);
            this.setLoading(false);
        }
    }

    validateForm(login, password) {
        if (!login.trim()) {
            this.showError('Введите логин или email');
            return false;
        }
        
        if (!password.trim()) {
            this.showError('Введите пароль');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('Пароль должен содержать минимум 6 символов');
            return false;
        }
        
        return true;
    }

    mockLoginRequest(login, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Тестовые учетные данные
                const testUsers = {
                    'student': 'password123',
                    'ivan.petrov@ktssa.ru': 'password123',
                    'admin': 'admin123'
                };
                
                if (testUsers[login] === password) {
                    resolve({
                        success: true,
                        user: {
                            id: 1,
                            login: login,
                            name: 'Иван Петров',
                            role: 'student',
                            group: 'С-21'
                        }
                    });
                } else {
                    reject(new Error('Неверный логин или пароль'));
                }
            }, 1000);
        });
    }

    saveUserData(login, rememberMe) {
        const userData = {
            isLoggedIn: true,
            login: login,
            timestamp: new Date().toISOString()
        };
        
        // Сохраняем в sessionStorage для текущей сессии
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Сохраняем в localStorage если выбрано "Запомнить меня"
        if (rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify({ login: login }));
        } else {
            localStorage.removeItem('rememberedUser');
        }
        
        // Сохраняем базовые данные пользователя
        const userProfile = {
            personal: {
                firstName: "Иван",
                lastName: "Петров",
                middleName: "Сергеевич",
                email: "ivan.petrov@ktssa.ru",
                phone: "+79001234567"
            },
            academic: {
                group: "С-21",
                specialty: "Строительство и эксплуатация зданий и сооружений"
            }
        };
        
        localStorage.setItem('userProfileData', JSON.stringify(userProfile));
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('passwordToggle').querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleIcon.className = 'fas fa-eye';
        }
    }

    showForgotPasswordModal() {
        document.getElementById('forgotPasswordModal').classList.add('active');
    }

    showRegisterModal() {
        document.getElementById('registerModal').classList.add('active');
    }

    closeModal(modal) {
        modal.classList.remove('active');
    }

    setLoading(loading) {
        this.isLoading = loading;
        const loginButton = document.getElementById('loginButton');
        const btnText = loginButton.querySelector('.btn-text');
        const btnLoader = loginButton.querySelector('.btn-loader');
        
        if (loading) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            loginButton.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            loginButton.disabled = false;
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccessMessage() {
        this.showNotification('Вход выполнен успешно! Перенаправляем...', 'success');
    }

    showNotification(message, type = 'info') {
        // Удаляем старые уведомления
        const oldNotifications = document.querySelectorAll('.login-notification');
        oldNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `login-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.querySelector('.login-form').prepend(notification);
        
        // Автоматическое скрытие
        if (type !== 'error') {
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }

    handleSocialLogin(button) {
        const provider = button.classList.contains('btn-google') ? 'google' : 'vk';
        this.showNotification(`Вход через ${provider.toUpperCase()} в разработке`, 'info');
    }
}

// Глобальные функции для модальных окон
function sendRecoveryEmail() {
    const emailInput = document.querySelector('#passwordRecoveryForm input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Введите email');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Введите корректный email');
        return;
    }
    
    // Имитация отправки email
    alert(`Инструкция по восстановлению пароля отправлена на ${email}`);
    closeModal();
}

function registerUser() {
    const form = document.getElementById('registerForm');
    const inputs = form.querySelectorAll('input[required]');
    
    for (let input of inputs) {
        if (!input.value.trim()) {
            alert('Заполните все обязательные поля');
            return;
        }
    }
    
    // Имитация регистрации
    alert('Регистрация успешно завершена! Теперь вы можете войти в систему.');
    closeModal();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function closeModal() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.loginManager = new LoginManager();
});

// Защита страниц - проверка авторизации
function checkAuth() {
    if (window.location.pathname.includes('profile.html') || 
        window.location.pathname.includes('index.html') ||
        window.location.pathname.includes('schedule.html') ||
        window.location.pathname.includes('messages.html') ||
        window.location.pathname.includes('journal.html') ||
        window.location.pathname.includes('knowledge.html')) {
        
        const currentUser = sessionStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.href = 'login.html';
        }
    }
}

// Проверяем авторизацию при загрузке страниц (кроме login.html)
if (!window.location.pathname.includes('login.html')) {
    document.addEventListener('DOMContentLoaded', checkAuth);
}