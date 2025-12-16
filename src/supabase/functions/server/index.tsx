import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Supabase client factory
const createSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Auth middleware для защищенных маршрутов
async function authenticateUser(request: Request) {
  const supabase = createSupabaseClient();
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return null;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// ==================== AUTH ENDPOINTS ====================

// Регистрация нового пользователя
app.post('/make-server-9d167e02/signup', async (c) => {
  try {
    const { email, password, name, role, department } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password и name обязательны' }, 400);
    }
    
    const supabase = createSupabaseClient();
    
    console.log(`Попытка регистрации пользователя: ${email}`);
    
    // Используем обычный signUp вместо admin.createUser для правильной установки пароля
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name, 
          role: role || 'employee', 
          department: department || '' 
        }
      }
    });
    
    if (signUpError) {
      console.log(`Ошибка при регистрации ${email}: ${signUpError.message}`);
      return c.json({ error: signUpError.message }, 400);
    }
    
    if (!signUpData?.user) {
      console.log(`Ошибка: пользователь не был создан для ${email}`);
      return c.json({ error: 'Не удалось создать пользователя' }, 500);
    }
    
    console.log(`Пользователь ${email} создан через signUp с ID: ${signUpData.user.id}`);
    
    // Подтверждаем email через admin API (так как email сервер не настроен)
    const { error: confirmError } = await supabase.auth.admin.updateUserById(
      signUpData.user.id,
      { email_confirm: true }
    );
    
    if (confirmError) {
      console.log(`Ошибка при подтверждении email: ${confirmError.message}`);
      // Не возвращаем ошибку, так как пользователь создан
    } else {
      console.log(`Email подтвержден для ${email}`);
    }
    
    // Сохраняем профиль пользователя в KV store
    const userProfile = {
      id: signUpData.user.id,
      email,
      name,
      role: role || 'employee',
      department: department || '',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`user:${signUpData.user.id}`, userProfile);
    
    console.log(`Пользователь ${email} успешно зарегистрирован с ID: ${signUpData.user.id}`);
    
    return c.json({ 
      success: true, 
      user: userProfile
    });
    
  } catch (error) {
    console.log(`Ошибка при регистрации: ${error}`);
    return c.json({ error: 'Ошибка при регистрации пользователя' }, 500);
  }
});

