# Инструкция по экспорту проекта

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
├── 360-assessment-system.sln         (для Visual Studio)
├── 360-assessment-system.njsproj     (для Visual Studio)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── README.md
├── INSTALLATION_GUIDE.md
├── EXPORT_INSTRUCTIONS.md
└── VISUAL_STUDIO_GUIDE.md
```

---

## 🚀 Быстрый запуск

### Для Visual Studio Code:
```bash
cd 360-assessment-system
npm install
npm run dev
```

### Для Visual Studio:
1. Откройте файл `360-assessment-system.sln`
2. Следуйте инструкциям в `VISUAL_STUDIO_GUIDE.md`

---

Готово! 🎉 Ваш проект готов к работе в Visual Studio Code или Visual Studio!