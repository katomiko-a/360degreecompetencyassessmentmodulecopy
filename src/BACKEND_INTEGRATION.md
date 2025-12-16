# Backend Integration Guide

## Руководство по интеграции компонентов с Backend API

Это руководство показывает, как обновить существующие компоненты для работы с реальным backend вместо моковых данных.

---

## 📊 Текущее состояние

### Что уже готово ✅

- ✅ Backend API сервер развернут (`/supabase/functions/server/index.tsx`)
- ✅ API клиент готов (`/utils/api.ts`)
- ✅ Аутентификация реализована (`/hooks/useAuth.ts`)
- ✅ Компоненты Login/Signup созданы
- ✅ App.tsx обновлен для работы с auth

### Что нужно обновить 🔄

- 🔄 Dashboard - заменить моковые данные на API вызовы
- 🔄 CampaignWizard - интегрировать создание кампаний через API
- 🔄 ParticipantsManagement - подключить к `/users` endpoint
- 🔄 SurveyManagement - использовать `/surveys` API
- 🔄 TakeAssessment - отправлять ответы через `/responses`
- 🔄 AssessmentResults - получать данные из `/reports`
- 🔄 NotificationsManagement - работать с `/notifications`
- 🔄 UserProfile - загружать данные из `/profile`

---

## 🔧 Шаблоны интеграции

### 1. Dashboard Component

**До (моковые данные):**
```typescript
const [assessments, setAssessments] = useState([
  { id: '1', name: 'Mock Assessment', status: 'active' }
]);
```

**После (с API):**
```typescript
import { getCampaigns } from '../utils/api';
import { useEffect, useState } from 'react';

function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const { campaigns } = await getCampaigns();
      setCampaigns(campaigns);
    } catch (err) {
      console.error('Error loading campaigns:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      {campaigns.map(campaign => (
        <div key={campaign.id}>
          <h3>{campaign.name}</h3>
          <p>Статус: {campaign.status}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### 2. CampaignWizard Component

**Создание кампании:**
```typescript
import { createCampaign, createSurvey } from '../utils/api';
import { toast } from 'sonner';

function CampaignWizard() {
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: '',
    project: '',
    deadline: '',
    participants: []
  });
  const [surveyData, setSurveyData] = useState({
    title: '',
    competencies: []
  });

  const handleCreateCampaign = async () => {
    try {
      // Шаг 1: Создаем кампанию
      const { campaign } = await createCampaign({
        name: campaignData.name,
        project: campaignData.project,
        deadline: campaignData.deadline,
        participants: campaignData.participants
      });

      // Шаг 2: Создаем анкету для кампании
      const { survey } = await createSurvey({
        campaignId: campaign.id,
        title: surveyData.title,
        competencies: surveyData.competencies
      });

      toast.success('Кампания успешно создана!');
      
      // Возвращаемся на дашборд или переходим к следующему шагу
      onNavigate('dashboard');
      
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Ошибка при создании кампании: ' + error.message);
    }
  };

  return (
    <div>
      {/* Wizard UI */}
      <button onClick={handleCreateCampaign}>
        Создать кампанию
      </button>
    </div>
  );
}
```

---

### 3. TakeAssessment Component

**Отправка оценки:**
```typescript
import { createResponse } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

function TakeAssessment({ assessment }) {
  const { user } = useAuth();
  const [responses, setResponses] = useState({});
  const [evaluatedUserId, setEvaluatedUserId] = useState('');
  const [evaluatorRole, setEvaluatorRole] = useState('peer');

  const handleSubmit = async () => {
    try {
      await createResponse({
        campaignId: assessment.id,
        evaluatedUserId,
        evaluatorRole,
        responses  // { competencyId: rating }
      });

      toast.success('Оценка отправлена!');
      onBack();
      
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Ошибка при отправке оценки: ' + error.message);
    }
  };

  return (
    <div>
      {/* Assessment form UI */}
      <button onClick={handleSubmit}>
        Отправить оценку
      </button>
    </div>
  );
}
```

---

### 4. DetailedReports Component

**Загрузка отчета:**
```typescript
import { getReport } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';

