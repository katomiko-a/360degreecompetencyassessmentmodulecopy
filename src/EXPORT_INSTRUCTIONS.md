# Инструкция по экспорту проекта

## Быстрый старт

Ваш проект готов к экспорту! Следуйте этим простым шагам:

## Вариант 1: Ручное копирование (Рекомендуется)

### 1. Создайте папку проекта на вашем компьютере

```
Создайте папку: 360-assessment-system
```

### 2. Скопируйте файлы из Figma Make

Скачайте все файлы из текущего проекта и расположите их следующим образом:

```
360-assessment-system/
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── README.md
├── INSTALLATION_GUIDE.md
│
├── .vscode/
│   ├── extensions.json
│   └── settings.json
│
└── src/
    ├── main.tsx
    ├── App.tsx
    │
    ├── components/
    │   ├── Dashboard.tsx
    │   ├── CampaignWizard.tsx
    │   ├── TakeAssessment.tsx
    │   ├── AssessmentResults.tsx
    │   ├── CreateAssessment.tsx
    │   ├── ParticipantsManagement.tsx
    │   ├── SurveyManagement.tsx
    │   ├── NotificationsManagement.tsx
    │   ├── AssessmentForm.tsx
    │   ├── DetailedReports.tsx
    │   ├── UserProfile.tsx
    │   ├── Settings.tsx
    │   ├── Navigation.tsx
    │   │
    │   ├── ui/
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── dialog.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── popover.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── slider.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   └── (все остальные UI компоненты)
    │   │
    │   └── figma/
    │       └── ImageWithFallback.tsx
    │
    ├── styles/
    │   └── globals.css
    │
    └── guidelines/
        └── Guidelines.md
```

### 3. Структура переноса файлов

**Корневые файлы** (из корня Figma Make → в корень проекта):
- ✅ `index.html`
- ✅ `package.json`
- ✅ `tsconfig.json`
- ✅ `vite.config.ts`
- ✅ `.gitignore`
- ✅ `README.md`
- ✅ `INSTALLATION_GUIDE.md`

**Файлы .vscode/** (создать папку `.vscode/` в корне):
- ✅ `.vscode/extensions.json`
- ✅ `.vscode/settings.json`

**Точка входа** (из корня → в `src/`):
- `App.tsx` → `src/App.tsx`
- ✅ `src/main.tsx` (уже создан)

**Компоненты** (из `/components/` → в `src/components/`):
- `components/Dashboard.tsx` → `src/components/Dashboard.tsx`
- `components/CampaignWizard.tsx` → `src/components/CampaignWizard.tsx`
- `components/TakeAssessment.tsx` → `src/components/TakeAssessment.tsx`
- `components/AssessmentResults.tsx` → `src/components/AssessmentResults.tsx`
- `components/CreateAssessment.tsx` → `src/components/CreateAssessment.tsx`
- `components/ParticipantsManagement.tsx` → `src/components/ParticipantsManagement.tsx`
- `components/SurveyManagement.tsx` → `src/components/SurveyManagement.tsx`
- `components/NotificationsManagement.tsx` → `src/components/NotificationsManagement.tsx`
- `components/AssessmentForm.tsx` → `src/components/AssessmentForm.tsx`
- `components/DetailedReports.tsx` → `src/components/DetailedReports.tsx`
- `components/UserProfile.tsx` → `src/components/UserProfile.tsx`
- `components/Settings.tsx` → `src/components/Settings.tsx`
- `components/Navigation.tsx` → `src/components/Navigation.tsx`

**UI компоненты** (из `/components/ui/` → в `src/components/ui/`):
- Все файлы из `components/ui/` → `src/components/ui/`

**Figma компоненты** (из `/components/figma/` → в `src/components/figma/`):
- `components/figma/ImageWithFallback.tsx` → `src/components/figma/ImageWithFallback.tsx`

**Стили** (из `/styles/` → в `src/styles/`):
- `styles/globals.css` → `src/styles/globals.css`

**Документация** (из `/guidelines/` → в `src/guidelines/`):
- `guidelines/Guidelines.md` → `src/guidelines/Guidelines.md`

### 4. Исправление импортов в файлах

После копирования файлов нужно обновить импорты в некоторых файлах:

#### В `src/App.tsx`:
Измените импорты компонентов:
```typescript
// Было:
import { Dashboard } from './components/Dashboard';

// Должно остаться как есть, просто убедитесь что путь правильный:
import { Dashboard } from './components/Dashboard';
```

#### В `src/main.tsx`:
Уже настроен правильно:
```typescript
import App from './App';
import './styles/globals.css';
```

#### В компонентах:
Все импорты должны работать, так как относительные пути сохраняются.

## Вариант 2: Использование функции "Download" в Figma Make

Если Figma Make поддерживает экспорт проекта:

1. Нажмите кнопку "Download" или "Export"
2. Выберите формат "ZIP"
3. Скачайте архив
4. Распакуйте архив на вашем компьютере
5. Переименуйте папку в `360-assessment-system`

## После копирования файлов

### 1. Откройте проект в VS Code

```bash
cd 360-assessment-system
code .
```

### 2. Установите зависимости

Откройте терминал в VS Code (`` Ctrl+` ``) и выполните:

```bash
npm install
```

### 3. Запустите проект

```bash
npm run dev
```

### 4. Откройте в браузере

Перейдите по адресу: `http://localhost:5173`

## Проверочный чеклист

После переноса файлов убедитесь:

- ✅ Все файлы скопированы в правильные папки
- ✅ Структура `src/` создана
- ✅ Файл `package.json` в корне проекта
- ✅ Файл `index.html` в корне проекта
- ✅ Файл `src/main.tsx` существует
- ✅ Файл `src/App.tsx` существует
- ✅ Все компоненты в `src/components/`
- ✅ UI компоненты в `src/components/ui/`
- ✅ Стили в `src/styles/globals.css`
- ✅ Файлы конфигурации TypeScript и Vite в корне

## Что делать, если что-то не работает

### Ошибка: "Cannot find module"

**Проблема:** Неправильные пути импорта

**Решение:** Проверьте, что:
1. Файлы находятся в правильных папках
2. Импорты используют правильные пути
3. Имена файлов совпадают с импортами (учитывайте регистр)

### Ошибка: "Failed to resolve import"

**Проблема:** Не установлены зависимости

**Решение:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Ошибка в браузере

**Решение:**
1. Откройте консоль браузера (F12)
2. Посмотрите на ошибку
3. Проверьте, что все файлы на месте
4. Перезапустите сервер разработки

## Дополнительная помощь

Если возникли проблемы:

1. Откройте файл `INSTALLATION_GUIDE.md` для детальных инструкций
2. Проверьте `README.md` для информации о проекте
3. Убедитесь, что Node.js версии 18 или выше установлен

## Итоговая структура проекта

```
360-assessment-system/
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── figma/
│   │   └── (все основные компоненты)
│   ├── styles/
│   │   └── globals.css
│   ├── guidelines/
│   │   └── Guidelines.md
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── README.md
└── INSTALLATION_GUIDE.md
```

Готово! 🎉 Ваш проект готов к работе в Visual Studio Code!
