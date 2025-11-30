import React, { useState } from 'react';
import {
  Settings as SettingsIcon, Bell, Lock, Eye, Globe, Download,
  Save, Shield, Mail, Smartphone, Monitor, Moon, Sun, Palette,
  Database, Trash2, FileText, CheckCircle, AlertCircle, Key
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'security' | 'appearance' | 'data'>('general');
  
  // Общие настройки
  const [language, setLanguage] = useState('ru');
  const [timezone, setTimezone] = useState('Europe/Moscow');
  const [dateFormat, setDateFormat] = useState('DD.MM.YYYY');
  
  // Настройки уведомлений
  const [emailNotifications, setEmailNotifications] = useState({
    newAssessment: true,
    reminders: true,
    results: true,
    comments: false,
    weeklyDigest: true
  });
  
  const [pushNotifications, setPushNotifications] = useState({
    enabled: false,
    newAssessment: true,
    reminders: true
  });

  // Настройки приватности
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showPhone: false,
    showInDirectory: true,
    allowMessages: true
  });

  // Настройки безопасности
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Настройки внешнего вида
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [colorScheme, setColorScheme] = useState('purple');
  const [compactMode, setCompactMode] = useState(false);

  const handleSaveGeneral = () => {
    alert('Общие настройки сохранены!');
  };

  const handleSaveNotifications = () => {
    alert('Настройки уведомлений сохранены!');
  };

  const handleSavePrivacy = () => {
    alert('Настройки приватности сохранены!');
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Заполните все поля');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    if (newPassword.length < 8) {
      alert('Пароль должен содержать минимум 8 символов');
      return;
    }
    alert('Пароль успешно изменен!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleExportData = () => {
    alert('Ваши данные будут подготовлены и отправлены на email в течение 24 часов');
  };

  const handleDeleteAccount = () => {
    if (confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) {
      alert('Запрос на удаление аккаунта отправлен. Вы получите подтверждение на email.');
    }
  };

  const tabs = [
    { id: 'general' as const, name: 'Общие', icon: SettingsIcon },
    { id: 'notifications' as const, name: 'Уведомления', icon: Bell },
    { id: 'privacy' as const, name: 'Приватность', icon: Eye },
    { id: 'security' as const, name: 'Безопасность', icon: Lock },
    { id: 'appearance' as const, name: 'Внешний вид', icon: Palette },
    { id: 'data' as const, name: 'Данные', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div>
        <h1 className="text-gray-900 text-2xl mb-2">Настройки</h1>
        <p className="text-gray-600">
          Управляйте настройками вашего аккаунта и приложения
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Боковое меню */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Контент */}
        <div className="col-span-9">
          {/* Общие настройки */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 text-xl mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-purple-600" />
                Общие настройки
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Язык интерфейса</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                    <option value="uk">Українська</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Часовой пояс</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Europe/Moscow">Москва (UTC+3)</option>
                    <option value="Europe/Kaliningrad">Калининград (UTC+2)</option>
                    <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
                    <option value="Asia/Novosibirsk">Новосибирск (UTC+7)</option>
                    <option value="Asia/Vladivostok">Владивосток (UTC+10)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Формат даты</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="DD.MM.YYYY">ДД.ММ.ГГГГ (31.12.2024)</option>
                    <option value="MM/DD/YYYY">ММ/ДД/ГГГГ (12/31/2024)</option>
                    <option value="YYYY-MM-DD">ГГГГ-ММ-ДД (2024-12-31)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveGeneral}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Сохранить изменения
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Уведомления */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 text-xl mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-purple-600" />
                Настройки уведомлений
              </h2>

              <div className="space-y-6">
                {/* Email уведомления */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <h3 className="text-gray-900">Email уведомления</h3>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <div className="text-gray-900 mb-1">Новые оценки</div>
                        <div className="text-gray-600 text-sm">Уведомления о новых приглашениях к оценке</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailNotifications.newAssessment}
                        onChange={(e) => setEmailNotifications({ ...emailNotifications, newAssessment: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <div className="text-gray-900 mb-1">Напоминания</div>
                        <div className="text-gray-600 text-sm">Напоминания о незавершенных оценках</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailNotifications.reminders}
                        onChange={(e) => setEmailNotifications({ ...emailNotifications, reminders: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <div className="text-gray-900 mb-1">Результаты</div>
                        <div className="text-gray-600 text-sm">Уведомления о готовности результатов</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailNotifications.results}
                        onChange={(e) => setEmailNotifications({ ...emailNotifications, results: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <div className="text-gray-900 mb-1">Комментарии</div>
                        <div className="text-gray-600 text-sm">Новые комментарии к вашим оценкам</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailNotifications.comments}
                        onChange={(e) => setEmailNotifications({ ...emailNotifications, comments: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <div className="text-gray-900 mb-1">Еженедельный дайджест</div>
                        <div className="text-gray-600 text-sm">Сводка активности за неделю</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailNotifications.weeklyDigest}
                        onChange={(e) => setEmailNotifications({ ...emailNotifications, weeklyDigest: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Push уведомления */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <h3 className="text-gray-900">Push уведомления</h3>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <div className="text-gray-900 mb-1">Включить push-уведомления</div>
                        <div className="text-gray-600 text-sm">Разрешить отправку уведомлений в браузер</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={pushNotifications.enabled}
                        onChange={(e) => setPushNotifications({ ...pushNotifications, enabled: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                    </label>

                    {pushNotifications.enabled && (
                      <>
                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ml-4">
                          <div>
                            <div className="text-gray-900 mb-1">Новые оценки</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={pushNotifications.newAssessment}
                            onChange={(e) => setPushNotifications({ ...pushNotifications, newAssessment: e.target.checked })}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ml-4">
                          <div>
                            <div className="text-gray-900 mb-1">Напоминания</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={pushNotifications.reminders}
                            onChange={(e) => setPushNotifications({ ...pushNotifications, reminders: e.target.checked })}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                          />
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveNotifications}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Сохранить изменения
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Приватность */}
          {activeTab === 'privacy' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 text-xl mb-6 flex items-center gap-2">
                <Eye className="w-6 h-6 text-purple-600" />
                Настройки приватности
              </h2>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="text-gray-900 mb-1">Показывать email в профиле</div>
                      <div className="text-gray-600 text-sm">Другие пользователи смогут видеть ваш email</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.showEmail}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, showEmail: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="text-gray-900 mb-1">Показывать телефон в профиле</div>
                      <div className="text-gray-600 text-sm">Другие пользователи смогут видеть ваш телефон</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.showPhone}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, showPhone: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="text-gray-900 mb-1">Отображаться в справочнике сотрудников</div>
                      <div className="text-gray-600 text-sm">Ваш профиль будет виден всем сотрудникам</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.showInDirectory}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, showInDirectory: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="text-gray-900 mb-1">Разрешить отправку сообщений</div>
                      <div className="text-gray-600 text-sm">Другие пользователи могут связаться с вами</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.allowMessages}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, allowMessages: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-blue-900 text-sm">
                      <strong>Обратите внимание:</strong> Некоторые данные могут быть видны руководителю и HR-отделу независимо от этих настроек в соответствии с политикой компании.
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSavePrivacy}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Сохранить изменения
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Безопасность */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Смена пароля */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-gray-900 text-xl mb-6 flex items-center gap-2">
                  <Key className="w-6 h-6 text-purple-600" />
                  Смена пароля
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Текущий пароль</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Введите текущий пароль"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Новый пароль</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Минимум 8 символов"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Подтверждение пароля</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Повторите новый пароль"
                    />
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-gray-900 mb-2">Требования к паролю:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                        Минимум 8 символов
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
                        Хотя бы одна заглавная буква
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
                        Хотя бы одна цифра
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${newPassword === confirmPassword && newPassword.length > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                        Пароли совпадают
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Изменить пароль
                  </button>
                </div>
              </div>

              {/* Двухфакторная аутентификация */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-gray-900 text-xl mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                  Двухфакторная аутентификация
                </h2>

                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div>
                    <div className="text-gray-900 mb-1">Включить 2FA</div>
                    <div className="text-gray-600 text-sm">Дополнительная защита вашего аккаунта с помощью кода из приложения</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                </label>

                {twoFactorEnabled && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-green-900 text-sm">
                        Двухфакторная аутентификация включена. Используйте приложение Google Authenticator или аналогичное для генерации кодов.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Активные сессии */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-gray-900 text-xl mb-6 flex items-center gap-2">
                  <Monitor className="w-6 h-6 text-purple-600" />
                  Активные сессии
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Monitor className="w-8 h-8 text-purple-600" />
                      <div>
                        <div className="text-gray-900">Chrome на Windows</div>
                        <div className="text-gray-600 text-sm">Москва, Россия • Сейчас активна</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                      Текущая
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Smartphone className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="text-gray-900">Safari на iPhone</div>
                        <div className="text-gray-600 text-sm">Москва, Россия • 2 часа назад</div>
                      </div>
                    </div>
                    <button className="text-red-600 hover:text-red-700">
                      Завершить
                    </button>
                  </div>
                </div>

                <button className="mt-4 text-red-600 hover:text-red-700">
                  Завершить все другие сессии
                </button>
              </div>
            </div>
          )}

          {/* Внешний вид */}
          {activeTab === 'appearance' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 text-xl mb-6 flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-600" />
                Настройки внешнего вида
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-4">Тема оформления</label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        theme === 'light' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <div className="text-gray-900 text-center">Светлая</div>
                    </button>

                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        theme === 'dark' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <Moon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-gray-900 text-center">Темная</div>
                    </button>

                    <button
                      onClick={() => setTheme('auto')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        theme === 'auto' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                      <div className="text-gray-900 text-center">Авто</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-4">Цветовая схема</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['purple', 'blue', 'green', 'pink'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setColorScheme(color)}
                        className={`h-12 rounded-lg border-2 transition-colors ${
                          colorScheme === color ? 'border-gray-900 scale-105' : 'border-gray-200'
                        } ${
                          color === 'purple' ? 'bg-purple-500' :
                          color === 'blue' ? 'bg-blue-500' :
                          color === 'green' ? 'bg-green-500' :
                          'bg-pink-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div>
                    <div className="text-gray-900 mb-1">Компактный режим</div>
                    <div className="text-gray-600 text-sm">Уменьшить отступы и размеры элементов</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                </label>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => alert('Настройки внешнего вида сохранены!')}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Сохранить изменения
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Данные */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              {/* Экспорт данных */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-gray-900 text-xl mb-6 flex items-center gap-2">
                  <Download className="w-6 h-6 text-purple-600" />
                  Экспорт данных
                </h2>

                <p className="text-gray-600 mb-4">
                  Вы можете запросить копию всех ваших данных в системе. Архив будет подготовлен и отправлен на ваш email в течение 24 часов.
                </p>

                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Запросить экспорт данных
                </button>
              </div>

              {/* Удаление аккаунта */}
              <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                <h2 className="text-red-600 text-xl mb-6 flex items-center gap-2">
                  <Trash2 className="w-6 h-6" />
                  Удаление аккаунта
                </h2>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-red-900 text-sm">
                      <strong>Внимание!</strong> Удаление аккаунта необратимо. Все ваши данные, включая историю оценок и комментарии, будут безвозвратно удалены.
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  Перед удалением аккаунта рекомендуем экспортировать ваши данные. После отправки запроса на удаление у вас будет 30 дней на отмену решения.
                </p>

                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Удалить аккаунт
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
