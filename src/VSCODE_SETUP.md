# Инструкции по экспорту в VS Code

## 📦 Шаг 1: Экспорт проекта

1. **Скачайте все файлы проекта** из Figma Make
2. **Сохраните в папку** `360-assessment-system`

## 🔧 Шаг 2: Откройте в VS Code

```bash
# Перейдите в папку проекта
cd 360-assessment-system

# Откройте в VS Code
code .
```

## 📦 Шаг 3: Установите зависимости

Откройте терминал в VS Code (Ctrl+` или View → Terminal) и выполните:

```bash
npm install
```

Это установит все необходимые пакеты из `package.json`:
- React, React-DOM
- TypeScript
- Vite
- Tailwind CSS
- UI компоненты (Shadcn)
- Recharts
- Lucide Icons
- И другие...

## ⚙️ Шаг 4: Установите рекомендуемые расширения

VS Code автоматически предложит установить расширения из `.vscode/extensions.json`:

1. **ESLint** - линтер для JavaScript/TypeScript
2. **Prettier** - форматирование кода
3. **Tailwind CSS IntelliSense** - автодополнение Tailwind
4. **TypeScript Vue Plugin (Volar)** - поддержка TypeScript

Нажмите **"Install All"** когда появится уведомление.

## 🚀 Шаг 5: Запустите dev сервер

```bash
npm run dev
```

Проект запустится на `http://localhost:5173`

## 🔐 Шаг 6: Настройте Supabase

1. **Откройте приложение** в браузере
2. **Система покажет модальное окно** для подключения Supabase
3. **Следуйте инструкциям:**
   - Зарегистрируйтесь на [supabase.com](https://supabase.com)
   - Создайте новый проект
   - Скопируйте **Project URL** и **Anon Key**
   - Вставьте в модальное окно

## 📧 Шаг 7: Настройте Email (опционально)

Для отправки уведомлений:

1. **Зарегистрируйтесь** на [resend.com](https://resend.com/signup)
2. **Создайте API ключ** (начинается с `re_`)
3. **В приложении:**
   - Перейдите в "Уведомления"
   - Нажмите "Добавить API ключ Resend"
   - Вставьте ключ

## 🧪 Шаг 8: Войдите в систему

Используйте тестовый аккаунт:

**Администратор:**
- Email: `admin@company.com`
- Пароль: `admin123`

**Сотрудник:**
- Email: `ivan.petrov@company.com`
- Пароль: `user123`

## 📁 Структура проекта в VS Code

```
360-assessment-system/
├── .vscode/                    # Настройки VS Code
│   ├── extensions.json        # Рекомендуемые расширения
│   └── settings.json          # Настройки проекта
├── components/                # React компоненты
│   ├── ui/                   # UI библиотека
│   ├── Dashboard.tsx
│   ├── CampaignWizard.tsx
│   └── ...
├── supabase/                 # Backend
│   └── functions/
│       └── server/
│           ├── index.tsx     # API endpoints
│           └── kv_store.tsx  # Хранилище
├── utils/                    # Утилиты
├── hooks/                    # React hooks
├── styles/                   # Стили
├── App.tsx                   # Главный компонент
├── package.json              # Зависимости
├── tsconfig.json             # TypeScript конфиг
├── vite.config.ts            # Vite конфиг
├── tailwind.config.js        # Tailwind конфиг
└── README_VSCODE.md          # Эта инструкция
```

## 🛠️ Полезные команды VS Code

### Терминал
- `Ctrl+\`` - Открыть/закрыть терминал
- `Ctrl+Shift+\`` - Создать новый терминал

### Навигация
- `Ctrl+P` - Быстрый поиск файлов
- `Ctrl+Shift+F` - Поиск по всем файлам
- `F12` - Перейти к определению
- `Alt+Left/Right` - Назад/вперед по истории

### Редактирование
- `Ctrl+D` - Выделить следующее вхождение
- `Ctrl+/` - Закомментировать строку
- `Alt+Up/Down` - Переместить строку
- `Shift+Alt+F` - Форматировать документ

### Отладка
- `F5` - Запустить отладку
- `F9` - Установить breakpoint
- `F10` - Step over
- `F11` - Step into

## 📖 Полезные документы в проекте

- `README_VSCODE.md` (этот файл) - Инструкции для VS Code
- `QUICK_START.md` - Быстрый старт
- `BACKEND_API.md` - Документация API
- `INSTALLATION_GUIDE.md` - Детальная установка
- `TROUBLESHOOTING.md` - Решение проблем

## 🔍 Отладка в VS Code

### Создайте `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### Запустите отладку:
1. Установите breakpoint в коде (F9)
2. Нажмите F5
3. Chrome откроется с подключенным отладчиком

## 🎨 Настройка форматирования

Создайте `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

## 🐛 Решение проблем

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript ошибки
```bash
# Перезапустите TypeScript сервер
# В VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Порт занят
```bash
# Измените порт в package.json:
"dev": "vite --port 3000"
```

### ESLint не работает
```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## ✅ Чеклист готовности

- [ ] Установлен Node.js 18+
- [ ] Установлены зависимости (`npm install`)
- [ ] Установлены расширения VS Code
- [ ] Проект запускается (`npm run dev`)
- [ ] Настроен Supabase
- [ ] Настроен Resend (опционально)
- [ ] Можете войти в систему
- [ ] Можете создать кампанию
- [ ] Можете пройти оценку

## 🎓 Полезные ресурсы

- [VS Code документация](https://code.visualstudio.com/docs)
- [Vite документация](https://vitejs.dev)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript в VS Code](https://code.visualstudio.com/docs/languages/typescript)

## 💡 Советы по работе

1. **Используйте TypeScript** - он помогает избежать ошибок
2. **Установите React DevTools** в Chrome
3. **Используйте Git** для версионирования
4. **Форматируйте код** регулярно (Shift+Alt+F)
5. **Читайте консоль браузера** (F12) для отладки

---

**Готово! Теперь вы можете разрабатывать проект в VS Code** 🚀
