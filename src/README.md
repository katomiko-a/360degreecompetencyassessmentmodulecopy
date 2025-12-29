# Система оценки компетенций 360°

Полнофункциональная автоматизированная система для проведения оценки компетенций методом 360 градусов с интуитивным интерфейсом на русском языке.

## 🚀 Быстрый старт для VS Code

### 1. Откройте проект
```bash
cd 360-assessment-system
code .
```

### 2. Установите зависимости
```bash
npm install
```

### 3. Запустите dev сервер
```bash
npm run dev
```

### 4. Откройте в браузере
```
http://localhost:5173
```

**👉 Полная инструкция в `VSCODE_SETUP.md`**

## 📖 Документация

- **`VSCODE_SETUP.md`** - Настройка VS Code и запуск
- **`README_VSCODE.md`** - Подробная документация проекта
- **`QUICK_START.md`** - Быстрый старт
- **`BACKEND_API.md`** - Документация API
- **`INSTALLATION_GUIDE.md`** - Детальная установка
- **`TROUBLESHOOTING.md`** - Решение проблем

## Описание

Система включает:
- **Backend на Supabase** с аутентификацией и API
- Дашборд с версиями для администратора и сотрудника
- Многошаговый мастер настройки кампаний оценки
- Выбор участников и создание анкет
- Интуитивный интерфейс заполнения оценок
- Детальные отчеты с визуализацией данных
- Радарные диаграммы для анализа компетенций
- Разрывный анализ между самооценкой и оценкой окружения
- Персонализированные рекомендации по развитию
- Поддержка разных ролей оценивающих
- Автоматические уведомления
- Личный кабинет пользователя
- Гибкие настройки системы

## Технологический стек

### Frontend
- **React 18** - библиотека для создания пользовательских интерфейсов
- **TypeScript** - типизированный JavaScript
- **Vite** - быстрый сборщик проектов
- **Tailwind CSS 4.0** - utility-first CSS фреймворк
- **Recharts** - библиотека для графиков и диаграмм
- **Lucide React** - иконки
- **React Hook Form** - управление формами
- **Sonner** - уведомления

### Backend
- **Supabase** - платформа для backend (PostgreSQL, Auth, Edge Functions)
- **Hono** - быстрый web-фреймворк для Edge Functions
- **Deno** - современный JavaScript/TypeScript runtime
- **KV Store** - хранилище ключ-значение для данных

## Поддерживаемые IDE

Проект полностью совместим с:

### Visual Studio Code (Рекомендуется)
- Легкий и быстрый редактор
- Отличная поддержка React/TypeScript
- См. `INSTALLATION_GUIDE.md`

### Visual Studio 2019/2022
- Полноценная IDE от Microsoft
- Поддержка через Node.js Tools
- См. `VISUAL_STUDIO_GUIDE.md`
- Файлы проекта: `.sln` и `.njsproj` включены

## Установка и запуск

### Предварительные требования

- Node.js версии 18 или выше
- npm или yarn

### Шаги установки

1. Клонируйте репозиторий или скопируйте файлы проекта

2. Установите зависимости:
```bash
npm install
```

или

```bash
yarn install
```

3. Запустите проект в режиме разработки:
```bash
npm run dev
```

или

```bash
yarn dev
```

4. Откройте браузер и перейдите по адресу: `http://localhost:5173`

### Сборка для продакшена

```bash
npm run build
```

или

```bash
yarn build
```

Собранные файлы будут в папке `dist/`.

### Предварительный просмотр production-сборки

```bash
npm run preview
```

или

```bash
yarn preview
```

## Структура проекта

```
360-assessment-system/
├── components/             # Компоненты React
│   ├── Login.tsx          # Форма входа
│   ├── Signup.tsx         # Форма регистрации
│   ├── Dashboard.tsx
│   ├── CampaignWizard.tsx
│   ├── TakeAssessment.tsx
│   ├── AssessmentResults.tsx
│   ├── ParticipantsManagement.tsx
│   ├── SurveyManagement.tsx
│   ├── NotificationsManagement.tsx
│   ├── AssessmentForm.tsx
│   ├── DetailedReports.tsx
│   ├── UserProfile.tsx
│   ├── Settings.tsx
│   ├── Navigation.tsx
│   ├── ui/                # UI компоненты
│   └── figma/             # Figma компоненты
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx  # Hono web-сервер с API endpoints
│           └── kv_store.tsx  # Утилиты для KV Store
├── utils/
│   ├── api.ts             # API клиент для backend
│   └── supabase/
│       └── info.tsx       # Конфигурация Supabase
├── hooks/
│   └── useAuth.ts         # Хук для аутентификации
├── styles/
│   └── globals.css        # Глобальные стили
├── App.tsx                # Главный компонент
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── BACKEND_API.md         # 📚 Документация API
├── BACKEND_QUICK_START.md # 🚀 Быстрый старт с backend
└── README.md
```

## 🚀 Быстрый старт с Backend

### Первый запуск

1. **Запустите приложение**: `npm run dev`

2. **Зарегистрируйте администратора**:
   - Нажмите "Зарегистрироваться"
   - Email: `admin@example.com`
   - Пароль: `admin123`
   - Имя: `Администратор`
   - Роль: `Администратор`

3. **Войдите в систему** с созданными учетными данными

4. **Создайте первую кампанию**:
   - Перейдите в "Мастер кампаний"
   - Заполните данные о кампании
   - Добавьте участников
   - Создайте анкету с компетенциями

5. **Заполните оценку**:
   - Выберите кампанию
   - Заполните анкету
   - Отправьте ответы

6. **Просмотрите отчет**:
   - Перейдите в "Отчеты"
   - Выберите пользователя
   - Изучите визуализации и рекомендации

### 📚 Документация Backend

- **Полная API документация**: см. `BACKEND_API.md`
- **Руководство разработчика**: см. `BACKEND_QUICK_START.md`
- **Типы данных и утилиты**: см. `/utils/api.ts`

### Backend Endpoints

Все API endpoints доступны по адресу:
```
https://{projectId}.supabase.co/functions/v1/make-server-9d167e02
```

**Основные группы endpoints:**
- 🔐 **Auth**: `/signup`, `/profile`
- 📋 **Campaigns**: `/campaigns` (GET, POST, PUT, DELETE)
- 📝 **Surveys**: `/surveys` (GET, POST, PUT)
- ✅ **Responses**: `/responses` (GET, POST)
- 📊 **Reports**: `/reports/:campaignId/:userId`
- 🔔 **Notifications**: `/notifications` (GET, POST, PUT)
- 👥 **Users**: `/users`

Подробнее см. в `BACKEND_API.md`