// Создание тестового пользователя (для отладки)
app.post('/make-server-9d167e02/create-test-user', async (c) => {
  try {
    const supabase = createSupabaseClient();
    
    console.log('Начало создания тестовых пользователей...');
    
    const testUsers = [];
    
    // Создаем админа
    const adminEmail = 'admin@test.com';
    const adminPassword = 'admin123456';
    
    console.log(`Попытка создания админа: ${adminEmail}`);
    
    // Сначала проверяем, существует ли пользователь
    const { data: existingAdminData } = await supabase.auth.admin.listUsers();
    const existingAdmin = existingAdminData?.users?.find(u => u.email === adminEmail);
    
    if (existingAdmin) {
      console.log(`Админ ${adminEmail} уже существует (ID: ${existingAdmin.id}), удаляем...`);
      const { error: deleteError } = await supabase.auth.admin.deleteUser(existingAdmin.id);
      if (deleteError) {
        console.log(`Ошибка при удалении админа: ${deleteError.message}`);
      } else {
        console.log(`Админ успешно удален`);
      }
      // Подождем немного после удаления
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Используем обычный signUp вместо admin.createUser для правильной установки пароля
    const { data: adminSignUpData, error: adminSignUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: { 
          name: 'Тестовый Администратор', 
          role: 'admin', 
          department: 'HR' 
        }
      }
    });
    
    if (adminSignUpError) {
      console.log(`Ошибка при создании админа через signUp: ${adminSignUpError.message}`);
      return c.json({ error: `Ошибка создания админа: ${adminSignUpError.message}` }, 400);
    }
    
    if (!adminSignUpData?.user) {
      console.log(`Не удалось создать админа - нет данных пользователя`);
      return c.json({ error: 'Не удалось создать админа' }, 400);
    }
    
    console.log(`Админ создан через signUp с ID: ${adminSignUpData.user.id}`);
    
    // Теперь подтверждаем email через admin API
    const { error: confirmAdminError } = await supabase.auth.admin.updateUserById(
      adminSignUpData.user.id,
      { email_confirm: true }
    );
    
    if (confirmAdminError) {
      console.log(`Ошибка при подтверждении email админа: ${confirmAdminError.message}`);
    } else {
      console.log(`Email админа подтвержден`);
    }
    
    // Сохраняем профиль в KV
    await kv.set(`user:${adminSignUpData.user.id}`, {
      id: adminSignUpData.user.id,
      email: adminEmail,
      name: 'Тестовый Администратор',
      role: 'admin',
      department: 'HR',
      createdAt: new Date().toISOString()
    });
    testUsers.push({ email: adminEmail, password: adminPassword, role: 'admin' });
    
    // Создаем сотрудника
    const employeeEmail = 'employee@test.com';
    const employeePassword = 'employee123456';
    
    console.log(`Попытка создания сотрудника: ${employeeEmail}`);
    
    // Проверяем существующего сотрудника
    const existingEmployee = existingAdminData?.users?.find(u => u.email === employeeEmail);
    
    if (existingEmployee) {
      console.log(`Сотрудник ${employeeEmail} уже существует (ID: ${existingEmployee.id}), удаляем...`);
      const { error: deleteError } = await supabase.auth.admin.deleteUser(existingEmployee.id);
      if (deleteError) {
        console.log(`Ошибка при удалении сотрудника: ${deleteError.message}`);
      } else {
        console.log(`Сотрудник успешно удален`);
      }
      // Подождем немного после удаления
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Используем обычный signUp
    const { data: empSignUpData, error: empSignUpError } = await supabase.auth.signUp({
      email: employeeEmail,
      password: employeePassword,
      options: {
        data: { 
          name: 'Тестовый Сотрудник', 
          role: 'employee', 
          department: 'IT' 
        }
      }
    });
    
    if (empSignUpError) {
      console.log(`Ошибка при создании сотрудника через signUp: ${empSignUpError.message}`);
      return c.json({ error: `Ошибка создания сотрудника: ${empSignUpError.message}` }, 400);
    }
    
    if (!empSignUpData?.user) {
      console.log(`Не удалось создать сотрудника - нет данных пользователя`);
      return c.json({ error: 'Не удалось создать сотрудника' }, 400);
    }
    
    console.log(`Сотрудник создан через signUp с ID: ${empSignUpData.user.id}`);
    
    // Подтверждаем email
    const { error: confirmEmpError } = await supabase.auth.admin.updateUserById(
      empSignUpData.user.id,
      { email_confirm: true }
    );
    
    if (confirmEmpError) {
      console.log(`Ошибка при подтверждении email сотрудника: ${confirmEmpError.message}`);
    } else {
      console.log(`Email сотрудника подтвержден`);
    }
    
    // Сохраняем профиль в KV
    await kv.set(`user:${empSignUpData.user.id}`, {
      id: empSignUpData.user.id,
      email: employeeEmail,
      name: 'Тестовый Сотрудник',
      role: 'employee',
      department: 'IT',
      createdAt: new Date().toISOString()
    });
    testUsers.push({ email: employeeEmail, password: employeePassword, role: 'employee' });
    
    console.log('Тестовые пользователи успешно созданы');
    
    return c.json({ 
      success: true,
      message: 'Тестовые пользователи созданы',
      users: testUsers
    });
    
  } catch (error) {
    console.log(`Ошибка при создании тестовых пользователей: ${error}`);
    return c.json({ error: `Ошибка при создании тестовых пользователей: ${error}` }, 500);
  }
});

// Вход пользователя (используется на клиенте через Supabase auth)
// Этот endpoint нужен только для получения профиля после входа
app.get('/make-server-9d167e02/profile', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile) {
      return c.json({ error: 'Профиль не найден' }, 404);
    }
    
    return c.json({ profile });
    
  } catch (error) {
    console.log(`Ошибка при получении профиля: ${error}`);
    return c.json({ error: 'Ошибка при получении профиля' }, 500);
  }
});

// Вход пользователя (альтернативный метод через сервер)
app.post('/make-server-9d167e02/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email и password обязательны' }, 400);
    }
    
    const supabase = createSupabaseClient();
    
    console.log(`Попытка входа для пользователя: ${email}`);
    
    // Используем signInWithPassword для получения сессии
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.log(`Ошибка при входе для ${email}: ${error.message}`);
      return c.json({ error: error.message }, 401);
    }
    
    if (!data.user || !data.session) {
      console.log(`Нет данных пользователя или сессии для ${email}`);
      return c.json({ error: 'Не удалось получить сессию' }, 401);
    }
    
    console.log(`Успешный вход для ${email}, ID: ${data.user.id}`);
    
    // Получаем профиль из KV store
    const profile = await kv.get(`user:${data.user.id}`);
    
    if (!profile) {
      console.log(`Профиль не найден для ${email}, создаем новый...`);
      // Создаем профиль из metadata если его нет
      const newProfile = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || 'Пользователь',
        role: data.user.user_metadata?.role || 'employee',
        department: data.user.user_metadata?.department || '',
        createdAt: new Date().toISOString()
      };
      await kv.set(`user:${data.user.id}`, newProfile);
      
      return c.json({
        success: true,
        accessToken: data.session.access_token,
        profile: newProfile
      });
    }
    
    return c.json({
      success: true,
      accessToken: data.session.access_token,
      profile
    });
    
  } catch (error) {
    console.log(`Ошибка при входе: ${error}`);
    return c.json({ error: 'Ошибка при входе' }, 500);
  }
});

