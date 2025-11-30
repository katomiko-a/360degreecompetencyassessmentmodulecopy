# 🚀 Быстрый старт

## Для тех, кто спешит

### Шаг 1: Скачайте проект
Скачайте все файлы из Figma Make на ваш компьютер.

### Шаг 2: Выберите IDE

#### ✅ Visual Studio Code (Рекомендуется для React)
```bash
# 1. Откройте папку проекта
cd 360-assessment-system
code .

# 2. Установите зависимости
npm install

# 3. Запустите проект
npm run dev

# 4. Откройте браузер
# http://localhost:5173
```

#### ✅ Visual Studio (Полная IDE от Microsoft)
1. Дважды кликните на файл `360-assessment-system.sln`
2. Откройте терминал в Visual Studio
3. Выполните: `npm install`
4. Нажмите F5 или выполните: `npm run dev`

---

## 📋 Требования

- Node.js 18+ ([скачать](https://nodejs.org/))
- Visual Studio Code ([скачать](https://code.visualstudio.com/))
  - ИЛИ
- Visual Studio 2019/2022 ([скачать](https://visualstudio.microsoft.com/))

---

## 📚 Подробная документация

- **Visual Studio Code:** читайте `INSTALLATION_GUIDE.md`
- **Visual Studio:** читайте `VISUAL_STUDIO_GUIDE.md`
- **Структура проекта:** читайте `README.md`
- **Экспорт файлов:** читайте `EXPORT_INSTRUCTIONS.md`

---

## ⚡ Команды

```bash
npm install          # Установить зависимости
npm run dev          # Запустить в режиме разработки
npm run build        # Собрать для продакшена
npm run preview      # Предпросмотр production-сборки
```

---

## 🆘 Проблемы?

### "npm command not found"
→ Установите Node.js: https://nodejs.org/

### Порт 5173 занят
→ Закройте другие приложения или измените порт в `vite.config.ts`

### Ошибки импорта
→ Убедитесь, что все файлы скопированы в правильные папки (см. `EXPORT_INSTRUCTIONS.md`)

### Другие проблемы
→ Читайте `INSTALLATION_GUIDE.md` или `VISUAL_STUDIO_GUIDE.md`

---

## 📁 Структура файлов (кратко)

```
360-assessment-system/
├── src/
│   ├── App.tsx                    # Главный компонент
│   ├── main.tsx                   # Точка входа
│   ├── components/                # Компоненты
│   └── styles/                    # Стили
├── index.html                     # HTML шаблон
├── package.json                   # Зависимости
├── vite.config.ts                 # Конфигурация Vite
├── tsconfig.json                  # Конфигурация TypeScript
└── 360-assessment-system.sln      # Для Visual Studio
```

---

**Готово!** Теперь вы можете начать разработку! 🎉

Для детальных инструкций откройте соответствующий MD-файл из списка выше.
