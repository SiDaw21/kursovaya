// messages.js - Полнофункциональная система сообщений
class MessagesManager {
    constructor() {
        this.currentChatId = 1;
        this.replyingTo = null;
        this.attachedFiles = [];
        this.chats = this.loadChats();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadChat(this.currentChatId);
        this.setupRealTimeUpdates();
        this.setupSearch();
    }

    setupEventListeners() {
        // Навигация по чатам
        document.querySelectorAll('.conversation').forEach(conv => {
            conv.addEventListener('click', (e) => this.selectChat(e.currentTarget.dataset.chatId));
        });

        // Отправка сообщения
        document.getElementById('sendMessageBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Авторазмер textarea
        document.getElementById('messageInput').addEventListener('input', this.autoResizeTextarea);

        // Новое сообщение
        document.getElementById('newMessageBtn').addEventListener('click', () => this.openNewMessageModal());

        // Обновление сообщений
        document.getElementById('refreshMessages').addEventListener('click', () => this.refreshMessages());

        // Фильтры
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.applyFilter(e.currentTarget.dataset.filter));
        });

        // Поиск
        document.getElementById('messagesSearch').addEventListener('input', (e) => this.searchMessages(e.target.value));

        // Модальные окна
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Прикрепление файлов
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e));
        this.setupFileDrop();
    }

    loadChats() {
        return {
            1: {
                id: 1,
                name: "Иванова А.П.",
                avatar: "fas fa-user-tie",
                type: "teacher",
                subject: "Математика",
                status: "online",
                messages: [
                    {
                        id: 1,
                        sender: "teacher",
                        text: "Добрый день, Иван! Напоминаю, что завтра контрольная работа по теме 'Дифференциальные уравнения'",
                        time: "12:30",
                        timestamp: new Date().setHours(12, 30),
                        status: "seen",
                        attachments: []
                    },
                    {
                        id: 2,
                        sender: "teacher",
                        text: "Не забудьте повторить материалы лекции №5 и практические задания с семинара",
                        time: "12:31",
                        timestamp: new Date().setHours(12, 31),
                        status: "seen",
                        attachments: []
                    },
                    {
                        id: 3,
                        sender: "student",
                        text: "Добрый день, Анна Петровна! Спасибо за напоминание. Обязательно подготовлюсь. У меня вопрос по задаче №3 из практикума",
                        time: "12:35",
                        timestamp: new Date().setHours(12, 35),
                        status: "delivered",
                        attachments: []
                    },
                    {
                        id: 4,
                        sender: "teacher",
                        text: "Вот материалы для подготовки:",
                        time: "12:40",
                        timestamp: new Date().setHours(12, 40),
                        status: "seen",
                        attachments: [
                            {
                                id: 1,
                                name: "Лекция_5_Дифференциальные_уравнения.pdf",
                                type: "pdf",
                                size: "2.4 MB",
                                url: "#"
                            }
                        ]
                    }
                ],
                unread: 2
            },
            2: {
                id: 2,
                name: "Петров С.И.",
                avatar: "fas fa-user-tie",
                type: "teacher",
                subject: "Физика",
                status: "offline",
                lastSeen: "2ч назад",
                messages: [
                    {
                        id: 1,
                        sender: "teacher",
                        text: "Лабораторная работа проверена. Ваша оценка - 4",
                        time: "Вчера",
                        timestamp: new Date(Date.now() - 86400000),
                        status: "seen",
                        attachments: []
                    }
                ],
                unread: 0
            },
            3: {
                id: 3,
                name: "Группа С-21",
                avatar: "fas fa-users",
                type: "group",
                members: 12,
                online: 3,
                messages: [
                    {
                        id: 1,
                        sender: "student",
                        senderName: "Мария",
                        text: "Кто идет на пару?",
                        time: "10:15",
                        timestamp: new Date().setHours(10, 15),
                        status: "seen",
                        attachments: []
                    }
                ],
                unread: 5
            },
            4: {
                id: 4,
                name: "Кузнецова М.В.",
                avatar: "fas fa-user-tie",
                type: "teacher",
                subject: "Строительство",
                status: "online",
                important: true,
                messages: [
                    {
                        id: 1,
                        sender: "teacher",
                        text: "Срочно! Курсовая работа должна быть сдана до конца недели",
                        time: "09:45",
                        timestamp: new Date().setHours(9, 45),
                        status: "seen",
                        attachments: []
                    }
                ],
                unread: 1
            }
        };
    }

    selectChat(chatId) {
        // Снимаем выделение со всех чатов
        document.querySelectorAll('.conversation').forEach(conv => {
            conv.classList.remove('active');
        });

        // Выделяем выбранный чат
        const selectedChat = document.querySelector(`.conversation[data-chat-id="${chatId}"]`);
        if (selectedChat) {
            selectedChat.classList.add('active');
            
            // Сбрасываем счетчик непрочитанных
            const badge = selectedChat.querySelector('.conversation-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        }

        this.currentChatId = parseInt(chatId);
        this.loadChat(this.currentChatId);
    }

    loadChat(chatId) {
        const chat = this.chats[chatId];
        if (!chat) return;

        // Обновляем заголовок чата
        this.updateChatHeader(chat);

        // Загружаем сообщения
        this.renderMessages(chat.messages);

        // Прокручиваем вниз
        this.scrollToBottom();

        // Обновляем список чатов
        this.updateConversationsList();
    }

    updateChatHeader(chat) {
        const header = document.querySelector('.chat-header');
        if (!header) return;

        const statusText = chat.type === 'group' 
            ? `${chat.members} участников • ${chat.online} online`
            : `${chat.subject} • ${chat.status === 'online' ? 'Online' : `Был(а) ${chat.lastSeen}`}`;

        header.querySelector('.chat-user-name').textContent = chat.name;
        header.querySelector('.chat-user-status').innerHTML = `
            ${chat.status === 'online' ? '<span class="status-dot online"></span>' : ''}
            ${statusText}
        `;
    }

    renderMessages(messages) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        // Группируем сообщения по датам
        const groupedMessages = this.groupMessagesByDate(messages);

        let html = '';

        groupedMessages.forEach(group => {
            html += `<div class="message-date"><span>${group.date}</span></div>`;
            
            group.messages.forEach(message => {
                html += this.renderMessage(message);
            });
        });

        messagesContainer.innerHTML = html;

        // Добавляем обработчики для действий сообщений
        this.attachMessageActions();
    }

    groupMessagesByDate(messages) {
        const groups = [];
        let currentDate = null;
        let currentGroup = null;

        messages.forEach(message => {
            const messageDate = this.formatMessageDate(message.timestamp);
            
            if (messageDate !== currentDate) {
                currentGroup = {
                    date: messageDate,
                    messages: []
                };
                groups.push(currentGroup);
                currentDate = messageDate;
            }
            
            currentGroup.messages.push(message);
        });

        return groups;
    }

    formatMessageDate(timestamp) {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Сегодня';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Вчера';
        } else {
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    }

    renderMessage(message) {
        const isSent = message.sender === 'student';
        const senderName = message.senderName || (isSent ? 'Вы' : this.chats[this.currentChatId].name);
        
        return `
            <div class="message ${isSent ? 'sent' : 'received'}" data-message-id="${message.id}">
                ${!isSent ? `
                    <div class="message-avatar">
                        <i class="${this.chats[this.currentChatId].avatar}"></i>
                    </div>
                ` : ''}
                
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">${senderName}</span>
                        <span class="message-time">${message.time}</span>
                    </div>
                    <div class="message-bubble">
                        ${message.text}
                        ${this.renderAttachments(message.attachments)}
                    </div>
                    <div class="message-status">
                        <i class="fas fa-check${message.status === 'seen' ? '-double seen' : ''}"></i>
                    </div>
                </div>
                
                <div class="message-actions">
                    ${!isSent ? `
                        <button class="msg-action" onclick="messagesManager.replyToMessage(${message.id})">
                            <i class="fas fa-reply"></i>
                        </button>
                        <button class="msg-action" onclick="messagesManager.copyMessage(${message.id})">
                            <i class="fas fa-copy"></i>
                        </button>
                    ` : `
                        <button class="msg-action" onclick="messagesManager.editMessage(${message.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="msg-action" onclick="messagesManager.deleteMessage(${message.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    renderAttachments(attachments) {
        if (!attachments || attachments.length === 0) return '';
        
        return attachments.map(attachment => `
            <div class="message-attachment">
                <div class="attachment-icon">
                    <i class="fas fa-file-${attachment.type}"></i>
                </div>
                <div class="attachment-info">
                    <div class="attachment-name">${attachment.name}</div>
                    <div class="attachment-size">${attachment.size}</div>
                </div>
                <button class="attachment-download" onclick="messagesManager.downloadAttachment(${attachment.id})">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `).join('');
    }

    attachMessageActions() {
        // Обработчики уже добавлены через onclick в renderMessage
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const text = input.value.trim();
        
        if (!text && this.attachedFiles.length === 0) return;

        const newMessage = {
            id: Date.now(),
            sender: 'student',
            text: text,
            time: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}),
            timestamp: Date.now(),
            status: 'sent',
            attachments: [...this.attachedFiles]
        };

        // Добавляем сообщение в историю
        this.chats[this.currentChatId].messages.push(newMessage);

        // Обновляем интерфейс
        this.renderMessages(this.chats[this.currentChatId].messages);
        this.scrollToBottom();

        // Очищаем поле ввода и вложения
        input.value = '';
        this.attachedFiles = [];
        this.closeReply();
        this.autoResizeTextarea();

        // Имитируем ответ
        setTimeout(() => this.simulateReply(), 2000 + Math.random() * 3000);
    }

    simulateReply() {
        const chat = this.chats[this.currentChatId];
        const replies = [
            "Хорошо, понял(а) вас",
            "Спасибо за информацию!",
            "Обязательно сделаю",
            "У меня есть вопрос по этому поводу",
            "Можете подробнее объяснить?",
            "Когда крайний срок?"
        ];

        const replyMessage = {
            id: Date.now(),
            sender: 'teacher',
            text: replies[Math.floor(Math.random() * replies.length)],
            time: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}),
            timestamp: Date.now(),
            status: 'delivered',
            attachments: []
        };

        chat.messages.push(replyMessage);
        this.renderMessages(chat.messages);
        this.scrollToBottom();

        // Обновляем счетчик непрочитанных
        this.updateUnreadCount(this.currentChatId, 1);
    }

    replyToMessage(messageId) {
        const message = this.chats[this.currentChatId].messages.find(m => m.id === messageId);
        if (!message) return;

        this.replyingTo = message;
        
        const replyPanel = document.getElementById('replyPanel');
        const replyPreview = document.getElementById('replyPreview');
        
        replyPreview.textContent = message.text;
        replyPanel.style.display = 'block';
        
        document.getElementById('messageInput').focus();
    }

    closeReply() {
        this.replyingTo = null;
        document.getElementById('replyPanel').style.display = 'none';
    }

    copyMessage(messageId) {
        const message = this.chats[this.currentChatId].messages.find(m => m.id === messageId);
        if (message) {
            navigator.clipboard.writeText(message.text).then(() => {
                this.showNotification('Сообщение скопировано', 'success');
            });
        }
    }

    editMessage(messageId) {
        const message = this.chats[this.currentChatId].messages.find(m => m.id === messageId);
        if (message) {
            const input = document.getElementById('messageInput');
            input.value = message.text;
            input.focus();
            
            // Помечаем сообщение для редактирования
            this.editingMessageId = messageId;
        }
    }

    deleteMessage(messageId) {
        if (confirm('Вы уверены, что хотите удалить это сообщение?')) {
            this.chats[this.currentChatId].messages = this.chats[this.currentChatId].messages
                .filter(m => m.id !== messageId);
            this.renderMessages(this.chats[this.currentChatId].messages);
            this.showNotification('Сообщение удалено', 'success');
        }
    }

    downloadAttachment(attachmentId) {
        this.showNotification('Файл скачивается...', 'info');
        // В реальном приложении здесь будет логика скачивания
    }

    autoResizeTextarea() {
        const textarea = document.getElementById('messageInput');
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Функции для модальных окон
    openNewMessageModal() {
        document.getElementById('newMessageModal').classList.add('active');
    }

    createNewMessage() {
        const recipient = document.getElementById('recipientSelect').value;
        const subject = document.getElementById('messageSubject').value;
        const text = document.getElementById('newMessageText').value;
        const important = document.getElementById('importantMessage').checked;

        if (!recipient || !text) {
            this.showNotification('Заполните все обязательные поля', 'error');
            return;
        }

        // Логика создания нового чата
        this.showNotification('Сообщение отправлено', 'success');
        this.closeModal(document.getElementById('newMessageModal'));
        
        // Очищаем форму
        document.getElementById('newMessageForm').reset();
    }

    // Поиск и фильтрация
    searchMessages(query) {
        if (query.length < 2) {
            this.loadChat(this.currentChatId);
            return;
        }

        const chat = this.chats[this.currentChatId];
        const filteredMessages = chat.messages.filter(message => 
            message.text.toLowerCase().includes(query.toLowerCase())
        );

        this.renderMessages(filteredMessages);
    }

    applyFilter(filter) {
        document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`.filter-tab[data-filter="${filter}"]`).classList.add('active');

        // Фильтрация списка чатов
        const conversations = document.querySelectorAll('.conversation');
        conversations.forEach(conv => {
            const chatId = conv.dataset.chatId;
            const chat = this.chats[chatId];
            
            let show = true;
            
            switch (filter) {
                case 'unread':
                    show = chat.unread > 0;
                    break;
                case 'important':
                    show = chat.important === true;
                    break;
                case 'teachers':
                    show = chat.type === 'teacher';
                    break;
                case 'students':
                    show = chat.type === 'group';
                    break;
            }
            
            conv.style.display = show ? 'flex' : 'none';
        });
    }

    // Работа с файлами
    setupFileDrop() {
        const dropArea = document.getElementById('fileDropArea');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
        });

        dropArea.addEventListener('drop', (e) => this.handleDrop(e), false);
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleFiles(files);
    }

    handleFileSelect(e) {
        const files = e.target.files;
        this.handleFiles(files);
    }

    handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.attachedFiles.push({
                id: Date.now() + i,
                name: file.name,
                type: this.getFileType(file.type),
                size: this.formatFileSize(file.size),
                file: file
            });
        }
        this.updateFileList();
    }

    getFileType(mimeType) {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.includes('pdf')) return 'pdf';
        if (mimeType.includes('word') || mimeType.includes('document')) return 'word';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel';
        return 'file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = this.attachedFiles.map(file => `
            <div class="file-item">
                <i class="fas fa-file-${file.type}"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${file.size}</span>
                <button class="file-remove" onclick="messagesManager.removeFile(${file.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    removeFile(fileId) {
        this.attachedFiles = this.attachedFiles.filter(file => file.id !== fileId);
        this.updateFileList();
    }

    uploadFiles() {
        if (this.attachedFiles.length === 0) return;
        
        // Логика загрузки файлов
        this.showNotification('Файлы загружены', 'success');
        this.closeModal(document.getElementById('attachFileModal'));
        
        // Добавляем файлы к следующему сообщению
        // Они уже в this.attachedFiles и будут отправлены с сообщением
    }

    // Утилиты
    showNotification(message, type = 'info') {
        // Используем существующую систему уведомлений из script.js
        console.log(`${type.toUpperCase()}: ${message}`);
        // В реальном приложении можно интегрировать с notificationSystem из script.js
    }

    closeModal(modal) {
        modal.classList.remove('active');
    }

    refreshMessages() {
        this.loadChat(this.currentChatId);
        this.showNotification('Сообщения обновлены', 'success');
    }

    updateUnreadCount(chatId, count) {
        const chat = this.chats[chatId];
        if (chat) {
            chat.unread = count;
            this.updateConversationsList();
        }
    }

    updateConversationsList() {
        Object.values(this.chats).forEach(chat => {
            const convElement = document.querySelector(`.conversation[data-chat-id="${chat.id}"]`);
            if (convElement) {
                const badge = convElement.querySelector('.conversation-badge');
                if (badge) {
                    if (chat.unread > 0) {
                        badge.textContent = chat.unread > 9 ? '9+' : chat.unread;
                        badge.style.display = 'flex';
                    } else {
                        badge.style.display = 'none';
                    }
                }
            }
        });
    }

    setupRealTimeUpdates() {
        // Имитация реального времени - обновление статусов
        setInterval(() => {
            this.updateOnlineStatus();
        }, 30000);
    }

    updateOnlineStatus() {
        // Случайное обновление статусов для демонстрации
        Object.values(this.chats).forEach(chat => {
            if (chat.type === 'teacher' && Math.random() > 0.7) {
                chat.status = chat.status === 'online' ? 'offline' : 'online';
                if (chat.status === 'offline') {
                    chat.lastSeen = 'только что';
                }
            }
        });
        
        if (this.currentChatId) {
            this.updateChatHeader(this.chats[this.currentChatId]);
        }
    }
}