// ==================== CAMPAIGNS ENDPOINTS ====================

// Получение всех кампаний
app.get('/make-server-9d167e02/campaigns', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const campaigns = await kv.getByPrefix('campaign:');
    
    // Фильтруем кампании в зависимости от роли
    const userProfile = await kv.get(`user:${user.id}`);
    
    let filteredCampaigns = campaigns;
    
    if (userProfile?.role === 'employee') {
      // Сотрудники видят только те кампании, где они участники
      filteredCampaigns = campaigns.filter((campaign: any) => 
        campaign.participants?.some((p: any) => p.userId === user.id)
      );
    }
    
    return c.json({ campaigns: filteredCampaigns });
    
  } catch (error) {
    console.log(`Ошибка при получении кампаний: ${error}`);
    return c.json({ error: 'Ошибка при получении кампаний' }, 500);
  }
});

// Получение одной кампании
app.get('/make-server-9d167e02/campaigns/:id', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const campaignId = c.req.param('id');
    const campaign = await kv.get(`campaign:${campaignId}`);
    
    if (!campaign) {
      return c.json({ error: 'Кампания не найдена' }, 404);
    }
    
    return c.json({ campaign });
    
  } catch (error) {
    console.log(`Ошибка при получении кампании: ${error}`);
    return c.json({ error: 'Ошибка при получении кампании' }, 500);
  }
});

// Создание новой кампании
app.post('/make-server-9d167e02/campaigns', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userProfile = await kv.get(`user:${user.id}`);
    
    if (userProfile?.role !== 'admin') {
      return c.json({ error: 'Только администраторы могут создавать кампании' }, 403);
    }
    
    const { name, project, deadline, participants, surveyId } = await c.req.json();
    
    if (!name || !project) {
      return c.json({ error: 'Name и project обязательны' }, 400);
    }
    
    const campaignId = crypto.randomUUID();
    
    const campaign = {
      id: campaignId,
      name,
      project,
      deadline: deadline || null,
      participants: participants || [],
      surveyId: surveyId || null,
      status: 'draft',
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      completed: 0,
      totalParticipants: participants?.length || 0
    };
    
    await kv.set(`campaign:${campaignId}`, campaign);
    
    console.log(`Кампания ${name} создана пользователем ${userProfile.email}`);
    
    return c.json({ success: true, campaign });
    
  } catch (error) {
    console.log(`Ошибка при создании кампании: ${error}`);
    return c.json({ error: 'Ошибка при создании кампании' }, 500);
  }
});

// Обновление кампании
app.put('/make-server-9d167e02/campaigns/:id', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userProfile = await kv.get(`user:${user.id}`);
    
    if (userProfile?.role !== 'admin') {
      return c.json({ error: 'Только администраторы могут обновлять кампании' }, 403);
    }
    
    const campaignId = c.req.param('id');
    const existingCampaign = await kv.get(`campaign:${campaignId}`);
    
    if (!existingCampaign) {
      return c.json({ error: 'Кампания не найдена' }, 404);
    }
    
    const updates = await c.req.json();
    
    const updatedCampaign = {
      ...existingCampaign,
      ...updates,
      id: campaignId, // Не позволяем менять ID
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`campaign:${campaignId}`, updatedCampaign);
    
    console.log(`Кампания ${campaignId} обновлена`);
    
    return c.json({ success: true, campaign: updatedCampaign });
    
  } catch (error) {
    console.log(`Ошибка при обновлении кампании: ${error}`);
    return c.json({ error: 'Ошибка при обновлении кампании' }, 500);
  }
});

// Удаление кампании
app.delete('/make-server-9d167e02/campaigns/:id', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userProfile = await kv.get(`user:${user.id}`);
    
    if (userProfile?.role !== 'admin') {
      return c.json({ error: 'Только администраторы могут удалять кампании' }, 403);
    }
    
    const campaignId = c.req.param('id');
    const campaign = await kv.get(`campaign:${campaignId}`);
    
    if (!campaign) {
      return c.json({ error: 'Кампания не найдена' }, 404);
    }
    
    await kv.del(`campaign:${campaignId}`);
    
    // Также удаляем все связанные ответы
    const responses = await kv.getByPrefix(`response:${campaignId}:`);
    for (const response of responses) {
      await kv.del(`response:${campaignId}:${response.id}`);
    }
    
    console.log(`Кампания ${campaignId} удалена`);
    
    return c.json({ success: true });
    
  } catch (error) {
    console.log(`Ошибка при удалении кампании: ${error}`);
    return c.json({ error: 'Ошибка при удалении кампании' }, 500);
  }
});

