# Backend Quick Start Guide

## 🚀 Быстрый старт для разработчиков

Это руководство поможет вам быстро начать работать с backend системы оценки компетенций 360°.

---

## 📋 Что уже готово

✅ **Supabase подключен и настроен**
✅ **Web-сервер на Hono развернут** (`/supabase/functions/server/index.tsx`)
✅ **API endpoints реализованы** (см. `BACKEND_API.md`)
✅ **Аутентификация через Supabase Auth настроена**
✅ **KV Store для хранения данных готов**
✅ **Frontend интеграция подготовлена** (`/utils/api.ts`, `/hooks/useAuth.ts`)
✅ **Компоненты Login/Signup созданы**

---

## 🔧 Первые шаги

### 1. Зарегистрируйте первого пользователя

При запуске приложения вы увидите форму входа. Нажмите **"Зарегистрироваться"** и создайте первого администратора:

```
Email: admin@example.com
Password: admin123
Имя: Администратор
Роль: Администратор
Отдел: IT
```

### 2. Войдите в систему

После регистрации вы будете автоматически перенаправлены на страницу входа. Введите свои данные для входа.

### 3. Создайте первую кампанию

Как администратор:
1. На главной странице нажмите **"Создать новую кампанию"**
2. Пройдите через мастер настройки кампании
3. Выберите участников
4. Создайте анкету с компетенциями

### 4. Отправьте оценку

Как сотрудник или оценивающий:
1. Перейдите в раздел "Мои оценки"
2. Выберите кампанию
3. Заполните анкету оценки
4. Отправьте ответы

### 5. Просмотрите отчет

Как администратор:
1. Перейдите в раздел "Отчеты"
2. Выберите кампанию и пользователя
3. Просмотрите радарные диаграммы, gap analysis и рекомендации

---

## 🏗️ Архитектура Backend

### Слои приложения

```
┌─────────────────────────────────────────────┐
│           React Frontend (App.tsx)          │
│  ┌──────────┐  ┌────────────┐  ┌─────────┐ │
│  │useAuth() │  │ api.ts     │  │Components│ │
│  └──────────┘  └────────────┘  └─────────┘ │
└─────────────────┬───────────────────────────┘
                  │ HTTPS + JWT
┌─────────────────▼───────────────────────────┐
│      Supabase Edge Function (Hono)          │
│  ┌──────────────────────────────────────┐   │
│  │  Server (index.tsx)                  │   │
│  │  - Auth endpoints                    │   │
│  │  - Campaign CRUD                     │   │
│  │  - Survey CRUD                       │   │
│  │  - Response handling                 │   │
│  │  - Report generation                 │   │
│  │  - Notifications                     │   │
│  └──────────────┬───────────────────────┘   │
└─────────────────┼───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│       Supabase PostgreSQL + KV Store        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Users   │  │Campaigns │  │Responses │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────┐                │
│  │ Surveys  │  │ Notific. │                │
│  └──────────┘  └──────────┘                │
└─────────────────────────────────────────────┘
```

### Поток данных

1. **Аутентификация**:
   - Пользователь вводит email/password
   - `useAuth()` вызывает `supabase.auth.signInWithPassword()`
   - Получает `access_token`
   - Вызывает `GET /profile` для получения данных профиля

2. **Создание кампании** (только админ):
   - Frontend вызывает `createCampaign()` из `api.ts`
   - Отправляет `POST /campaigns` с JWT токеном
   - Backend проверяет роль пользователя
   - Сохраняет в KV Store: `campaign:{uuid}`

3. **Отправка оценки**:
   - Frontend вызывает `createResponse()`
   - Отправляет `POST /responses`
   - Backend сохраняет: `response:{campaignId}:{uuid}`
   - Обновляет счетчик `completed` в кампании
   - Создает уведомление для оцениваемого

