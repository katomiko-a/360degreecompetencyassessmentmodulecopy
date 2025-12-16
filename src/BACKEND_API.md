# Backend API Documentation

## Описание

Backend система для модуля оценки компетенций 360 градусов построена на базе Supabase Edge Functions с использованием фреймворка Hono. Система предоставляет RESTful API для управления кампаниями оценки, анкетами, ответами и уведомлениями.

## Технологический стек

- **Платформа**: Supabase Edge Functions (Deno runtime)
- **Web-фреймворк**: Hono
- **База данных**: Supabase PostgreSQL (KV Store)
- **Аутентификация**: Supabase Auth
- **Язык**: TypeScript

## Базовый URL

```
https://{projectId}.supabase.co/functions/v1/make-server-9d167e02
```

## Аутентификация

Все защищенные endpoints требуют JWT токен в заголовке Authorization:

```
Authorization: Bearer {access_token}
```

Токен получается после успешного входа через Supabase Auth.

---

## API Endpoints

### 🔐 Аутентификация

#### POST /signup
Регистрация нового пользователя в системе.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Иван Иванов",
  "role": "employee",  // "admin" или "employee"
  "department": "IT"   // опционально
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Иван Иванов",
    "role": "employee"
  }
}
```

**Примечания:**
- Email автоматически подтверждается (email_confirm: true)
- Пароль должен быть минимум 6 символов

---

#### GET /profile
Получение профиля текущего пользователя.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Иван Иванов",
    "role": "employee",
    "department": "IT",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### 📋 Кампании оценки

#### GET /campaigns
Получение списка всех кампаний.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "campaigns": [
    {
      "id": "uuid",
      "name": "Оценка Q1 2024",
      "project": "Годовая оценка",
      "deadline": "2024-03-31T23:59:59Z",
      "participants": [...],
      "surveyId": "uuid",
      "status": "published",
      "createdBy": "uuid",
      "createdAt": "2024-01-15T10:00:00Z",
      "completed": 15,
      "totalParticipants": 25
    }
  ]
}
```

**Фильтрация:**
- **Администраторы**: видят все кампании
- **Сотрудники**: видят только кампании, где они участники

---

#### GET /campaigns/:id
Получение одной кампании по ID.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "campaign": {
    "id": "uuid",
    "name": "Оценка Q1 2024",
    ...
  }
}
```

---

#### POST /campaigns
Создание новой кампании (только для администраторов).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "Оценка Q2 2024",
  "project": "Квартальная оценка",
  "deadline": "2024-06-30T23:59:59Z",
  "participants": [
    {
      "userId": "uuid",
      "name": "Петр Петров",
      "role": "Оцениваемый"
    }
  ],
  "surveyId": "uuid"  // опционально
}
```

**Response:**
```json
{
  "success": true,
  "campaign": {
    "id": "uuid",
    "name": "Оценка Q2 2024",
    ...
  }
}
```

---

#### PUT /campaigns/:id
Обновление кампании (только для администраторов).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "status": "published",
  "deadline": "2024-07-15T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "campaign": {
    ...
  }
}
```

---

#### DELETE /campaigns/:id
Удаление кампании и всех связанных ответов (только для администраторов).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true
}
```

---

### 📝 Анкеты (Surveys)