// ==================== SURVEYS ENDPOINTS ====================

// Получение анкеты по ID кампании
app.get('/make-server-9d167e02/surveys/:campaignId', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const campaignId = c.req.param('campaignId');
    const campaign = await kv.get(`campaign:${campaignId}`);
    
    if (!campaign) {
      return c.json({ error: 'Кампания не найдена' }, 404);
    }
    
    if (!campaign.surveyId) {
      return c.json({ error: 'Анкета не создана для этой кампании' }, 404);
    }
    
    const survey = await kv.get(`survey:${campaign.surveyId}`);
    
    if (!survey) {
      return c.json({ error: 'Анкета не найдена' }, 404);
    }
    
    return c.json({ survey });
    
  } catch (error) {
    console.log(`Ошибка при получении анкеты: ${error}`);
    return c.json({ error: 'Ошибка при получении анкеты' }, 500);
  }
});

// Создание новой анкеты
app.post('/make-server-9d167e02/surveys', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userProfile = await kv.get(`user:${user.id}`);
    
    if (userProfile?.role !== 'admin') {
      return c.json({ error: 'Только администраторы могут создавать анкеты' }, 403);
    }
    
    const { campaignId, title, competencies } = await c.req.json();
    
    if (!campaignId || !title || !competencies) {
      return c.json({ error: 'CampaignId, title и competencies обязательны' }, 400);
    }
    
    const surveyId = crypto.randomUUID();
    
    const survey = {
      id: surveyId,
      campaignId,
      title,
      competencies,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`survey:${surveyId}`, survey);
    
    // Обновляем кампанию, добавляя ссылку на анкету
    const campaign = await kv.get(`campaign:${campaignId}`);
    if (campaign) {
      campaign.surveyId = surveyId;
      await kv.set(`campaign:${campaignId}`, campaign);
    }
    
    console.log(`Анкета ${title} создана для кампании ${campaignId}`);
    
    return c.json({ success: true, survey });
    
  } catch (error) {
    console.log(`Ошибка при создании анкеты: ${error}`);
    return c.json({ error: 'Ошибка при создании анкеты' }, 500);
  }
});

// Обновление анкеты
app.put('/make-server-9d167e02/surveys/:id', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userProfile = await kv.get(`user:${user.id}`);
    
    if (userProfile?.role !== 'admin') {
      return c.json({ error: 'Только администраторы могут обновлять анкеты' }, 403);
    }
    
    const surveyId = c.req.param('id');
    const existingSurvey = await kv.get(`survey:${surveyId}`);
    
    if (!existingSurvey) {
      return c.json({ error: 'Анкета не найдена' }, 404);
    }
    
    const updates = await c.req.json();
    
    const updatedSurvey = {
      ...existingSurvey,
      ...updates,
      id: surveyId,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`survey:${surveyId}`, updatedSurvey);
    
    console.log(`Анкета ${surveyId} обновлена`);
    
    return c.json({ success: true, survey: updatedSurvey });
    
  } catch (error) {
    console.log(`Ошибка при обновлении анкеты: ${error}`);
    return c.json({ error: 'Ошибка при обновлении анкеты' }, 500);
  }
});

// ==================== RESPONSES ENDPOINTS ====================

// Получение всех ответов для кампании
app.get('/make-server-9d167e02/responses/:campaignId', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const campaignId = c.req.param('campaignId');
    const responses = await kv.getByPrefix(`response:${campaignId}:`);
    
    const userProfile = await kv.get(`user:${user.id}`);
    
    // Фильтруем ответы в зависимости от роли
    let filteredResponses = responses;
    
    if (userProfile?.role === 'employee') {
      // Сотрудники видят только свои ответы и ответы о себе
      filteredResponses = responses.filter((response: any) => 
        response.evaluatorId === user.id || response.evaluatedUserId === user.id
      );
    }
    
    return c.json({ responses: filteredResponses });
    
  } catch (error) {
    console.log(`Ошибка при получении ответов: ${error}`);
    return c.json({ error: 'Ошибка при получении ответов' }, 500);
  }
});

