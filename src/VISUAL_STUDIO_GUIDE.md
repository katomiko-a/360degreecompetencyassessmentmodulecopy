# Руководство по работе с проектом в Visual Studio

## Важно: Visual Studio vs Visual Studio Code

Этот проект можно открыть в двух разных IDE:

### 1. **Visual Studio Code** (рекомендуется для React проектов)
- Легкий редактор кода
- Отлично подходит для JavaScript/TypeScript/React
- **Не требует .sln файлов**
- Используйте инструкцию из `INSTALLATION_GUIDE.md`

### 2. **Visual Studio** (полноценная IDE)
- Тяжелая IDE от Microsoft
- Обычно используется для .NET проектов
- Поддерживает Node.js проекты через расширение
- **Требует .sln и .njsproj файлы** (уже созданы)

---

## Открытие проекта в Visual Studio (полная IDE)

### Предварительные требования

1. **Visual Studio 2019/2022** (Community, Professional или Enterprise)
   - Скачать: https://visualstudio.microsoft.com/

2. **Node.js Development Workload**
   - При установке Visual Studio выберите:
     - ✅ Node.js development
     - ✅ TypeScript and JavaScript language support
   
   Или добавьте через Visual Studio Installer:
   - Откройте Visual Studio Installer
   - Нажмите "Modify" для вашей версии VS
   - Выберите "Node.js development"
   - Нажмите "Modify" для установки

3. **Node.js** (версия 18 или выше)
   - Скачать: https://nodejs.org/

### Шаги открытия проекта

#### Вариант 1: Открыть через файл .sln

1. Найдите файл `360-assessment-system.sln` в папке проекта
2. Дважды кликните по нему
3. Проект откроется в Visual Studio

#### Вариант 2: Открыть через меню Visual Studio

1. Запустите Visual Studio
2. Выберите `File` → `Open` → `Project/Solution`
3. Найдите и выберите `360-assessment-system.sln`
4. Нажмите "Open"

### Первый запуск

После открытия проекта:

1. **Откройте Package Manager Console:**
   - `Tools` → `NuGet Package Manager` → `Package Manager Console`
   - Или используйте встроенный терминал: `View` → `Terminal`

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Запустите проект:**
   - Нажмите `F5` или кнопку "Start" (зеленый треугольник)
   - Или выполните в терминале:
     ```bash
     npm run dev
     ```

4. **Откройте в браузере:**
   - Visual Studio может автоматически открыть браузер
   - Или перейдите вручную: `http://localhost:5173`

### Структура проекта в Solution Explorer

```
Solution '360-assessment-system'
└── 360-assessment-system (Node.js Project)
    ├── .vscode/
    │   ├── extensions.json
    │   └── settings.json
    ├── components/
    │   ├── ui/
    │   │   └── (все UI компоненты)
    │   ├── figma/
    │   │   └── ImageWithFallback.tsx
    │   ├── Dashboard.tsx
    │   ├── CampaignWizard.tsx
    │   └── (остальные компоненты)
    ├── guidelines/
    │   └── Guidelines.md
    ├── src/
    │   └── main.tsx
    ├── styles/
    │   └── globals.css
    ├── App.tsx
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

### Полезные функции Visual Studio

#### 1. IntelliSense
- Автодополнение кода работает автоматически
- Наведите на переменную для просмотра типа
- `Ctrl+Space` для вызова списка автодополнения

#### 2. Отладка
- Поставьте точки останова (F9)
- Запустите проект с отладкой (F5)
- Используйте окно "Locals" для просмотра переменных

#### 3. Рефакторинг
- `F2` - переименовать символ
- `Ctrl+.` - быстрые действия и рефакторинг
- `Ctrl+R, Ctrl+R` - переименовать во всех файлах

#### 4. Навигация
- `Ctrl+,` - быстрый поиск файлов и символов
- `F12` - перейти к определению
- `Ctrl+-` - вернуться назад
- `Ctrl+Shift+F` - поиск по всем файлам

#### 5. Встроенный терминал
- `View` → `Terminal`
- Или `Ctrl+`` (обратная кавычка)
- Выполняйте npm команды прямо из IDE

### Настройка проекта в Visual Studio

#### Изменение порта разработки

1. Откройте `vite.config.ts`
2. Добавьте настройку порта:
   ```typescript
   export default defineConfig({
     plugins: [react(), tailwindcss()],
     server: {
       port: 3000 // измените на нужный порт
     }
   });
   ```

#### Настройка запуска

1. Правой кнопкой на проект → `Properties`
2. В секции "Debugging":
   - Node exe path: `npm`
   - Script arguments: `run dev`
   - Launch URL: `http://localhost:5173`

### Команды npm в Visual Studio

Выполняйте в терминале (`View` → `Terminal`):

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр production-сборки
npm run preview