4. **Генерация отчета**:
   - Frontend вызывает `getReport(campaignId, userId)`
   - Backend:
     - Получает все ответы из KV Store
     - Вычисляет средние по компетенциям и ролям
     - Делает gap analysis (самооценка vs оценка окружающих)
     - Генерирует персонализированные рекомендации
   - Возвращает JSON с полным отчетом

---

## 🔐 Аутентификация и авторизация

### Роли пользователей

#### Администратор (`admin`)
- ✅ Создание/редактирование/удаление кампаний
- ✅ Создание/редактирование анкет
- ✅ Управление участниками
- ✅ Просмотр всех отчетов
- ✅ Отправка уведомлений
- ✅ Просмотр списка всех пользователей

#### Сотрудник (`employee`)
- ✅ Просмотр своих кампаний
- ✅ Заполнение анкет оценки
- ✅ Просмотр своих отчетов
- ✅ Получение уведомлений
- ❌ Создание кампаний
- ❌ Просмотр чужих отчетов

### Проверка прав доступа

Backend автоматически проверяет права:

```typescript
// Пример из index.tsx
const userProfile = await kv.get(`user:${user.id}`);

if (userProfile?.role !== 'admin') {
  return c.json({ error: 'Только администраторы могут создавать кампании' }, 403);
}
```

---

## 📊 Структура данных

### User
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  department: string;
  createdAt: string;
}
```

### Campaign
```typescript
{
  id: string;
  name: string;
  project: string;
  deadline: string;
  participants: Participant[];
  surveyId: string;
  status: 'draft' | 'published' | 'completed';
  createdBy: string;
  createdAt: string;
  completed: number;
  totalParticipants: number;
}
```

### Survey
```typescript
{
  id: string;
  campaignId: string;
  title: string;
  competencies: Competency[];
  createdBy: string;
  createdAt: string;
}

interface Competency {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}
```

### Response
```typescript
{
  id: string;
  campaignId: string;
  evaluatorId: string;        // кто оценивает
  evaluatedUserId: string;     // кого оценивают
  evaluatorRole: 'self' | 'manager' | 'peer' | 'subordinate' | 'client';
  responses: {
    [competencyId]: number     // оценка 1-5
  };
  submittedAt: string;
}
```

### Notification
```typescript
{
  id: string;
  userId: string;
  type: 'info' | 'new_response' | 'campaign_published' | 'deadline_reminder';
  message: string;
  campaignId?: string;
  read: boolean;
  createdAt: string;
}
```

---

## 🛠️ Работа с API из Frontend

### Пример 1: Создание кампании

```typescript
import { createCampaign } from '../utils/api';