#### GET /surveys/:campaignId
Получение анкеты для кампании.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "survey": {
    "id": "uuid",
    "campaignId": "uuid",
    "title": "Оценка компетенций",
    "competencies": [
      {
        "id": "comp1",
        "name": "Лидерство",
        "description": "Способность вдохновлять и направлять команду",
        "questions": [
          {
            "id": "q1",
            "text": "Эффективно делегирует задачи",
            "scale": 5
          }
        ]
      }
    ],
    "createdBy": "uuid",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

#### POST /surveys
Создание новой анкеты (только для администраторов).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "campaignId": "uuid",
  "title": "Оценка компетенций 2024",
  "competencies": [
    {
      "id": "comp1",
      "name": "Коммуникация",
      "description": "Навыки общения",
      "questions": [
        {
          "id": "q1",
          "text": "Четко выражает свои мысли",
          "scale": 5
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "survey": {
    ...
  }
}
```

---

#### PUT /surveys/:id
Обновление анкеты (только для администраторов).

---

### ✅ Ответы (Responses)

#### GET /responses/:campaignId
Получение всех ответов для кампании.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "responses": [
    {
      "id": "uuid",
      "campaignId": "uuid",
      "evaluatorId": "uuid",
      "evaluatedUserId": "uuid",
      "evaluatorRole": "peer",
      "responses": {
        "comp1": 4,
        "comp2": 5,
        "comp3": 3
      },
      "submittedAt": "2024-02-01T15:30:00Z"
    }
  ]
}
```

**Фильтрация:**
- **Администраторы**: видят все ответы
- **Сотрудники**: видят только свои ответы и ответы о себе

---

#### POST /responses
Отправка нового ответа на оценку.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "campaignId": "uuid",
  "evaluatedUserId": "uuid",
  "evaluatorRole": "peer",  // "self" | "manager" | "peer" | "subordinate" | "client"
  "responses": {
    "comp1": 4,
    "comp2": 5,
    "comp3": 3
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    ...
  }
}
```

**Побочные эффекты:**
- Обновляется счетчик completed в кампании
- Создается уведомление для оцениваемого пользователя

---

### 📊 Отчеты (Reports)

#### GET /reports/:campaignId/:userId
Генерация детального отчета для пользователя.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "report": {
    "campaignId": "uuid",
    "userId": "uuid",
    "campaign": {...},
    "survey": {...},
    "responsesCount": 12,
    "responsesByRole": {
      "self": 1,
      "manager": 2,
      "peer": 7,
      "subordinate": 2
    },
    "competencyAverages": {
      "comp1": {
        "name": "Лидерство",
        "overall": 4.2,
        "byRole": {
          "self": 4.5,
          "manager": 4.0,
          "peer": 4.1,
          "subordinate": 4.3
        }
      }
    },
    "gapAnalysis": {
      "comp1": {
        "name": "Лидерство",
        "selfScore": 4.5,
        "othersScore": 4.13,
        "gap": 0.37
      }
    },
    "recommendations": [
      "Переоценка компетенции \"Планирование\": ваша самооценка выше оценки окружающих на 1.2 балла...",
      "Компетенция \"Коммуникация\" требует развития. Средняя оценка окружающих: 2.8..."
    ],
    "generatedAt": "2024-03-15T10:00:00Z"
  }
}
```

**Права доступа:**
- **Администраторы**: могут просматривать отчеты всех пользователей
- **Сотрудники**: могут просматривать только свои отчеты

---

### 🔔 Уведомления (Notifications)

#### GET /notifications
Получение уведомлений текущего пользователя.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "userId": "uuid",
      "type": "new_response",
      "message": "Получена новая оценка от peer",
      "campaignId": "uuid",
      "read": false,
      "createdAt": "2024-02-15T14:20:00Z"
    }
  ]
}
```

**Типы уведомлений:**
- `info` - информационное
- `new_response` - новая оценка получена
- `campaign_published` - кампания опубликована
- `deadline_reminder` - напоминание о дедлайне

---

#### PUT /notifications/:id/read
Отметить уведомление как прочитанное.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true
}
```

---

#### POST /notifications
Создание уведомления (только для администраторов).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "userId": "uuid",
  "type": "info",
  "message": "Новая кампания оценки доступна",
  "campaignId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "notification": {
    ...
  }
}
```

---

### 👥 Пользователи (Users)

#### GET /users
Получение списка всех пользователей (только для администраторов).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "name": "Иван Иванов",
      "email": "ivan@example.com",
      "role": "employee",
      "department": "IT"
    }
  ]
}
```

---

### 🏥 Health Check