// Создание нового ответа
app.post('/make-server-9d167e02/responses', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { campaignId, evaluatedUserId, evaluatorRole, responses } = await c.req.json();
    
    if (!campaignId || !evaluatedUserId || !evaluatorRole || !responses) {
      return c.json({ error: 'Все поля обязательны' }, 400);
    }
    
    const responseId = crypto.randomUUID();
    
    const response = {
      id: responseId,
      campaignId,
      evaluatorId: user.id,
      evaluatedUserId,
      evaluatorRole,
      responses,
      submittedAt: new Date().toISOString()
    };
    
    await kv.set(`response:${campaignId}:${responseId}`, response);
    
    // Обновляем счетчик завершенных оценок в кампании
    const campaign = await kv.get(`campaign:${campaignId}`);
    if (campaign) {
      const allResponses = await kv.getByPrefix(`response:${campaignId}:`);
      campaign.completed = allResponses.length;
      await kv.set(`campaign:${campaignId}`, campaign);
    }
    
    console.log(`Ответ создан для кампании ${campaignId} пользователем ${user.id}`);
    
    // Создаем уведомление для оцениваемого
    if (evaluatedUserId !== user.id) {
      const notificationId = crypto.randomUUID();
      await kv.set(`notification:${evaluatedUserId}:${notificationId}`, {
        id: notificationId,
        userId: evaluatedUserId,
        type: 'new_response',
        message: `Получена новая оценка от ${evaluatorRole}`,
        campaignId,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
    
    return c.json({ success: true, response });
    
  } catch (error) {
    console.log(`Ошибка при создании ответа: ${error}`);
    return c.json({ error: 'Ошибка при создании ответа' }, 500);
  }
});

// ==================== REPORTS ENDPOINTS ====================

// Генерация отчета для кампании
app.get('/make-server-9d167e02/reports/:campaignId/:userId', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const campaignId = c.req.param('campaignId');
    const userId = c.req.param('userId');
    
    const userProfile = await kv.get(`user:${user.id}`);
    
    // Проверяем права доступа
    if (userProfile?.role !== 'admin' && user.id !== userId) {
      return c.json({ error: 'Вы можете просматривать только свои отчеты' }, 403);
    }
    
    const responses = await kv.getByPrefix(`response:${campaignId}:`);
    const userResponses = responses.filter((r: any) => r.evaluatedUserId === userId);
    
    if (userResponses.length === 0) {
      return c.json({ error: 'Нет данных для отчета' }, 404);
    }
    
    const campaign = await kv.get(`campaign:${campaignId}`);
    const survey = campaign?.surveyId ? await kv.get(`survey:${campaign.surveyId}`) : null;
    
    // Группируем ответы по ролям оценивающих
    const responsesByRole: any = {
      self: [],
      manager: [],
      peer: [],
      subordinate: [],
      client: []
    };
    
    userResponses.forEach((response: any) => {
      if (responsesByRole[response.evaluatorRole]) {
        responsesByRole[response.evaluatorRole].push(response);
      }
    });
    
    // Вычисляем средние оценки по компетенциям
    const competencyAverages: any = {};
    const competencyByRole: any = {};
    
    if (survey?.competencies) {
      survey.competencies.forEach((comp: any) => {
        competencyAverages[comp.id] = {
          name: comp.name,
          overall: 0,
          byRole: {}
        };
        competencyByRole[comp.id] = {};
        
        Object.keys(responsesByRole).forEach(role => {
          const roleResponses = responsesByRole[role];
          if (roleResponses.length > 0) {
            const sum = roleResponses.reduce((acc: number, r: any) => {
              return acc + (r.responses[comp.id] || 0);
            }, 0);
            const avg = sum / roleResponses.length;
            competencyByRole[comp.id][role] = avg;
            competencyAverages[comp.id].byRole[role] = avg;
          }
        });
        
        // Общая средняя
        const allScores = userResponses
          .map((r: any) => r.responses[comp.id])
          .filter((s: any) => s !== undefined);
        
        if (allScores.length > 0) {
          competencyAverages[comp.id].overall = 
            allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length;
        }
      });
    }
    
    // Вычисляем gap analysis (разрыв между самооценкой и оценкой окружения)
    const gapAnalysis: any = {};
    
    if (survey?.competencies) {
      survey.competencies.forEach((comp: any) => {
        const selfScore = competencyByRole[comp.id]?.self || 0;
        const othersScores = ['manager', 'peer', 'subordinate', 'client']
          .map(role => competencyByRole[comp.id]?.[role])
          .filter(s => s !== undefined);
        
        if (othersScores.length > 0) {
          const othersAvg = othersScores.reduce((a, b) => a + b, 0) / othersScores.length;
          gapAnalysis[comp.id] = {
            name: comp.name,
            selfScore,
            othersScore: othersAvg,
            gap: selfScore - othersAvg
          };
        }
      });
    }
    
    // Генерируем рекомендации
    const recommendations: string[] = [];
    
    Object.values(gapAnalysis).forEach((gap: any) => {
      if (gap.gap > 1) {
        recommendations.push(
          `Переоценка компетенции "${gap.name}": ваша самооценка выше оценки окружающих на ${gap.gap.toFixed(1)} балла. Рекомендуется запросить обратную связь и скорректировать самовосприятие.`
        );
      } else if (gap.gap < -1) {
        recommendations.push(
          `Недооценка компетенции "${gap.name}": окружающие оценивают вас выше на ${Math.abs(gap.gap).toFixed(1)} балла. Это сильная сторона, которую можно развивать дальше.`
        );
      }
      
      if (gap.othersScore < 3) {
        recommendations.push(
          `Компетенция "${gap.name}" требует развития. Средняя оценка окружающих: ${gap.othersScore.toFixed(1)}. Рекомендуется пройти обучение или найти наставника в этой области.`
        );
      }
    });
    
    const report = {
      campaignId,
      userId,
      campaign,
      survey,
      responsesCount: userResponses.length,
      responsesByRole: Object.keys(responsesByRole).reduce((acc: any, role) => {
        acc[role] = responsesByRole[role].length;
        return acc;
      }, {}),
      competencyAverages,
      gapAnalysis,
      recommendations,
      generatedAt: new Date().toISOString()
    };
    
    return c.json({ report });
    
  } catch (error) {
    console.log(`Ошибка при генерации отчета: ${error}`);
    return c.json({ error: 'Ошибка при генерации отчета' }, 500);
  }
});