// Глобальные функции для onclick атрибутов
function attachFile() {
    document.getElementById('attachFileModal').classList.add('active');
}

function showChatInfo(chatId) {
    document.getElementById('chatInfoModal').classList.add('active');
}

function searchInChat() {
    const query = prompt('Введите текст для поиска в чате:');
    if (query) {
        messagesManager.searchMessages(query);
    }
}

function showChatSettings() {
    alert('Настройки чата');
}

function startVoiceRecording() {
    alert('Запись голосового сообщения');
}

function showEmojiPicker() {
    alert('Выбор эмодзи');
}

function showFormattingTools() {
    alert('Инструменты форматирования');
}

function attachImage() {
    alert('Прикрепление изображения');
}

function scheduleMessage() {
    alert('Отложенная отправка');
}

function clearChatHistory() {
    if (confirm('Вы уверены, что хотите очистить историю чата?')) {
        messagesManager.chats[messagesManager.currentChatId].messages = [];
        messagesManager.renderMessages([]);
        messagesManager.showNotification('История чата очищена', 'success');
    }
}

function muteChat() {
    messagesManager.showNotification('Уведомления отключены', 'info');
}

function exportChat() {
    messagesManager.showNotification('Чат экспортирован', 'success');
}

function blockUser() {
    if (confirm('Вы уверены, что хотите заблокировать этого пользователя?')) {
        messagesManager.showNotification('Пользователь заблокирован', 'warning');
    }
}

// Инициализация
let messagesManager;

document.addEventListener('DOMContentLoaded', function() {
    messagesManager = new MessagesManager();
});