#### GET /health
Проверка состояния сервера.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-03-15T10:00:00Z"
}
```

---

## Коды ошибок

| Код | Описание |
|-----|----------|
| 400 | Bad Request - неверные параметры запроса |
| 401 | Unauthorized - не авторизован |
| 403 | Forbidden - недостаточно прав |
| 404 | Not Found - ресурс не найден |
| 500 | Internal Server Error - внутренняя ошибка сервера |

---

## Структура данных в KV Store

### Ключи:

- `user:{userId}` - профиль пользователя
- `campaign:{campaignId}` - кампания оценки
- `survey:{surveyId}` - анкета
- `response:{campaignId}:{responseId}` - ответ на оценку
- `notification:{userId}:{notificationId}` - уведомление

### Префиксы для поиска:

- `user:` - все пользователи
- `campaign:` - все кампании
- `response:{campaignId}:` - все ответы для кампании
- `notification:{userId}:` - все уведомления пользователя

---

## Примеры использования

### 1. Регистрация и вход

```typescript
// Регистрация
const signupResponse = await signup({
  email: 'john@example.com',
  password: 'secure123',
  name: 'John Doe',
  role: 'employee',
  department: 'Sales'
});

// Вход через Supabase Auth (на клиенте)
const { data: { session } } = await supabase.auth.signInWithPassword({
  email: 'john@example.com',
  password: 'secure123'
});

setAccessToken(session.access_token);

// Получение профиля
const { profile } = await getProfile();
```

### 2. Создание кампании и анкеты

```typescript
// Создать кампанию
const { campaign } = await createCampaign({
  name: 'Q1 2024 Assessment',
  project: 'Annual Review',
  deadline: '2024-03-31T23:59:59Z',
  participants: [
    { userId: 'user-1', name: 'Alice', role: 'Evaluatee' },
    { userId: 'user-2', name: 'Bob', role: 'Evaluator' }
  ]
});

// Создать анкету для кампании
const { survey } = await createSurvey({
  campaignId: campaign.id,
  title: 'Leadership Assessment',
  competencies: [
    {
      id: 'leadership',
      name: 'Лидерство',
      questions: [
        { id: 'q1', text: 'Вдохновляет команду', scale: 5 }
      ]
    }
  ]
});
```

### 3. Отправка оценки

```typescript
const { response } = await createResponse({
  campaignId: 'campaign-uuid',
  evaluatedUserId: 'user-to-evaluate-uuid',
  evaluatorRole: 'peer',
  responses: {
    'leadership': 4,
    'communication': 5,
    'teamwork': 4
  }
});
```

### 4. Получение отчета

```typescript
const { report } = await getReport('campaign-uuid', 'user-uuid');

console.log('Gap Analysis:', report.gapAnalysis);
console.log('Recommendations:', report.recommendations);
```

---

## Логирование

Все ошибки логируются в консоль с контекстной информацией:

```
Ошибка при создании кампании: Error message
Authorization error while signing in user during main login flow: Error details
```

---

## Безопасность

1. **Аутентификация**: JWT токены через Supabase Auth
2. **Авторизация**: Row-level проверка прав доступа
3. **Валидация**: Проверка всех входных данных
4. **CORS**: Открытые заголовки для веб-приложения
5. **Rate Limiting**: Обеспечивается Supabase Edge Functions

---

## Ограничения

1. Используется KV Store вместо реляционной базы данных
2. Файловые операции разрешены только в `/tmp`
3. Нет поддержки blob storage (можно добавить при необходимости)
4. Email уведомления не настроены (email_confirm: true)

---

## Дальнейшие улучшения

- [ ] Добавить Supabase Storage для файлов отчетов
- [ ] Настроить email сервер для уведомлений
- [ ] Добавить пагинацию для больших списков
- [ ] Реализовать кеширование часто используемых данных
- [ ] Добавить rate limiting на уровне приложения
- [ ] Внедрить WebSocket для realtime уведомлений
- [ ] Добавить экспорт отчетов в PDF/Excel

---

## Контакты и поддержка

Для вопросов и поддержки обращайтесь к администратору системы.
