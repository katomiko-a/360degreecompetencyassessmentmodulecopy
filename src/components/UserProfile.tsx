import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Briefcase, Calendar, Award, 
  TrendingUp, Target, Edit2, Camera, Save, X, CheckCircle
} from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  dateOfBirth: string;
  hireDate: string;
  manager: string;
}

interface AssessmentHistory {
  id: string;
  name: string;
  date: string;
  score: number;
  status: 'completed' | 'in-progress' | 'pending';
}

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'Ирина',
    lastName: 'Петрова',
    middleName: 'Сергеевна',
    email: 'i.petrova@company.com',
    phone: '+7 (916) 123-45-67',
    position: 'Senior Project Manager',
    department: 'Отдел разработки',
    location: 'Москва, Россия',
    dateOfBirth: '1990-03-15',
    hireDate: '2018-09-01',
    manager: 'Сидоров Сергей Петрович'
  });

  const [editedData, setEditedData] = useState<ProfileData>(profileData);

  const assessmentHistory: AssessmentHistory[] = [
    { id: '1', name: 'Оценка лидерского потенциала Q4 2024', date: '30.11.2024', score: 4.1, status: 'completed' },
    { id: '2', name: 'Оценка компетенций Q2 2024', date: '30.06.2024', score: 4.0, status: 'completed' },
    { id: '3', name: 'Оценка управленческих навыков Q4 2023', date: '15.12.2023', score: 3.8, status: 'completed' },
    { id: '4', name: 'Годовая оценка 2023', date: '20.12.2023', score: 4.2, status: 'completed' },
  ];

  const statistics = {
    totalAssessments: 12,
    completedAssessments: 10,
    averageScore: 4.0,
    asAssessor: 45,
    competenciesImproved: 8
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
    alert('Профиль успешно обновлен!');
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-green-500';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-100';
    if (score >= 4.0) return 'bg-green-50';
    if (score >= 3.5) return 'bg-yellow-50';
    return 'bg-orange-50';
  };

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-2xl mb-2">Личный кабинет</h1>
          <p className="text-gray-600">
            Управляйте своими данными и просматривайте историю оценок
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Левая панель - Профиль */}
        <div className="col-span-4 space-y-6">
          {/* Карточка профиля */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center">
              {/* Аватар */}
              <div className="relative mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              {/* Имя и должность */}
              <h2 className="text-gray-900 text-xl text-center mb-1">
                {profileData.lastName} {profileData.firstName} {profileData.middleName}
              </h2>
              <p className="text-gray-600 text-center mb-1">{profileData.position}</p>
              <p className="text-gray-500 text-sm text-center mb-4">{profileData.department}</p>

              {/* Кнопка редактирования */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors w-full justify-center"
                >
                  <Edit2 className="w-4 h-4" />
                  Редактировать профиль
                </button>
              ) : (
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex-1 justify-center"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors flex-1 justify-center"
                  >
                    <X className="w-4 h-4" />
                    Отмена
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Статистика */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Статистика участия
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <div className="text-gray-600 text-sm">Всего оценок</div>
                  <div className="text-gray-900 text-2xl">{statistics.totalAssessments}</div>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="text-gray-600 text-sm">Завершено</div>
                  <div className="text-gray-900 text-2xl">{statistics.completedAssessments}</div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="text-gray-600 text-sm">Средний балл</div>
                  <div className="text-gray-900 text-2xl">{statistics.averageScore.toFixed(1)}</div>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Оценил других</span>
                  <span className="text-gray-900">{statistics.asAssessor}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Компетенций улучшено</span>
                  <span className="text-gray-900">{statistics.competenciesImproved}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Правая панель - Детали */}
        <div className="col-span-8 space-y-6">
          {/* Личные данные */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-900 text-lg mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Личные данные
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm mb-2">Фамилия</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.lastName}
                    onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{profileData.lastName}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Имя</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.firstName}
                    onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{profileData.firstName}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Отчество</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.middleName}
                    onChange={(e) => setEditedData({ ...editedData, middleName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{profileData.middleName}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Дата рождения</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedData.dateOfBirth}
                    onChange={(e) => setEditedData({ ...editedData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {new Date(profileData.dateOfBirth).toLocaleDateString('ru-RU')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Контактная информация */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-900 text-lg mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Контактная информация
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {profileData.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Телефон</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedData.phone}
                    onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {profileData.phone}
                  </div>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 text-sm mb-2">Местоположение</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.location}
                    onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {profileData.location}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Рабочая информация */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-900 text-lg mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Рабочая информация
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm mb-2">Должность</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{profileData.position}</div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Подразделение</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{profileData.department}</div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Дата приема на работу</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(profileData.hireDate).toLocaleDateString('ru-RU')}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Руководитель</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  {profileData.manager}
                </div>
              </div>
            </div>
          </div>

          {/* История оценок */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-900 text-lg mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              История оценок
            </h3>

            <div className="space-y-3">
              {assessmentHistory.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="text-gray-900 mb-1">{assessment.name}</div>
                    <div className="text-gray-500 text-sm">{assessment.date}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-lg ${getScoreBgColor(assessment.score)}`}>
                      <span className={`text-lg ${getScoreColor(assessment.score)}`}>
                        {assessment.score.toFixed(1)}
                      </span>
                    </div>
                    <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      Просмотреть
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
