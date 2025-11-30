import React, { useState } from 'react';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertCircle, CheckCircle, Download, 
  MessageSquare, Award, Target, BookOpen, Filter, Users, User
} from 'lucide-react';

interface Assessment {
  id: string;
  name: string;
  project: string;
  createdDate: string;
  participants: number;
  completed: number;
  status: 'draft' | 'published' | 'completed';
}

interface CompetencyScore {
  name: string;
  self: number;
  manager: number;
  peers: number;
  subordinates: number;
  average: number;
}

interface Comment {
  competency: string;
  text: string;
  role: string;
}

interface DetailedReportsProps {
  assessment?: Assessment;
  onBack?: () => void;
}

const mockData: CompetencyScore[] = [
  { name: 'Коммуникация', self: 4.5, manager: 4.0, peers: 4.3, subordinates: 4.2, average: 4.2 },
  { name: 'Лидерство', self: 3.5, manager: 4.5, peers: 4.0, subordinates: 4.3, average: 4.1 },
  { name: 'Командная работа', self: 4.8, manager: 4.7, peers: 4.9, subordinates: 4.8, average: 4.8 },
  { name: 'Ориентация на результат', self: 4.0, manager: 3.5, peers: 3.8, subordinates: 3.7, average: 3.7 },
  { name: 'Адаптивность', self: 3.8, manager: 4.2, peers: 4.0, subordinates: 4.1, average: 4.1 },
  { name: 'Стратегическое мышление', self: 3.2, manager: 4.0, peers: 3.5, subordinates: 3.3, average: 3.5 },
];

const mockComments: Comment[] = [
  { 
    competency: 'Командная работа', 
    text: 'Всегда готова помочь коллегам, делится знаниями и опытом. Отличный командный игрок!',
    role: 'Коллега'
  },
  { 
    competency: 'Коммуникация', 
    text: 'Четко и ясно формулирует свои мысли, всегда можно получить быстрый и понятный ответ.',
    role: 'Руководитель'
  },
  { 
    competency: 'Лидерство', 
    text: 'Берет на себя ответственность за сложные задачи, вдохновляет команду своим примером.',
    role: 'Подчиненный'
  },
  { 
    competency: 'Командная работа', 
    text: 'Создает позитивную атмосферу в команде, помогает разрешать конфликты.',
    role: 'Коллега'
  },
];

const recommendations = {
  strengths: [
    {
      competency: 'Командная работа',
      score: 4.8,
      description: 'Исключительная способность работать в команде',
      actions: [
        'Продолжайте делиться лучшими практиками с коллегами',
        'Рассмотрите возможность менторства для младших сотрудников',
        'Ваш опыт ценен - участвуйте в кросс-функциональных проектах'
      ]
    },
    {
      competency: 'Коммуникация',
      score: 4.2,
      description: 'Эффективное взаимодействие с командой',
      actions: [
        'Проводите регулярные встречи с командой для обмена опытом',
        'Развивайте навыки публичных выступлений'
      ]
    },
    {
      competency: 'Лидерство',
      score: 4.1,
      description: 'Проявление лидерских качеств',
      actions: [
        'Инициируйте новые проекты и возглавьте рабочие группы',
        'Развивайте стратегическое видение'
      ]
    }
  ],
  development: [
    {
      competency: 'Стратегическое мышление',
      score: 3.5,
      gap: -0.3,
      description: 'Область для развития стратегических навыков',
      actions: [
        'Рекомендуем пройти курс "Стратегическое планирование для менеджеров"',
        'Участвуйте в стратегических сессиях компании',
        'Читайте кейсы успешных стратегий ведущих компаний'
      ],
      resources: [
        { type: 'Курс', name: 'Strategic Thinking (Coursera)', duration: '4 недели' },
        { type: 'Книга', name: '"Хорошая стратегия, плохая стратегия" - Ричард Румельт' }
      ]
    },
    {
      competency: 'Ориентация на результат',
      score: 3.7,
      gap: -0.3,
      description: 'Можно усилить фокус на достижении целей',
      actions: [
        'Используйте методологию OKR для постановки целей',
        'Регулярно отслеживайте прогресс по ключевым метрикам',
        'Обсудите с руководителем приоритеты и ожидания'
      ],
      resources: [
        { type: 'Тренинг', name: 'Управление результативностью', duration: '2 дня' },
        { type: 'Статья', name: 'Как ставить и достигать амбициозные цели' }
      ]
    }
  ]
};

