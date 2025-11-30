# Руководство по установке проекта в Visual Studio Code

## Шаг 1: Подготовка окружения

### Установите необходимое ПО:

1. **Node.js** (версия 18 или выше)
   - Скачайте с официального сайта: https://nodejs.org/
   - Выберите LTS версию
   - Проверьте установку в терминале:
     ```bash
     node --version
     npm --version
     ```

2. **Visual Studio Code**
   - Скачайте с официального сайта: https://code.visualstudio.com/
   - Установите программу

3. **Git** (опционально, но рекомендуется)
   - Скачайте с официального сайта: https://git-scm.com/

## Шаг 2: Подготовка структуры проекта

Создайте следующую структуру папок:

```
360-assessment-system/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   └── figma/
│   ├── styles/
│   └── guidelines/
└── public/
```

## Шаг 3: Копирование файлов

Скопируйте все файлы из Figma Make в соответствующие папки:

### Корневые файлы:
- `index.html` → корень проекта
- `package.json` → корень проекта
- `tsconfig.json` → корень проекта
- `vite.config.ts` → корень проекта
- `.gitignore` → корень проекта
- `README.md` → корень проекта

### Файлы src/:
- `App.tsx` → `src/App.tsx`
- `main.tsx` → `src/main.tsx`

### Файлы components/:
Все файлы из папки `/components/` → `src/components/`
- `Dashboard.tsx`
- `CampaignWizard.tsx`
- `TakeAssessment.tsx`
- `AssessmentResults.tsx`
- `ParticipantsManagement.tsx`
- `SurveyManagement.tsx`
- `NotificationsManagement.tsx`
- `AssessmentForm.tsx`
- `DetailedReports.tsx`
- `UserProfile.tsx`
- `Settings.tsx`
- `Navigation.tsx`
- `CreateAssessment.tsx`
- И все файлы из подпапок `ui/` и `figma/`

### Файлы styles/:
- `globals.css` → `src/styles/globals.css`

### Файлы guidelines/:
- `Guidelines.md` → `src/guidelines/Guidelines.md`

## Шаг 4: Открытие проекта в VS Code

1. Откройте Visual Studio Code
2. Нажмите `File` → `Open Folder`
3. Выберите папку `360-assessment-system`
4. Проект откроется в VS Code

## Шаг 5: Установка рекомендуемых расширений

При первом открытии VS Code предложит установить рекомендуемые расширения. Нажмите **"Install All"** или установите вручную:

- **ESLint** - для линтинга кода
- **Prettier** - для форматирования кода
- **Tailwind CSS IntelliSense** - для автодополнения Tailwind классов
- **ES7+ React/Redux/React-Native snippets** - для быстрого создания React компонентов
- **Auto Rename Tag** - для автоматического переименования тегов
- **TypeScript** - для поддержки TypeScript

## Шаг 6: Установка зависимостей

Откройте терминал в VS Code (`Terminal` → `New Terminal` или `` Ctrl+` ``) и выполните:

```bash
npm install
```

Дождитесь завершения установки всех пакетов (может занять несколько минут).

## Шаг 7: Запуск проекта

В терминале выполните:

```bash
npm run dev
```

После запуска вы увидите сообщение:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Шаг 8: Открытие в браузере

1. Откройте браузер (Chrome, Firefox, Safari или Edge)
2. Перейдите по адресу: `http://localhost:5173`
3. Проект должен загрузиться и отобразиться

## Возможные проблемы и решения

### Ошибка "npm command not found"
**Решение:** Убедитесь, что Node.js установлен правильно. Перезапустите терминал или компьютер.

### Ошибка установки зависимостей
**Решение:** 
- Попробуйте удалить папку `node_modules` и файл `package-lock.json`
- Выполните `npm install` снова
- Или попробуйте использовать `yarn install` вместо npm

### Порт 5173 уже занят
**Решение:** 
- Закройте другие приложения, использующие этот порт
- Или измените порт в файле `vite.config.ts`:
  ```typescript
  export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      port: 3000 // или любой другой свободный порт
    }
  });
  ```

### Ошибки TypeScript
**Решение:**
- Убедитесь, что все импорты правильные
- Проверьте, что файл `tsconfig.json` создан
- Перезапустите TypeScript сервер: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Tailwind CSS не работает
**Решение:**
- Убедитесь, что файл `globals.css` импортирован в `main.tsx`
- Проверьте, что в `vite.config.ts` подключен плагин `@tailwindcss/vite`
- Перезапустите сервер разработки

## Полезные команды

```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр production-сборки
npm run preview

# Проверка кода (если настроен ESLint)
npm run lint
```

## Работа с проектом в VS Code

### Горячие клавиши:

- `Ctrl+P` - быстрый поиск файлов
- `Ctrl+Shift+F` - поиск по всему проекту
- `Ctrl+B` - показать/скрыть боковую панель
- `` Ctrl+` `` - показать/скрыть терминал
- `F2` - переименовать символ (переменную, функцию и т.д.)
- `Ctrl+D` - выбрать следующее вхождение
- `Alt+↑/↓` - переместить строку вверх/вниз
- `Ctrl+/` - закомментировать/раскомментировать

### Рекомендации:

1. Используйте встроенный терминал VS Code для выполнения команд
2. Включите автосохранение: `File` → `Auto Save`
3. Настройте форматирование при сохранении (уже настроено в `.vscode/settings.json`)
4. Используйте Git для контроля версий

## Следующие шаги

После успешного запуска проекта вы можете:

1. Изучить структуру компонентов в папке `src/components/`
2. Просмотреть документацию в `README.md`
3. Ознакомиться с рекомендациями в `guidelines/Guidelines.md`
4. Начать разработку новых функций
5. Настроить проект под свои нужды

## Поддержка

Если возникли проблемы:

1. Проверьте, что все файлы скопированы правильно
2. Убедитесь, что версия Node.js >= 18
3. Попробуйте удалить `node_modules` и переустановить зависимости
4. Проверьте консоль браузера и терминал на наличие ошибок

Удачи в разработке! 🚀
