import React, { useState } from 'react';
import { Plus, Users, Calendar, TrendingUp, BarChart3, Bell, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { View, Assessment, UserRole } from '../App';

interface DashboardProps {
  onNavigate: (view: View, assessment?: Assessment) => void;
  userRole: UserRole;
}

const mockAssessments: Assessment[] = [
  {
    id: '1',
    name: 'Оценка лидерского потенциала, Q4 2024',
    project: 'Проект развития руководителей',
    createdDate: '2024-09-15',
    participants: 16,
    completed: 12,
    status: 'published'
  },
  {
    id: '2',
    name: 'Оценка компетенций команды продаж',
    project: 'Проект повышения эффективности',
    createdDate: '2024-09-10',
    participants: 8,
    completed: 8,
    status: 'completed'
  },
  {
    id: '3',
    name: 'Годовая оценка 360 градусов',
    project: 'Корпоративная оценка',
    createdDate: '2024-09-05',
    participants: 45,
    completed: 38,
    status: 'published'
  }
];

export function Dashboard({ onNavigate, userRole }: DashboardProps) {
  const [assessments] = useState<Assessment[]>(mockAssessments);

  if (userRole === 'admin') {
    return <AdminDashboard assessments={assessments} onNavigate={onNavigate} />;
  }
  
  return <EmployeeDashboard assessments={assessments} onNavigate={onNavigate} />;
}

function AdminDashboard({ assessments, onNavigate }: { assessments: Assessment[], onNavigate: (view: View, assessment?: Assessment) => void }) {
  return (
    <div className="space-y-8">
      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-gray-500 mb-1">Активные участники</div>
          <div className="text-gray-900 text-3xl">69</div>
          <div className="text-green-600 text-sm mt-2">+12% за неделю</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-gray-500 mb-1">Завершенных оценок</div>
          <div className="text-gray-900 text-3xl">58</div>
          <div className="text-gray-500 text-sm mt-2">84% от общего числа</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-gray-500 mb-1">В процессе</div>
          <div className="text-gray-900 text-3xl">11</div>
          <div className="text-orange-600 text-sm mt-2">Требуют внимания</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-gray-500 mb-1">Средний балл</div>
          <div className="text-gray-900 text-3xl">4.2</div>
          <div className="text-green-600 text-sm mt-2">+0.3 к прошлому кварталу</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Активные кампании */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-gray-900">Активные кампании</h2>
            <button
              onClick={() => onNavigate('campaign-wizard')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Создать кампанию
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-1">{assessment.name}</h3>
                      <p className="text-gray-500 text-sm">{assessment.project}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {assessment.participants} участников
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(assessment.createdDate).toLocaleDateString('ru-RU')} - 31.12.2024
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onNavigate('detailed-reports', assessment)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Детальный отчет
                    </button>
                    <button
                      onClick={() => onNavigate('results', assessment)}
                      className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      Отчет
                    </button>
                    <button 
                      onClick={() => onNavigate('assessment-form', assessment)}
                      className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      Пройти оценку
                    </button>
                    <button 
                      onClick={() => onNavigate('participants')}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Участники
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      Настроить
                    </button>
                  </div>
                </div>
                {assessment.status === 'published' && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Прогресс завершения</span>
                      <span className="text-gray-900">
                        {assessment.completed} / {assessment.participants} ({Math.round((assessment.completed / assessment.participants) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(assessment.completed / assessment.participants) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Уведомления */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900">Уведомления</h2>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            <div className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm">Иванов А.Б. не завершил самооценку</p>
                  <p className="text-gray-500 text-xs mt-1">Срок: 25.11.2024</p>
                  <button className="text-purple-600 text-xs mt-2 hover:underline">
                    Отправить напоминание
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm">3 участника ожидают оценки коллег</p>
                  <p className="text-gray-500 text-xs mt-1">Кампания: Лидерство Q4</p>
                </div>
              </div>
            </div>

            <div className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm">Петрова И.С. завершила оценку</p>
                  <p className="text-gray-500 text-xs mt-1">2 часа назад</p>
                </div>
              </div>
            </div>

            <div className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm">Новая кампания готова к запуску</p>
                  <p className="text-gray-500 text-xs mt-1">Годовая оценка 360°</p>
                  <button className="text-purple-600 text-xs mt-2 hover:underline">
                    Опубликовать
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ключевые метрики */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-6">Статус оценок по подразделениям</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-48 text-gray-700">Отдел разработки</div>
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-green-500" style={{ width: '75%' }} title="Завершено: 75%" />
                  <div className="bg-yellow-500" style={{ width: '15%' }} title="В процессе: 15%" />
                </div>
              </div>
              <span className="text-sm text-gray-600 w-20">15/16</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-48 text-gray-700">Отдел продаж</div>
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-green-500" style={{ width: '100%' }} title="Завершено: 100%" />
                </div>
              </div>
              <span className="text-sm text-gray-600 w-20">8/8</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-48 text-gray-700">Маркетинг</div>
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-green-500" style={{ width: '60%' }} title="Завершено: 60%" />
                  <div className="bg-yellow-500" style={{ width: '30%' }} title="В процессе: 30%" />
                </div>
              </div>
              <span className="text-sm text-gray-600 w-20">18/20</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-48 text-gray-700">HR и администрация</div>
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-green-500" style={{ width: '83%' }} title="Завершено: 83%" />
                  <div className="bg-yellow-500" style={{ width: '17%' }} title="В процессе: 17%" />
                </div>
              </div>
              <span className="text-sm text-gray-600 w-20">5/6</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Завершено</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-gray-600">В процессе</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-600">Не начато</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeDashboard({ assessments, onNavigate }: { assessments: Assessment[], onNavigate: (view: View, assessment?: Assessment) => void }) {
  return (
    <div className="space-y-8">
      {/* Ваши задачи */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Ваши задачи</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-gray-900">Заполните свою самооценку</h3>
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded">Срочно</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">Кампания: Оценка лидерского потенциала, Q4 2024</p>
              <p className="text-gray-500 text-sm mb-3">Срок: 25 ноября 2024</p>
              <button
                onClick={() => onNavigate('take', assessments[0])}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
              >
                Начать оценку
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-gray-900">Оцените 3 коллег</h3>
                <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded">В процессе</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">Кампания: Годовая оценка 360 градусов</p>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="w-full bg-yellow-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '33%' }} />
                  </div>
                </div>
                <span className="text-sm text-gray-600">1/3</span>
              </div>
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm">
                Продолжить
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-gray-900">Оценка руководителя завершена</h3>
                <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded">Завершено</span>
              </div>
              <p className="text-gray-600 text-sm">Кампания: Оценка компетенций команды продаж</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ожидайте оценки */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900">Ожидайте оценки</h2>
            <p className="text-gray-500 text-sm mt-1">Кампания: Оценка лидерского потенциала, Q4 2024</p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm">Петров П.П.</div>
                    <div className="text-gray-500 text-xs">Руководитель</div>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm">Сидорова С.С.</div>
                    <div className="text-gray-500 text-xs">Коллега</div>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm">Козлов К.К.</div>
                    <div className="text-gray-500 text-xs">Коллега</div>
                  </div>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm">Михайлов М.М.</div>
                    <div className="text-gray-500 text-xs">Подчиненный</div>
                  </div>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm">Николаева Н.Н.</div>
                    <div className="text-gray-500 text-xs">Подчиненный</div>
                  </div>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 text-sm">Прогресс сбора оценок</span>
                <span className="text-gray-900 text-sm">2 из 5</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Ваши прошлые отчеты */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900">Ваши прошлые отчеты</h2>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-gray-900">Оценка компетенций Q3 2024</div>
                  <div className="text-gray-500 text-sm">15 сентября 2024</div>
                </div>
              </div>
              <button className="px-3 py-1 text-purple-600 hover:bg-purple-50 rounded text-sm">
                Скачать PDF
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-gray-900">Годовая оценка 360° 2023</div>
                  <div className="text-gray-500 text-sm">20 декабря 2023</div>
                </div>
              </div>
              <button className="px-3 py-1 text-purple-600 hover:bg-purple-50 rounded text-sm">
                Скачать PDF
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-gray-900">Оценка лидерского потенциала Q2 2023</div>
                  <div className="text-gray-500 text-sm">10 июля 2023</div>
                </div>
              </div>
              <button className="px-3 py-1 text-purple-600 hover:bg-purple-50 rounded text-sm">
                Скачать PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}