export function DetailedReports({ assessment, onBack }: DetailedReportsProps) {
  const [view, setView] = useState<'employee' | 'manager'>('employee');
  
  return (
    <div className="space-y-6">
      {/* Переключатель вида */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-2xl mb-2">Отчеты и аналитика</h1>
          <p className="text-gray-600">
            Результаты оценки 360 градусов с детальной аналитикой
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('employee')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'employee'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Отчет сотрудника
          </button>
          <button
            onClick={() => setView('manager')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'manager'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Отчет руководителя
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Скачать PDF
          </button>
        </div>
      </div>

      {view === 'employee' ? <EmployeeReport /> : <ManagerReport />}
    </div>
  );
}

function EmployeeReport() {
  const [showAllComments, setShowAllComments] = useState(false);

  const gapAnalysisData = mockData.map(item => ({
    name: item.name,
    'Самооценка': item.self,
    'Оценка окружения': item.average,
    gap: item.self - item.average
  }));

  const displayedComments = showAllComments ? mockComments : mockComments.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Шапка отчета */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl mb-2">Петрова Ирина Сергеевна</h2>
            <p className="text-purple-100 mb-4">Senior Project Manager • Отдел разработки</p>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-purple-100 text-sm">Кампания</div>
                <div className="text-white">Оценка лидерского потенциала, Q4 2024</div>
              </div>
              <div>
                <div className="text-purple-100 text-sm">Период</div>
                <div className="text-white">15.11.2024 - 30.11.2024</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-6xl mb-2">4.1</div>
            <div className="text-purple-100">Общий балл</div>
          </div>
        </div>
      </div>

      {/* Радарная диаграмма */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-6 h-6 text-purple-600" />
          <h3 className="text-gray-900 text-xl">Профиль компетенций</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Радарная диаграмма показывает уровень развития компетенций по оценке разных групп
        </p>

        <ResponsiveContainer width="100%" height={500}>
          <RadarChart data={mockData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 5]} 
              tick={{ fill: '#6b7280' }}
            />
            <Radar 
              name="Самооценка" 
              dataKey="self" 
              stroke="#ec4899" 
              fill="#ec4899" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar 
              name="Руководитель" 
              dataKey="manager" 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar 
              name="Коллеги" 
              dataKey="peers" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar 
              name="Подчиненные" 
              dataKey="subordinates" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <span className="text-gray-700 text-sm">Самооценка</span>
            </div>
            <div className="text-2xl text-gray-900">3.9</div>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-gray-700 text-sm">Руководитель</span>
            </div>
            <div className="text-2xl text-gray-900">4.2</div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-700 text-sm">Коллеги</span>
            </div>
            <div className="text-2xl text-gray-900">4.1</div>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-700 text-sm">Подчиненные</span>
            </div>
            <div className="text-2xl text-gray-900">4.1</div>
          </div>
        </div>
      </div>

      {/* Разрывный анализ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h3 className="text-gray-900 text-xl">Разрывный анализ</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Сравнение самооценки с оценкой окружения помогает выявить зоны роста
        </p>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={gapAnalysisData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis type="number" domain={[0, 5]} />
            <YAxis type="category" dataKey="name" width={180} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="Самооценка" fill="#ec4899" radius={[0, 4, 4, 0]} />
            <Bar dataKey="Оценка окружения" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {gapAnalysisData.map((item) => (
            <div 
              key={item.name}
              className={`p-4 rounded-lg border ${
                Math.abs(item.gap) < 0.3 
                  ? 'bg-green-50 border-green-200' 
                  : item.gap > 0 
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="text-sm text-gray-700 mb-1">{item.name}</div>
              <div className="flex items-center gap-2">
                {Math.abs(item.gap) < 0.3 ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700">Оценки согласованы</span>
                  </>
                ) : item.gap > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-orange-700">Переоценка (+{item.gap.toFixed(1)})</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-700">Недооценка ({item.gap.toFixed(1)})</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Сильные стороны */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-6 h-6 text-green-600" />
          <h3 className="text-gray-900 text-xl">Сильные стороны</h3>
        </div>

        <div className="space-y-6">
          {recommendations.strengths.map((strength, index) => (
            <div key={index} className="border-l-4 border-green-500 bg-green-50 p-6 rounded-r-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-gray-900 text-lg mb-1">{strength.competency}</h4>
                  <p className="text-gray-600 text-sm">{strength.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl text-green-600">{strength.score}</div>
                  <div className="text-xs text-gray-500">из 5</div>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-gray-900 text-sm mb-2">Рекомендации:</h5>
                <ul className="space-y-2">
                  {strength.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Зоны развития */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-6 h-6 text-orange-600" />
          <h3 className="text-gray-900 text-xl">Зоны развития</h3>
        </div>

        <div className="space-y-6">
          {recommendations.development.map((area, index) => (
            <div key={index} className="border-l-4 border-orange-500 bg-orange-50 p-6 rounded-r-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-gray-900 text-lg mb-1">{area.competency}</h4>
                  <p className="text-gray-600 text-sm">{area.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl text-orange-600">{area.score}</div>
                  <div className="text-xs text-gray-500">из 5</div>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-gray-900 text-sm mb-2">План развития:</h5>
                <ul className="space-y-2">
                  {area.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Target className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h5 className="text-gray-900 text-sm mb-3">Рекомендуемые ресурсы:</h5>
                <div className="space-y-2">
                  {area.resources.map((resource, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-orange-600" />
                        <div>
                          <div className="text-sm text-gray-900">{resource.name}</div>
                          <div className="text-xs text-gray-500">{resource.type}</div>
                        </div>
                      </div>
                      {resource.duration && (
                        <span className="text-xs text-gray-500">{resource.duration}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Комментарии */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-6 h-6 text-purple-600" />
          <h3 className="text-gray-900 text-xl">Обратная связь от коллег</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Анонимные комментарии помогают лучше понять восприятие ваших компетенций
        </p>

        <div className="space-y-4">
          {displayedComments.map((comment, index) => (
            <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-purple-200 text-purple-700 rounded text-xs">
                      {comment.competency}
                    </span>
                    <span className="text-gray-500 text-sm">• {comment.role}</span>
                  </div>
                  <p className="text-gray-700 italic">"{comment.text}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockComments.length > 2 && (
          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className="mt-4 w-full py-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            {showAllComments ? 'Скрыть' : `Показать еще ${mockComments.length - 2} комментариев`}
          </button>
        )}
      </div>

      {/* Следующие шаги */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-xl mb-4">Следующие шаги</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Обсудите результаты с вашим руководителем</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Составьте индивидуальный план развития на основе зон роста</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Запишитесь на рекомендованные тренинги и курсы</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Запланируйте промежуточную оценку прогресса через 3 месяца</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManagerReport() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');

  const teamData = [
    { id: 1, name: 'Иванов И.И.', position: 'Senior Developer', department: 'Разработка', communication: 4.2, leadership: 3.8, teamwork: 4.5, result: 4.0, adaptability: 4.1, strategy: 3.5 },
    { id: 2, name: 'Петрова И.С.', position: 'Project Manager', department: 'Разработка', communication: 4.5, leadership: 4.3, teamwork: 4.8, result: 3.7, adaptability: 4.2, strategy: 3.8 },
    { id: 3, name: 'Сидоров С.П.', position: 'Team Lead', department: 'Разработка', communication: 4.0, leadership: 4.5, teamwork: 4.2, result: 4.3, adaptability: 4.0, strategy: 4.2 },
    { id: 4, name: 'Козлова А.В.', position: 'HR Manager', department: 'HR', communication: 4.7, leadership: 4.0, teamwork: 4.6, result: 4.2, adaptability: 4.5, strategy: 3.9 },
    { id: 5, name: 'Михайлов М.М.', position: 'Sales Manager', department: 'Продажи', communication: 4.3, leadership: 3.9, teamwork: 4.0, result: 4.5, adaptability: 4.2, strategy: 3.7 },
  ];

  const departmentAverage = [
    { department: 'Разработка', communication: 4.2, leadership: 4.2, teamwork: 4.5, result: 4.0, adaptability: 4.1, strategy: 3.8 },
    { department: 'HR', communication: 4.7, leadership: 4.0, teamwork: 4.6, result: 4.2, adaptability: 4.5, strategy: 3.9 },
    { department: 'Продажи', communication: 4.3, leadership: 3.9, teamwork: 4.0, result: 4.5, adaptability: 4.2, strategy: 3.7 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-500';
    if (score >= 4.0) return 'bg-green-400';
    if (score >= 3.5) return 'bg-yellow-400';
    if (score >= 3.0) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-50';
    if (score >= 4.0) return 'bg-green-100';
    if (score >= 3.5) return 'bg-yellow-50';
    if (score >= 3.0) return 'bg-orange-50';
    return 'bg-red-50';
  };

  const filteredTeamData = teamData.filter(member => {
    const deptMatch = selectedDepartment === 'all' || member.department === selectedDepartment;
    const posMatch = selectedPosition === 'all' || member.position === selectedPosition;
    return deptMatch && posMatch;
  });

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-900">Фильтры</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-2">Подразделение</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Все подразделения</option>
              <option value="Разработка">Разработка</option>
              <option value="HR">HR</option>
              <option value="Продажи">Продажи</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Должность</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Все должности</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Team Lead">Team Lead</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Sales Manager">Sales Manager</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedDepartment('all');
                setSelectedPosition('all');
              }}
              className="w-full px-4 py-2 text-purple-600 hover:bg-purple-50 border border-purple-300 rounded-lg transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>

      {/* Сводная таблица по команде */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-gray-900 text-xl">Матрица компетенций команды</h3>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Показано {filteredTeamData.length} сотрудников
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  Сотрудник
                </th>
                <th className="px-6 py-4 text-center text-xs text-gray-700 uppercase tracking-wider">
                  Коммуникация
                </th>
                <th className="px-6 py-4 text-center text-xs text-gray-700 uppercase tracking-wider">
                  Лидерство
                </th>
                <th className="px-6 py-4 text-center text-xs text-gray-700 uppercase tracking-wider">
                  Командная работа
                </th>
                <th className="px-6 py-4 text-center text-xs text-gray-700 uppercase tracking-wider">
                  Результат
                </th>
                <th className="px-6 py-4 text-center text-xs text-gray-700 uppercase tracking-wider">
                  Адаптивность
                </th>
                <th className="px-6 py-4 text-center text-xs text-gray-700 uppercase tracking-wider">
                  Стратегия
                </th>
                <th className="px-6 py-4 text-center text-xs text-gray-700 uppercase tracking-wider bg-purple-50">
                  Средний балл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeamData.map((member) => {
                const avg = ((member.communication + member.leadership + member.teamwork + member.result + member.adaptability + member.strategy) / 6).toFixed(1);
                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 sticky left-0 bg-white">
                      <div>
                        <div className="text-gray-900">{member.name}</div>
                        <div className="text-gray-500 text-sm">{member.position}</div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-center ${getScoreBgColor(member.communication)}`}>
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getScoreColor(member.communication)}`} />
                        <span className="text-gray-900">{member.communication}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-center ${getScoreBgColor(member.leadership)}`}>
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getScoreColor(member.leadership)}`} />
                        <span className="text-gray-900">{member.leadership}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-center ${getScoreBgColor(member.teamwork)}`}>
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getScoreColor(member.teamwork)}`} />
                        <span className="text-gray-900">{member.teamwork}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-center ${getScoreBgColor(member.result)}`}>
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getScoreColor(member.result)}`} />
                        <span className="text-gray-900">{member.result}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-center ${getScoreBgColor(member.adaptability)}`}>
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getScoreColor(member.adaptability)}`} />
                        <span className="text-gray-900">{member.adaptability}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-center ${getScoreBgColor(member.strategy)}`}>
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getScoreColor(member.strategy)}`} />
                        <span className="text-gray-900">{member.strategy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center bg-purple-50">
                      <span className="text-lg text-purple-600">{avg}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-600">≥ 4.5 Отлично</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-gray-600">4.0-4.4 Хорошо</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="text-gray-600">3.5-3.9 Удовлетворительно</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-gray-600">3.0-3.4 Требует внимания</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <span className="text-gray-600">&lt; 3.0 Низкий уровень</span>
            </div>
          </div>
        </div>
      </div>

      {/* Средний балл по компетенциям в отделе */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h3 className="text-gray-900 text-xl">Средний балл по компетенциям в команде</h3>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={departmentAverage}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="department" />
            <YAxis domain={[0, 5]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="communication" name="Коммуникация" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="leadership" name="Лидерство" fill="#ec4899" radius={[4, 4, 0, 0]} />
            <Bar dataKey="teamwork" name="Командная работа" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="result" name="Результат" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="adaptability" name="Адаптивность" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="strategy" name="Стратегия" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ключевые инсайты */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-green-600" />
            <h3 className="text-gray-900">Сильные стороны команды</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Командная работа</span>
              <span className="text-green-600">4.5</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Коммуникация</span>
              <span className="text-green-600">4.4</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Адаптивность</span>
              <span className="text-green-600">4.3</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <h3 className="text-gray-900">Зоны для развития</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700">Стратегическое мышление</span>
              <span className="text-orange-600">3.8</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700">Лидерство</span>
              <span className="text-orange-600">4.0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700">Ориентация на результат</span>
              <span className="text-orange-600">4.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Рекомендации для команды */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-xl mb-4">Рекомендации по развитию команды</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="mb-3">Приоритетные действия:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Организовать тренинг по стратегическому планированию</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Запустить программу развития лидерских качеств</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Внедрить систему OKR для фокуса на результатах</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3">Использовать сильные стороны:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Award className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Проводить cross-functional проекты для обмена опытом</span>
              </li>
              <li className="flex items-start gap-2">
                <Award className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Развивать культуру открытой коммуникации</span>
              </li>
              <li className="flex items-start gap-2">
                <Award className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Поощрять командную работу и взаимопомощь</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}