const handleCreateCampaign = async () => {
  try {
    const { campaign } = await createCampaign({
      name: 'Q1 2024 Performance Review',
      project: 'Annual Assessment',
      deadline: '2024-03-31T23:59:59Z',
      participants: [
        { userId: 'user-123', name: 'John Doe', role: 'Evaluatee' }
      ]
    });
    
    console.log('Campaign created:', campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
  }
};
```

### Пример 2: Получение уведомлений

```typescript
import { getNotifications, markNotificationAsRead } from '../utils/api';
import { useEffect, useState } from 'react';

function NotificationsComponent() {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    loadNotifications();
  }, []);
  
  const loadNotifications = async () => {
    const { notifications } = await getNotifications();
    setNotifications(notifications);
  };
  
  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    loadNotifications();
  };
  
  return (
    <div>
      {notifications.map(notif => (
        <div key={notif.id}>
          <p>{notif.message}</p>
          {!notif.read && (
            <button onClick={() => handleMarkAsRead(notif.id)}>
              Отметить как прочитанное
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Пример 3: Генерация и отображение отчета

```typescript
import { getReport } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

function ReportComponent({ campaignId }: { campaignId: string }) {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  
  useEffect(() => {
    loadReport();
  }, [campaignId]);
  
  const loadReport = async () => {
    if (!user) return;
    
    const { report } = await getReport(campaignId, user.id);
    setReport(report);
  };
  
  if (!report) return <div>Загрузка...</div>;
  
  return (
    <div>
      <h2>Отчет по компетенциям</h2>
      
      <h3>Средние оценки</h3>
      {Object.values(report.competencyAverages).map(comp => (
        <div key={comp.name}>
          <p>{comp.name}: {comp.overall.toFixed(2)}</p>
        </div>
      ))}
      
      <h3>Gap Analysis</h3>
      {Object.values(report.gapAnalysis).map(gap => (
        <div key={gap.name}>
          <p>{gap.name}</p>
          <p>Самооценка: {gap.selfScore.toFixed(2)}</p>
          <p>Оценка окружающих: {gap.othersScore.toFixed(2)}</p>
          <p>Разрыв: {gap.gap.toFixed(2)}</p>
        </div>
      ))}
      
      <h3>Рекомендации</h3>
      <ul>
        {report.recommendations.map((rec, i) => (
          <li key={i}>{rec}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🐛 Отладка

### Проверка здоровья сервера

```typescript
import { healthCheck } from '../utils/api';

const checkServer = async () => {
  try {
    const health = await healthCheck();
    console.log('Server status:', health.status);
    console.log('Server time:', health.timestamp);
  } catch (error) {
    console.error('Server is down:', error);
  }
};
```

### Просмотр логов

Логи сервера доступны в Supabase Dashboard:
1. Откройте Supabase Dashboard
2. Перейдите в **Edge Functions** → **make-server-9d167e02**
3. Нажмите **Logs**

### Распространенные ошибки

#### 401 Unauthorized
```
Причина: Нет или истек access_token
Решение: Проверьте, что вызвали setAccessToken() после входа
```

#### 403 Forbidden
```
Причина: Недостаточно прав (например, сотрудник пытается создать кампанию)
Решение: Проверьте роль пользователя в профиле
```

#### 404 Not Found
```
Причина: Ресурс не существует (кампания, анкета, уведомление)
Решение: Проверьте правильность ID
```

---

## 📈 Следующие шаги

### Для Frontend разработчиков:
1. Интегрируйте API вызовы в существующие компоненты
2. Добавьте обработку ошибок и loading states
3. Реализуйте real-time обновления уведомлений
4. Создайте visualizations для отчетов (радарные диаграммы)

### Для Backend разработчиков:
1. Добавьте валидацию данных с помощью библиотеки типа Zod
2. Реализуйте пагинацию для больших списков
3. Настройте Supabase Storage для файлов
4. Добавьте экспорт отчетов в PDF
5. Настройте email сервер для уведомлений

### Для DevOps:
1. Настройте CI/CD для автоматического деплоя
2. Добавьте мониторинг и алерты
3. Настройте backup стратегию для KV Store
4. Оптимизируйте производительность запросов

---

## 📚 Дополнительные ресурсы

- **Полная API документация**: `BACKEND_API.md`
- **Supabase документация**: https://supabase.com/docs
- **Hono документация**: https://hono.dev/
- **Типы TypeScript**: `/utils/api.ts`

---

## ❓ FAQ

**Q: Можно ли изменить структуру базы данных?**
A: Да, но используйте только KV Store. Создание новых таблиц через миграции не поддерживается в Figma Make.

**Q: Как добавить новую роль оценивающего?**
A: Обновите тип `evaluatorRole` в `Response` и добавьте обработку в логику генерации отчетов.

**Q: Как настроить email уведомления?**
A: Следуйте инструкциям Supabase для настройки SMTP сервера, затем используйте Supabase Auth для отправки email.

**Q: Можно ли использовать эту систему в production?**
A: Система готова для прототипирования. Для production рекомендуется:
  - Настроить Row Level Security (RLS) в Supabase
  - Добавить rate limiting
  - Настроить backup и disaster recovery
  - Провести security audit

---

**Удачи в разработке! 🎉**