// ==================== NOTIFICATIONS ENDPOINTS ====================

// Получение уведомлений пользователя
app.get('/make-server-9d167e02/notifications', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const notifications = await kv.getByPrefix(`notification:${user.id}:`);
    
    // Сортируем по дате создания (новые первые)
    notifications.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ notifications });
    
  } catch (error) {
    console.log(`Ошибка при получении уведомлений: ${error}`);
    return c.json({ error: 'Ошибка при получении уведомлений' }, 500);
  }
});

// Отметить уведомление как прочитанное
app.put('/make-server-9d167e02/notifications/:id/read', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const notificationId = c.req.param('id');
    const notification = await kv.get(`notification:${user.id}:${notificationId}`);
    
    if (!notification) {
      return c.json({ error: 'Уведомление не найдено' }, 404);
    }
    
    notification.read = true;
    await kv.set(`notification:${user.id}:${notificationId}`, notification);
    
    return c.json({ success: true });
    
  } catch (error) {
    console.log(`Ошибка при обновлении уведомления: ${error}`);
    return c.json({ error: 'Ошибка при обновлении уведомления' }, 500);
  }
});

// Создание уведомления (для администраторов)
app.post('/make-server-9d167e02/notifications', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userProfile = await kv.get(`user:${user.id}`);
    
    if (userProfile?.role !== 'admin') {
      return c.json({ error: 'Только администраторы могут создавать уведомления' }, 403);
    }
    
    const { userId, type, message, campaignId } = await c.req.json();
    
    if (!userId || !message) {
      return c.json({ error: 'UserId и message обязательны' }, 400);
    }
    
    const notificationId = crypto.randomUUID();
    
    const notification = {
      id: notificationId,
      userId,
      type: type || 'info',
      message,
      campaignId: campaignId || null,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`notification:${userId}:${notificationId}`, notification);
    
    console.log(`Уведомление создано для пользователя ${userId}`);
    
    return c.json({ success: true, notification });
    
  } catch (error) {
    console.log(`Ошибка при создании уведомления: ${error}`);
    return c.json({ error: 'Ошибка при создании уведомления' }, 500);
  }
});

// ==================== USERS ENDPOINTS ====================

// Получение списка всех пользователей
app.get('/make-server-9d167e02/users', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('Получение списка пользователей');

    // Получаем всех пользователей из KV store
    const allUsers = await kv.getByPrefix('user:');
    
    if (!allUsers || allUsers.length === 0) {
      return c.json({ users: [] });
    }

    console.log(`Найдено пользователей: ${allUsers.length}`);

    return c.json({ users: allUsers });

  } catch (error) {
    console.log(`Ошибка при получении списка пользователей: ${error}`);
    return c.json({ error: 'Ошибка при получении списка пользователей' }, 500);
  }
});