# Проверка типов TypeScript
npx tsc --noEmit
```

### Работа с Git в Visual Studio

Visual Studio имеет встроенную поддержку Git:

1. **Team Explorer:**
   - `View` → `Team Explorer`
   - Здесь можно делать commit, push, pull и т.д.

2. **Git Changes:**
   - `View` → `Git Changes`
   - Современный интерфейс для работы с Git

3. **Клонирование репозитория:**
   - `File` → `Clone Repository`
   - Введите URL и нажмите "Clone"

### Расширения для Visual Studio

Рекомендуемые расширения:

1. **Node.js Tools for Visual Studio**
   - Уже включено в Node.js workload

2. **Web Essentials**
   - Дополнительные инструменты для веб-разработки

3. **Prettier**
   - Форматирование кода
   - https://marketplace.visualstudio.com/items?itemName=MadsKristensen.JavaScriptPrettier

### Горячие клавиши Visual Studio

| Действие | Комбинация |
|----------|------------|
| Запуск проекта | `F5` |
| Запуск без отладки | `Ctrl+F5` |
| Остановка | `Shift+F5` |
| Точка останова | `F9` |
| Перейти к определению | `F12` |
| Найти все ссылки | `Shift+F12` |
| Переименовать | `F2` или `Ctrl+R,R` |
| Форматировать документ | `Ctrl+K, Ctrl+D` |
| Комментарий | `Ctrl+K, Ctrl+C` |
| Раскомментировать | `Ctrl+K, Ctrl+U` |
| Быстрый поиск | `Ctrl+,` |
| Поиск в файлах | `Ctrl+Shift+F` |
| Показать терминал | `Ctrl+`` |

---

## Открытие проекта в Visual Studio Code (рекомендуется)

Если вы предпочитаете **Visual Studio Code** (более легкий и популярный для React):

1. **Откройте VS Code**

2. **Откройте папку проекта:**
   - `File` → `Open Folder`
   - Выберите папку `360-assessment-system`

3. **Установите зависимости:**
   - Откройте терминал: `` Ctrl+` ``
   - Выполните: `npm install`

4. **Запустите проект:**
   ```bash
   npm run dev
   ```

5. **Следуйте инструкции:**
   - См. файл `INSTALLATION_GUIDE.md`

### Преимущества VS Code для этого проекта:

✅ Легче и быстрее  
✅ Лучшая поддержка React и TypeScript  
✅ Огромная экосистема расширений  
✅ Бесплатный и open-source  
✅ Более популярен среди React-разработчиков  

---

## Возможные проблемы в Visual Studio

### Проблема 1: "Node.js Tools not installed"

**Решение:**
1. Откройте Visual Studio Installer
2. Нажмите "Modify"
3. Выберите "Node.js development"
4. Установите

### Проблема 2: Не работает IntelliSense для TypeScript

**Решение:**
1. Убедитесь, что файл `tsconfig.json` в корне проекта
2. Перезапустите Visual Studio
3. `Tools` → `Options` → `Text Editor` → `JavaScript/TypeScript` → проверьте настройки

### Проблема 3: Не запускается проект (F5)

**Решение:**
1. Проверьте, что Node.js установлен
2. Выполните `npm install` в терминале
3. Проверьте настройки проекта (Properties → Debugging)
4. Попробуйте запустить вручную: `npm run dev` в терминале

### Проблема 4: Порт уже занят

**Решение:**
1. Закройте другие приложения на порту 5173
2. Или измените порт в `vite.config.ts`
3. Или убейте процесс:
   ```bash
   # Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

### Проблема 5: Ошибки TypeScript в IDE, но проект работает

**Решение:**
1. Перезагрузите окно TypeScript: `Edit` → `IntelliSense` → `Refresh Local Cache`
2. Или перезапустите Visual Studio
3. Убедитесь, что версия TypeScript актуальна

---

## Сравнение: Visual Studio vs Visual Studio Code

| Функция | Visual Studio | Visual Studio Code |
|---------|---------------|-------------------|
| Размер | ~10-20 GB | ~200 MB |
| Скорость | Медленная | Быстрая |
| React/TypeScript | Хорошо | Отлично |
| Бесплатность | Community бесплатна | Полностью бесплатен |
| Отладка | Мощная | Хорошая |
| Расширения | Меньше | Огромное количество |
| Рекомендация для React | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Вывод:** Для React-проектов рекомендуется использовать **Visual Studio Code**.

---

## Дополнительные ресурсы

- [Visual Studio Documentation](https://docs.microsoft.com/en-us/visualstudio/)
- [Node.js Tools for Visual Studio](https://github.com/microsoft/nodejstools)
- [TypeScript in Visual Studio](https://docs.microsoft.com/en-us/visualstudio/javascript/tutorial-nodejs-with-react-and-jsx)
- [Visual Studio Code Documentation](https://code.visualstudio.com/docs)

---

## Заключение

Файлы `.sln` и `.njsproj` созданы для совместимости с Visual Studio. Однако для разработки React-приложений **настоятельно рекомендуется использовать Visual Studio Code**, так как он более легкий, быстрый и лучше подходит для современной веб-разработки.

Если вы всё же хотите использовать Visual Studio, следуйте инструкциям выше. Проект полностью совместим с обеими IDE! 🚀
