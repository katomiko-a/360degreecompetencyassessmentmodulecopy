# Система оценки компетенций 360°

Полнофункциональная автоматизированная система для проведения оценки компетенций методом 360 градусов с интуитивным интерфейсом на русском языке.

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ и npm
- Аккаунт Supabase (бесплатный)
- Аккаунт Resend для email-уведомлений (опционально, бесплатный)

### Установка

1. **Клонируйте или распакуйте проект:**
```bash
cd 360-assessment-system
```

2. **Установите зависимости:**
```bash
npm install
```

3. **Настройте Supabase:**
   - Откройте проект в браузере
   - Система автоматически предложит подключиться к Supabase
   - Следуйте инструкциям в модальном окне
   - Скопируйте URL и Anon Key из вашего проекта Supabase

4. **Настройте Resend (для email-уведомлений):**
   - Зарегистрируйтесь на [resend.com](https://resend.com/signup)
   - Создайте API ключ
   - Добавьте ключ через интерфейс приложения (раздел "Уведомления")

5. **Запустите проект:**
```bash
npm run dev
```

6. **Откройте в браузере:**
```
http://localhost:5173
```

## 🔑 Тестовые пользователи

### Администратор
- **Email:** `admin@company.com`
- **Пароль:** `admin123`
- **Права:** Полный доступ ко всем функциям

### Сотрудник
- **Email:** `ivan.petrov@company.com`
- **Пароль:** `user123`
- **Права:** Просмотр своих оценок и результатов

## 📦 Основные функции

### ✅ Реализовано

1. **Аутентификация:**
   - Вход/регистрация
   - Управление сессиями
   - Разграничение прав доступа

2. **Дашборд:**
   - Версия для администратора
   - Версия для сотрудника
   - Аналитика и статистика

3. **Мастер создания кампаний:**
   - Многошаговый визард
   - Выбор участников
   - Настройка компетенций
   - Создание анкет

4. **Управление участниками:**
   - Массовое добавление
   - Назначение ролей оценивающих
   - Отслеживание прогресса

5. **Прохождение оценки:**
   - Интуитивный интерфейс
   - Автосохранение
   - Индикатор прогресса

6. **Отчеты и аналитика:**
   - Радарные диаграммы компетенций
   - Разрывный анализ (самооценка vs оценка окружения)
   - Персонализированные рекомендации
   - Экспорт в PDF/Excel

7. **Уведомления:**
   - Email-шаблоны
   - Автоматическая отправка приглашений
   - Напоминания
   - Уведомления о результатах

8. **Backend на Supabase:**
   - 20+ API endpoints
   - In-memory хранилище (Deno KV)
   - Аутентификация через JWT
   - Интеграция с Resend API

## 🎨 Технологии

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui
- **Charts:** Recharts
- **Backend:** Supabase Edge Functions (Deno)
- **Email:** Resend API
- **Build Tool:** Vite

## 📂 Структура проекта

```
360-assessment-system/
├── components/              # React компоненты
│   ├── ui/                 # UI библиотека (Shadcn)
│   ├── Dashboard.tsx       # Дашборд
│   ├── CampaignWizard.tsx  # Мастер создания кампаний
│   ├── AssessmentForm.tsx  # Форма оценки
│   ├── DetailedReports.tsx # Отчеты
│   └── ...
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx   # API endpoints
│           └── kv_store.tsx # Хранилище данных
├── utils/
│   ├── api.ts              # API клиент
│   └── supabase/           # Supabase конфигурация
├── hooks/                  # React hooks
├── styles/                 # Глобальные стили
├── App.tsx                 # Главный компонент
└── index.html              # HTML точка входа
```

## 🔧 Разработка

### Доступные команды

```bash
# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Preview продакшен билда
npm run preview

# Линтинг
npm run lint
```

### Рекомендуемые расширения VS Code

Проект уже содержит настройки для VS Code в `.vscode/extensions.json`:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

## 📖 Документация

Подробная документация доступна в следующих файлах:

- `QUICK_START.md` - Быстрый старт
- `BACKEND_API.md` - Описание API endpoints
- `INSTALLATION_GUIDE.md` - Детальная инструкция по установке
- `TROUBLESHOOTING.md` - Решение проблем
- `EXPORT_CHECKLIST.md` - Чеклист для экспорта

## 🔐 Безопасность

- **Не коммитьте** файлы `.env` с реальными ключами
- **Используйте** переменные окружения для всех секретов
- **Храните** API ключи в безопасном месте
- **Не используйте** систему для хранения PII без дополнительной защиты

## 🌐 API Endpoints

### Основные endpoints:

```
POST /make-server-9d167e02/auth/login
POST /make-server-9d167e02/auth/signup
POST /make-server-9d167e02/auth/logout
GET  /make-server-9d167e02/users
GET  /make-server-9d167e02/users/:id
POST /make-server-9d167e02/campaigns
GET  /make-server-9d167e02/campaigns
POST /make-server-9d167e02/assessments
GET  /make-server-9d167e02/assessments/:id
POST /make-server-9d167e02/send-test-email
POST /make-server-9d167e02/send-bulk-email
...и другие
```

Полный список см. в `BACKEND_API.md`

## 📧 Настройка Email

### Resend API

1. Зарегистрируйтесь на [resend.com](https://resend.com/signup)
2. Создайте API ключ (начинается с `re_`)
3. Добавьте ключ через интерфейс:
   - Перейдите в "Уведомления"
   - Нажмите "Добавить API ключ Resend"
   - Вставьте ключ и сохраните

### Тестовая отправка

- Для тестов используется домен `onboarding@resend.dev`
- Бесплатный план: 100 писем/день, 3000/месяц
- Подходит для демонстрации и разработки

## 🎯 Цветовая схема

Система использует сиреневую (purple) цветовую схему:

- Primary: `#9333ea` (purple-600)
- Secondary: `#7c3aed` (purple-700)
- Accent: `#a855f7` (purple-500)

## 🐛 Решение проблем

### Проблемы с Supabase

**Ошибка "Unauthorized":**
- Проверьте, что вы подключили Supabase
- Убедитесь, что скопировали правильные ключи
- Попробуйте перелогиниться

### Проблемы с Email

**"API key is invalid":**
- Создайте новый API ключ на resend.com
- Убедитесь, что ключ начинается с `re_`
- Скопируйте ключ без пробелов

### Проблемы с запуском

**Port уже занят:**
```bash
# Измените порт в vite.config.ts или завершите процесс
lsof -ti:5173 | xargs kill
```

**Ошибки установки зависимостей:**
```bash
# Очистите кэш и переустановите
rm -rf node_modules package-lock.json
npm install
```

## 📝 Лицензия

Проект создан для демонстрационных целей.

## 👥 Контакты

Для вопросов и предложений по проекту используйте раздел Issues.

## 🎓 Обучающие материалы

### Полезные ссылки:

- [React документация](https://react.dev)
- [TypeScript документация](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase документация](https://supabase.com/docs)
- [Resend документация](https://resend.com/docs)
- [Recharts примеры](https://recharts.org/en-US/examples)

---

**Сделано с ❤️ для эффективной оценки компетенций**
