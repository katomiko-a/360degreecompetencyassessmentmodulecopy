import React, { useState } from 'react';
import { Mail, Send, Eye, Save, Copy, Bell, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'invitation' | 'reminder' | 'completion' | 'results';
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: 'invitation',
    name: 'Приглашение к оценке',
    subject: 'Приглашение к участию в оценке 360°: {campaign_name}',
    body: `Здравствуйте, {name}!

Приглашаем вас принять участие в кампании оценки 360 градусов: {campaign_name}.

Ваше участие очень важно для развития компании и ваших коллег. Оценка 360° позволяет получить всестороннюю обратную связь о сильных сторонах и областях для развития.

Период проведения: {start_date} - {end_date}

Для прохождения оценки перейдите по ссылке: {assessment_link}

Время на заполнение: примерно 15-20 минут.

С уважением,
Отдел по работе с персоналом`,
    type: 'invitation'
  },
  {
    id: 'reminder',
    name: 'Напоминание о незавершенной оценке',
    subject: 'Напоминание: Завершите оценку 360° - {campaign_name}',
    body: `Здравствуйте, {name}!

Напоминаем, что вы еще не завершили оценку в рамках кампании: {campaign_name}.

Оценка завершается: {end_date}

До завершения осталось: {days_left} дн.

Пожалуйста, уделите несколько минут для заполнения анкеты. Ваше мнение очень важно для нас.

Ссылка на оценку: {assessment_link}

С уважением,
Отдел по работе с персоналом`,
    type: 'reminder'
  },
  {
    id: 'completion',
    name: 'Подтверждение завершения',
    subject: 'Спасибо за участие в оценке 360°',
    body: `Здравствуйте, {name}!

Благодарим вас за участие в кампании оценки 360 градусов: {campaign_name}.

Ваша оценка успешно сохранена. Результаты будут доступны после завершения кампании и обработки всех ответов.

Ожидаемая дата публикации результатов: {results_date}

С уважением,
Отдел по работе с персоналом`,
    type: 'completion'
  },
  {
    id: 'results',
    name: 'Результаты доступны',
    subject: 'Результаты оценки 360° готовы - {campaign_name}',
    body: `Здравствуйте, {name}!

Результаты кампании оценки 360 градусов "{campaign_name}" готовы и доступны для просмотра.

В отчете вы найдете:
- Общий профиль компетенций
- Сравнение самооценки с оценкой окружения
- Разрывный анализ
- Персонализированные рекомендации по развитию

Просмотреть результаты: {results_link}

Рекомендуем обсудить результаты с вашим руководителем для составления индивидуального плана развития.

С уважением,
Отдел по работе с персоналом`,
    type: 'results'
  }
];