function DetailedReports({ assessment }) {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [assessment.id, user?.id]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const { report } = await getReport(assessment.id, user.id);
      setReport(report);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Генерация отчета...</div>;
  if (!report) return <div>Нет данных для отчета</div>;

  return (
    <div>
      <h2>Отчет по компетенциям</h2>
      
      {/* Средние оценки */}
      <section>
        <h3>Средние оценки</h3>
        {Object.values(report.competencyAverages).map(comp => (
          <div key={comp.name}>
            <p>{comp.name}: {comp.overall.toFixed(2)}</p>
            
            {/* По ролям */}
            {Object.entries(comp.byRole).map(([role, score]) => (
              <p key={role}>{role}: {score.toFixed(2)}</p>
            ))}
          </div>
        ))}
      </section>

      {/* Gap Analysis */}
      <section>
        <h3>Разрывный анализ</h3>
        {Object.values(report.gapAnalysis).map(gap => (
          <div key={gap.name}>
            <h4>{gap.name}</h4>
            <p>Самооценка: {gap.selfScore.toFixed(2)}</p>
            <p>Оценка окружающих: {gap.othersScore.toFixed(2)}</p>
            <p>Разрыв: {gap.gap.toFixed(2)}</p>
          </div>
        ))}
      </section>

      {/* Рекомендации */}
      <section>
        <h3>Рекомендации</h3>
        <ul>
          {report.recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

---

### 5. NotificationsManagement Component

**Работа с уведомлениями:**
```typescript
import { getNotifications, markNotificationAsRead } from '../utils/api';
import { useEffect, useState } from 'react';

function NotificationsManagement() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    
    // Опционально: обновлять каждые 30 секунд
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const { notifications } = await getNotifications();
      setNotifications(notifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      await loadNotifications();  // Перезагрузить список
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div>
      <h2>Уведомления</h2>
      
      {notifications.map(notif => (
        <div 
          key={notif.id}
          className={notif.read ? 'opacity-50' : ''}
        >
          <p>{notif.message}</p>
          <p className="text-sm text-gray-500">
            {new Date(notif.createdAt).toLocaleString('ru-RU')}
          </p>
          
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

---

### 6. ParticipantsManagement Component

**Загрузка пользователей:**
```typescript
import { getUsers } from '../utils/api';
import { useEffect, useState } from 'react';

function ParticipantsManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { users } = await getUsers();
      setUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
      // Если не админ, покажем ошибку
      if (error.message.includes('403')) {
        toast.error('Только администраторы могут просматривать список пользователей');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Управление участниками</h2>
      
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Отдел</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role === 'admin' ? 'Администратор' : 'Сотрудник'}</td>
              <td>{user.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### 7. UserProfile Component

**Загрузка профиля:**
```typescript
import { getProfile } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';

function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { profile } = await getProfile();
      setProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Личный кабинет</h2>
      
      <div>
        <p><strong>Имя:</strong> {profile?.name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Роль:</strong> {profile?.role === 'admin' ? 'Администратор' : 'Сотрудник'}</p>
        <p><strong>Отдел:</strong> {profile?.department || 'Не указан'}</p>
        <p><strong>Дата регистрации:</strong> {new Date(profile?.createdAt).toLocaleDateString('ru-RU')}</p>
      </div>
    </div>
  );
}
```

---

## 🎯 Best Practices

### 1. Обработка ошибок

Всегда оборачивайте API вызовы в try-catch:

```typescript
try {
  const data = await apiFunction();
  // успех
} catch (error) {
  console.error('Detailed error context:', error);
  toast.error('Пользователю понятное сообщение');
}
```

### 2. Loading States

Показывайте индикаторы загрузки:

```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      <p className="ml-2">Загрузка...</p>
    </div>
  );
}
```

### 3. Empty States

Обрабатывайте случаи, когда данных нет:

```typescript
if (!data || data.length === 0) {
  return (
    <div className="text-center p-8 text-gray-500">
      <p>Нет доступных данных</p>
      <button onClick={loadData}>Обновить</button>
    </div>
  );
}
```

### 4. Оптимистичные обновления

Для лучшего UX обновляйте UI сразу:

```typescript
const handleDelete = async (id: string) => {
  // Оптимистично удаляем из UI
  setItems(items.filter(item => item.id !== id));
  
  try {
    await deleteCampaign(id);
    toast.success('Удалено');
  } catch (error) {
    // Откатываем изменения при ошибке
    loadItems();
    toast.error('Ошибка при удалении');
  }
};
```

### 5. Дебаунсинг поиска

Для поисковых полей используйте debounce:

```typescript
import { useEffect, useState } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        performSearch(searchTerm);
      }
    }, 500);  // Ждем 500ms после последнего ввода

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const performSearch = async (term: string) => {
    // API запрос
  };

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Поиск..."
    />
  );
}
```

---

## 🔄 Миграционный чеклист

Используйте этот чеклист для каждого компонента:

### Для каждого компонента:

- [ ] Импортировать необходимые функции из `/utils/api.ts`
- [ ] Добавить `useState` для data, loading, error
- [ ] Добавить `useEffect` для загрузки данных при монтировании
- [ ] Заменить моковые данные на API вызовы
- [ ] Добавить обработку loading state
- [ ] Добавить обработку error state
- [ ] Добавить обработку empty state
- [ ] Добавить toast уведомления для успеха/ошибок
- [ ] Протестировать с реальными данными
- [ ] Проверить права доступа (admin vs employee)

---

## 📝 Пример полной миграции компонента

**Dashboard.tsx - полный пример:**

```typescript
import React, { useEffect, useState } from 'react';
import { getCampaigns, getNotifications } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { View, UserRole } from '../App';
import type { Campaign, Notification } from '../utils/api';

interface DashboardProps {
  onNavigate: (view: View) => void;
  userRole: UserRole;
}

export function Dashboard({ onNavigate, userRole }: DashboardProps) {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загружаем данные параллельно
      const [campaignsData, notificationsData] = await Promise.all([
        getCampaigns(),
        getNotifications()
      ]);

      setCampaigns(campaignsData.campaigns);
      setNotifications(notificationsData.notifications);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      console.error('Error loading dashboard data:', err);
      setError(errorMessage);
      toast.error('Ошибка при загрузке данных: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="ml-3 text-gray-600">Загрузка дашборда...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">Ошибка: {error}</p>
        <Button onClick={loadDashboardData}>Попробовать снова</Button>
      </div>
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'published');
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Дашборд - {userRole === 'admin' ? 'Администратор' : 'Сотрудник'}</h1>
        
        {userRole === 'admin' && (
          <Button
            onClick={() => onNavigate('campaign-wizard')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать кампанию
          </Button>
        )}
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-gray-500 text-sm">Активные кампании</h3>
          <p className="text-3xl font-bold text-purple-600">{activeCampaigns.length}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-gray-500 text-sm">Всего кампаний</h3>
          <p className="text-3xl font-bold">{campaigns.length}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-gray-500 text-sm">Непрочитанные уведомления</h3>
          <p className="text-3xl font-bold text-red-600">{unreadNotifications.length}</p>
        </Card>
      </div>

      {/* Список кампаний */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Мои кампании</h2>
        
        {campaigns.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Нет доступных кампаний</p>
            {userRole === 'admin' && (
              <Button
                onClick={() => onNavigate('campaign-wizard')}
                className="mt-4"
              >
                Создать первую кампанию
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map(campaign => (
              <div
                key={campaign.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => onNavigate('results')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{campaign.name}</h3>
                    <p className="text-sm text-gray-500">{campaign.project}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    campaign.status === 'published' 
                      ? 'bg-green-100 text-green-700'
                      : campaign.status === 'draft'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {campaign.status === 'published' ? 'Активна' : 
                     campaign.status === 'draft' ? 'Черновик' : 'Завершена'}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Завершено: {campaign.completed} из {campaign.totalParticipants}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
```

---

## ✅ Готово!

После интеграции всех компонентов ваше приложение будет полностью работать с backend API, предоставляя:

- ✅ Реальную аутентификацию пользователей
- ✅ Сохранение данных в базе
- ✅ Генерацию отчетов
- ✅ Уведомления
- ✅ Разграничение прав доступа

**Следующие шаги:**
1. Интегрируйте компоненты по одному, следуя шаблонам выше
2. Тестируйте каждый компонент после интеграции
3. Обрабатывайте все edge cases
4. Добавьте визуализации для отчетов (радарные диаграммы)

Удачи! 🚀