// Отправка тестового письма
app.post('/make-server-9d167e02/send-test-email', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    if (!user) {
      console.log('Ошибка аутентификации при отправке тестового письма');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { email, template } = await c.req.json();

    if (!email || !template) {
      console.log('Отсутствуют email или template в запросе');
      return c.json({ error: 'Email и template обязательны' }, 400);
    }

    console.log(`Отправка тестового письма на ${email}`);

    // Получаем API ключ Resend из переменных окружения
    let resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.log('RESEND_API_KEY не установлен в переменных окружения');
      return c.json({ 
        error: 'Email сервис не настроен. Пожалуйста, добавьте RESEND_API_KEY в настройках.',
        details: 'API ключ отсутствует в переменных окружения'
      }, 500);
    }

    // Очищаем API ключ от пробелов и переводов строк
    const originalKey = resendApiKey;
    resendApiKey = resendApiKey.trim();
    
    console.log(`=== ДИАГНОСТИКА API КЛЮЧА ===`);
    console.log(`Исходная длина ключа: ${originalKey.length} символов`);
    console.log(`Длина после trim(): ${resendApiKey.length} символов`);
    console.log(`Первые 5 символов: "${resendApiKey.substring(0, 5)}"`);
    console.log(`Последние 5 символов: "${resendApiKey.substring(resendApiKey.length - 5)}"`);
    console.log(`Начинается с "re_": ${resendApiKey.startsWith('re_')}`);
    
    // Проверяем наличие невалидных символов
    const invalidChars = resendApiKey.match(/[^a-zA-Z0-9_-]/g);
    if (invalidChars) {
      console.log(`ВНИМАНИЕ: Найдены невалидные символы: ${JSON.stringify(invalidChars)}`);
      console.log(`Позиции невалидных символов:`);
      for (let i = 0; i < resendApiKey.length; i++) {
        const char = resendApiKey[i];
        if (!/[a-zA-Z0-9_-]/.test(char)) {
          console.log(`  Позиция ${i}: "${char}" (код: ${char.charCodeAt(0)})`);
        }
      }
      // Удаляем невалидные символы
      resendApiKey = resendApiKey.replace(/[^a-zA-Z0-9_-]/g, '');
      console.log(`После очистки: длина ${resendApiKey.length}, первые 5: "${resendApiKey.substring(0, 5)}"`);
    }
    
    // Проверяем формат ключа
    if (!resendApiKey.startsWith('re_')) {
      console.log(`ОШИБКА: API ключ не начинается с "re_"`);
      return c.json({ 
        error: 'Невалидный формат API ключа Resend',
        details: 'API ключ должен начинаться с "re_". Пожалуйста, проверьте ключ в настройках.'
      }, 500);
    }
    
    if (resendApiKey.length < 20) {
      console.log(`ОШИБКА: API ключ слишком короткий (${resendApiKey.length} символов)`);
      return c.json({ 
        error: 'Невалидный API ключ Resend',
        details: `API ключ слишком короткий (${resendApiKey.length} символов). Стандартный ключ содержит 40+ символов.`
      }, 500);
    }
    
    console.log(`✓ API ключ прошел базовую валидацию`);
    console.log(`=== КОНЕЦ ДИАГНОСТИКИ ===`);

    // Заменяем переменные в теме и теле письма
    const replacements = {
      '{name}': 'Тестовый Пользователь',
      '{campaign_name}': 'Тестовая кампания оценки',
      '{start_date}': new Date().toLocaleDateString('ru-RU'),
      '{end_date}': new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
      '{assessment_link}': 'https://example.com/assessment/test123',
      '{days_left}': '14',
      '{results_date}': new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
      '{results_link}': 'https://example.com/results/test123'
    };

    let subject = template.subject;
    let body = template.body;

    Object.entries(replacements).forEach(([key, value]) => {
      subject = subject.replace(new RegExp(key, 'g'), value);
      body = body.replace(new RegExp(key, 'g'), value);
    });

    console.log(`Отправка письма с темой: ${subject}`);

    // Отправляем письмо через Resend
    console.log(`Вызов Resend API...`);
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Оценка 360° <onboarding@resend.dev>', // Для тестов используем onboarding@resend.dev
        to: [email],
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Система оценки 360°</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6;">
                ${body.replace(/\n/g, '<br>')}
              </div>
              <div style="margin-top: 20px; padding: 15px; background: #e0e7ff; border-left: 4px solid #9333ea; border-radius: 4px;">
                <p style="margin: 0; color: #4c1d95; font-size: 12px;">
                  <strong>Тестовое письмо</strong><br>
                  Это тестовое письмо из системы оценки компетенций 360°
                </p>
              </div>
            </div>
          </div>
        `,
      }),
    });

    console.log(`Resend API ответил со статусом: ${resendResponse.status}`);

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.log('Детальная ошибка от Resend API:', JSON.stringify(errorData, null, 2));
      
      // Специальная обработка для ошибки "API key is invalid"
      if (errorData.message === 'API key is invalid') {
        console.log('КРИТИЧНО: API ключ отклонен Resend. Требуется создать новый ключ.');
        return c.json({ 
          error: 'API ключ Resend невалидный',
          details: 'Resend отклонил API ключ. Возможные причины:\n' +
                   '1. Ключ был удален или деактивирован в панели Resend\n' +
                   '2. Ключ скопирован неполностью\n' +
                   '3. Ключ содержит опечатку\n\n' +
                   'Решение: Создайте новый API ключ на resend.com/api-keys и обновите его в настройках.',
          action: 'Перейдите на https://resend.com/api-keys и создайте новый ключ'
        }, 500);
      }
      
      return c.json({ 
        error: `Ошибка отправки от Resend API: ${errorData.message || JSON.stringify(errorData)}`,
        details: errorData
      }, 500);
    }

    const resendData = await resendResponse.json();
    console.log('Письмо успешно отправлено через Resend:', resendData);

    return c.json({ 
      success: true, 
      message: 'Тестовое письмо успешно отправлено',
      emailId: resendData.id 
    });

  } catch (error) {
    console.log(`Критическая ошибка при отправке тестового письма: ${error}`);
    console.log(`Тип ошибки: ${error.constructor.name}`);
    if (error.stack) {
      console.log(`Stack trace: ${error.stack}`);
    }
    return c.json({ 
      error: `Критическая ошибка при отправке письма: ${error.message || error}` 
    }, 500);
  }
});

// Массовая отправка писем
app.post('/make-server-9d167e02/send-bulk-email', async (c) => {
  try {
    const user = await authenticateUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { userIds, template } = await c.req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return c.json({ error: 'userIds обязателен и должен быть непустым массивом' }, 400);
    }

    if (!template) {
      return c.json({ error: 'template обязателен' }, 400);
    }

    console.log(`Массовая отправка писем ${userIds.length} пользователям`);

    // Получаем API ключ Resend
    let resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.log('RESEND_API_KEY не установлен');
      return c.json({ 
        error: 'Email сервис не настроен. Пожалуйста, добавьте RESEND_API_KEY в настройках.' 
      }, 500);
    }

    // Очищаем API ключ от невалидных символов
    resendApiKey = resendApiKey.trim();
    if (!/^[a-zA-Z0-9_-]+$/.test(resendApiKey)) {
      resendApiKey = resendApiKey.replace(/[^a-zA-Z0-9_-]/g, '');
    }

    console.log(`RESEND_API_KEY готов к использованию (длина: ${resendApiKey.length})`);

    // Получаем данные пользователей
    const users = await kv.mget(userIds.map(id => `user:${id}`));
    
    const results = [];
    const errors = [];

    // Отправляем письма каждому пользователю
    for (let i = 0; i < users.length; i++) {
      const recipient = users[i];
      const userId = userIds[i];
      
      if (!recipient) {
        errors.push({ userId, error: 'Пользователь не найден' });
        continue;
      }

      try {
        // Заменяем переменные для каждого пользователя
        const replacements = {
          '{name}': recipient.name,
          '{campaign_name}': 'Кампания оценки компетенций',
          '{start_date}': new Date().toLocaleDateString('ru-RU'),
          '{end_date}': new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
          '{assessment_link}': `https://example.com/assessment/${userId}`,
          '{days_left}': '14',
          '{results_date}': new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
          '{results_link}': `https://example.com/results/${userId}`
        };

        let subject = template.subject;
        let body = template.body;

        Object.entries(replacements).forEach(([key, value]) => {
          subject = subject.replace(new RegExp(key, 'g'), value);
          body = body.replace(new RegExp(key, 'g'), value);
        });

        // Отправляем письмо через Resend
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Оценка 360° <onboarding@resend.dev>',
            to: [recipient.email],
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">Система оценки 360°</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                  <div style="background: white; padding: 20px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6;">
                    ${body.replace(/\n/g, '<br>')}
                  </div>
                </div>
              </div>
            `,
          }),
        });

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json();
          console.log(`Ошибка отправки пользователю ${recipient.email}:`, errorData);
          errors.push({ userId, email: recipient.email, error: errorData.message });
        } else {
          const resendData = await resendResponse.json();
          results.push({ userId, email: recipient.email, emailId: resendData.id });
          console.log(`Письмо отправлено: ${recipient.email}`);
        }

      } catch (error) {
        console.log(`Ошибка при отправке письма пользователю ${userId}:`, error);
        errors.push({ userId, error: error.message });
      }
    }

    return c.json({ 
      success: true, 
      message: `Отправлено ${results.length} из ${userIds.length} писем`,
      results,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.log(`Ошибка при массовой отправке: ${error}`);
    return c.json({ error: 'Ошибка при массовой отправке писем' }, 500);
  }
});

// Health check endpoint
app.get('/make-server-9d167e02/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
Deno.serve(app.fetch);