export function NotificationsManagement() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(defaultTemplates[0]);
  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate>(defaultTemplates[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [settings, setSettings] = useState({
    autoSendInvitations: true,
    sendReminders: true,
    reminderDays: 3,
    sendCompletionConfirm: true,
    sendResultsNotification: true,
    ccToManager: false,
    ccToHR: true
  });

  const [schedule, setSchedule] = useState({
    invitationTime: '09:00',
    reminderTime: '10:00'
  });

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditedTemplate(template);
    setIsEditing(false);
  };

  const handleSaveTemplate = () => {
    setSelectedTemplate(editedTemplate);
    setIsEditing(false);
    alert('Шаблон сохранен!');
  };

  const handleResetTemplate = () => {
    const original = defaultTemplates.find(t => t.id === selectedTemplate.id);
    if (original) {
      setEditedTemplate(original);
    }
  };

  const renderPreview = () => {
    let preview = editedTemplate.body;
    const replacements = {
      '{name}': 'Иван Иванович Иванов',
      '{campaign_name}': 'Оценка лидерского потенциала, Q2 2024',
      '{start_date}': '15 декабря 2024',
      '{end_date}': '30 декабря 2024',
      '{assessment_link}': 'https://example.com/assessment/abc123',
      '{days_left}': '3',
      '{results_date}': '10 января 2025',
      '{results_link}': 'https://example.com/results/abc123'
    };

    Object.entries(replacements).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(key, 'g'), value);
    });

    return preview;
  };

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div>
        <h1 className="text-gray-900 text-2xl mb-2">Управление уведомлениями</h1>
        <p className="text-gray-600">
          Настройте автоматические уведомления и шаблоны писем для участников
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Левая панель - Настройки */}
        <div className="col-span-4 space-y-6">
          {/* Общие настройки */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-purple-600" />
              <h2 className="text-gray-900">Общие настройки</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={settings.autoSendInvitations}
                  onChange={(e) => setSettings({ ...settings, autoSendInvitations: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Send className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-900">Автоматически отправлять приглашения</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Email-приглашения будут отправлены участникам при запуске кампании
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={settings.sendReminders}
                  onChange={(e) => setSettings({ ...settings, sendReminders: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-900">Отправлять напоминания</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    Автоматические напоминания для незавершивших оценку
                  </p>
                  {settings.sendReminders && (
                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        За сколько дней до окончания
                      </label>
                      <select
                        value={settings.reminderDays}
                        onChange={(e) => setSettings({ ...settings, reminderDays: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value={1}>1 день до окончания</option>
                        <option value={2}>2 дня до окончания</option>
                        <option value={3}>3 дня до окончания</option>
                        <option value={5}>5 дней до окончания</option>
                        <option value={7}>7 дней до окончания</option>
                      </select>
                    </div>
                  )}
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={settings.sendCompletionConfirm}
                  onChange={(e) => setSettings({ ...settings, sendCompletionConfirm: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-900">Подтверждение завершения</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Отправить email с благодарностью после завершения оценки
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={settings.sendResultsNotification}
                  onChange={(e) => setSettings({ ...settings, sendResultsNotification: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-900">Уведомление о результатах</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Уведомить участников когда результаты будут готовы
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Дополнительные настройки */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-purple-600" />
              <h2 className="text-gray-900">Дополнительные получатели</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.ccToManager}
                  onChange={(e) => setSettings({ ...settings, ccToManager: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-gray-900 text-sm">Копия руководителю</div>
                  <p className="text-gray-600 text-xs">
                    Отправлять копию писем руководителю участника
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.ccToHR}
                  onChange={(e) => setSettings({ ...settings, ccToHR: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-gray-900 text-sm">Копия HR-специалисту</div>
                  <p className="text-gray-600 text-xs">
                    Отправлять копию HR-отделу
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Расписание отправки */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-purple-600" />
              <h2 className="text-gray-900">Расписание отправки</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Время отправки приглашений
                </label>
                <input
                  type="time"
                  value={schedule.invitationTime}
                  onChange={(e) => setSchedule({ ...schedule, invitationTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Время отправки напоминаний
                </label>
                <input
                  type="time"
                  value={schedule.reminderTime}
                  onChange={(e) => setSchedule({ ...schedule, reminderTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-xs">
                  Все письма отправляются по московскому времени (UTC+3)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Правая панель - Шаблоны */}
        <div className="col-span-8 space-y-6">
          {/* Выбор шаблона */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-purple-600" />
              <h2 className="text-gray-900">Шаблоны email-уведомлений</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {defaultTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 text-left border-2 rounded-lg transition-colors ${
                    selectedTemplate.id === template.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-900">{template.name}</span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded inline-block ${
                    template.type === 'invitation' ? 'bg-green-100 text-green-700' :
                    template.type === 'reminder' ? 'bg-orange-100 text-orange-700' :
                    template.type === 'completion' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {template.type === 'invitation' ? 'Приглашение' :
                     template.type === 'reminder' ? 'Напоминание' :
                     template.type === 'completion' ? 'Завершение' :
                     'Результаты'}
                  </div>
                </button>
              ))}
            </div>

            {/* Редактор шаблона */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Редактирование шаблона</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 border border-purple-300 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? 'Скрыть' : 'Предпросмотр'}
                  </button>
                  {isEditing && (
                    <>
                      <button
                        onClick={handleResetTemplate}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
                      >
                        Сбросить
                      </button>
                      <button
                        onClick={handleSaveTemplate}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Сохранить
                      </button>
                    </>
                  )}
                </div>
              </div>

              {!showPreview ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Тема письма
                    </label>
                    <input
                      type="text"
                      value={editedTemplate.subject}
                      onChange={(e) => {
                        setEditedTemplate({ ...editedTemplate, subject: e.target.value });
                        setIsEditing(true);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Текст письма
                    </label>
                    <textarea
                      value={editedTemplate.body}
                      onChange={(e) => {
                        setEditedTemplate({ ...editedTemplate, body: e.target.value });
                        setIsEditing(true);
                      }}
                      rows={16}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                    />
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-gray-900 mb-3">Доступные переменные</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-white rounded text-purple-600">
                          {'{name}'}
                        </code>
                        <span className="text-gray-600">Имя получателя</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-white rounded text-purple-600">
                          {'{campaign_name}'}
                        </code>
                        <span className="text-gray-600">Название кампании</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-white rounded text-purple-600">
                          {'{start_date}'}
                        </code>
                        <span className="text-gray-600">Дата начала</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-white rounded text-purple-600">
                          {'{end_date}'}
                        </code>
                        <span className="text-gray-600">Дата окончания</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-white rounded text-purple-600">
                          {'{assessment_link}'}
                        </code>
                        <span className="text-gray-600">Ссылка на оценку</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-white rounded text-purple-600">
                          {'{results_link}'}
                        </code>
                        <span className="text-gray-600">Ссылка на результаты</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-white rounded text-purple-600">
                          {'{days_left}'}
                        </code>
                        <span className="text-gray-600">Дней до окончания</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-white rounded text-purple-600">
                          {'{results_date}'}
                        </code>
                        <span className="text-gray-600">Дата результатов</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-6 py-4 border-b border-gray-300">
                    <div className="text-sm text-gray-600 mb-1">От: noreply@company.com</div>
                    <div className="text-sm text-gray-600 mb-1">Кому: ivan.ivanov@company.com</div>
                    <div className="text-gray-900">Тема: {editedTemplate.subject.replace('{campaign_name}', 'Оценка лидерского потенциала, Q2 2024')}</div>
                  </div>
                  <div className="px-6 py-6">
                    <div className="whitespace-pre-wrap text-gray-800" style={{ lineHeight: '1.6' }}>
                      {renderPreview()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Тестовая отправка */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Send className="w-5 h-5 text-purple-600" />
              <h2 className="text-gray-900">Тестовая отправка</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Отправьте тестовое письмо на свой email для проверки
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="your.email@company.com"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                Отправить тест
              </button>
            </div>
          </div>

          {/* Статистика */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-4">Статистика отправки (последняя кампания)</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-600 text-sm mb-1">Отправлено</div>
                <div className="text-green-900 text-2xl">156</div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-blue-600 text-sm mb-1">Открыто</div>
                <div className="text-blue-900 text-2xl">142</div>
                <div className="text-blue-600 text-xs">91%</div>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-purple-600 text-sm mb-1">Кликов по ссылке</div>
                <div className="text-purple-900 text-2xl">128</div>
                <div className="text-purple-600 text-xs">82%</div>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-orange-600 text-sm mb-1">Не доставлено</div>
                <div className="text-orange-900 text-2xl">2</div>
                <div className="text-orange-600 text-xs">1.3%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя панель действий */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
        <div className="text-gray-600">
          Настройки будут применены ко всем новым кампаниям
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            Отмена
          </button>
          <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
            Сохранить настройки
          </button>
        </div>
      </div>
    </div>
  );
}
