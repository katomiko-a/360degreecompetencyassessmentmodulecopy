import React, { useState } from 'react';
import { ArrowLeft, Download, TrendingUp, TrendingDown, Minus, User } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import type { Assessment } from '../App';

interface AssessmentResultsProps {
  assessment: Assessment;
  onBack: () => void;
}

const competencies = [
  { id: '1', name: 'Лидерство' },
  { id: '2', name: 'Коммуникация' },
  { id: '3', name: 'Командная работа' },
  { id: '4', name: 'Решение проблем' },
  { id: '5', name: 'Инициативность' }
];

const mockResults = {
  employee: 'Иванов Иван Петрович',
  department: 'Отдел разработки',
  position: 'Senior Developer',
  evaluationDate: '2024-09-20',
  competencyScores: {
    '1': { self: 4, manager: 5, peers: 4.2, subordinates: 4.5, average: 4.4 },
    '2': { self: 4, manager: 4, peers: 4.3, subordinates: 4.2, average: 4.1 },
    '3': { self: 5, manager: 4, peers: 4.5, subordinates: 4.8, average: 4.6 },
    '4': { self: 4, manager: 5, peers: 4.7, subordinates: 4.3, average: 4.5 },
    '5': { self: 3, manager: 4, peers: 3.8, subordinates: 4.0, average: 3.7 }
  },
  comments: [
    {
      role: 'manager',
      author: 'Петров П.П.',
      competency: 'Лидерство',
      text: 'Отличные лидерские качества, вдохновляет команду на достижение целей'
    },
    {
      role: 'peer',
      author: 'Сидоров С.С.',
      competency: 'Командная работа',
      text: 'Всегда готов помочь коллегам, отличный командный игрок'
    },
    {
      role: 'subordinate',
      author: 'Козлов К.К.',
      competency: 'Коммуникация',
      text: 'Ясно формулирует задачи и ожидания'
    },
    {
      role: 'peer',
      author: 'Смирнова А.А.',
      competency: 'Решение проблем',
      text: 'Находит нестандартные решения сложных задач'
    }
  ]
};

export function AssessmentResults({ assessment, onBack }: AssessmentResultsProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed' | 'comments'>('overview');

  const overallAverage = (
    Object.values(mockResults.competencyScores).reduce((sum, scores) => sum + scores.average, 0) /
    competencies.length
  ).toFixed(1);

  // Подготовка данных для радарной диаграммы
  const radarData = competencies.map((comp) => {
    const scores = mockResults.competencyScores[comp.id];
    return {
      competency: comp.name,
      'Самооценка': scores.self,
      'Руководитель': scores.manager,
      'Коллеги': scores.peers,
      'Подчиненные': scores.subordinates,
      'Средняя': scores.average
    };
  });

  // Данные для анализа разрывов
  const gapData = competencies.map((comp) => {
    const scores = mockResults.competencyScores[comp.id];
    const othersAverage = (scores.manager + scores.peers + scores.subordinates) / 3;
    return {
      name: comp.name,
      'Самооценка': scores.self,
      'Оценка окружения': parseFloat(othersAverage.toFixed(1)),
      gap: parseFloat((scores.self - othersAverage).toFixed(1))
    };
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 3.5) return 'text-purple-600 bg-purple-50';
    if (rating >= 2.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (rating: number) => {
    if (rating >= 4.5) return <TrendingUp className="w-4 h-4" />;
    if (rating >= 3.5) return <Minus className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const getGapColor = (gap: number) => {
    if (gap > 0.5) return '#ef4444'; // красный - переоценивает
    if (gap < -0.5) return '#3b82f6'; // синий - недооценивает
    return '#10b981'; // зеленый - адекватная оценка
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-gray-900 text-2xl">Результаты оценки</h1>
            <p className="text-gray-600">{assessment.name}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          Экспорт в PDF
        </button>
      </div>

      {/* Информация о сотруднике */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-gray-900 text-xl mb-1">{mockResults.employee}</h2>
              <p className="text-gray-600">{mockResults.position}</p>
              <p className="text-gray-500 text-sm">{mockResults.department}</p>
              <p className="text-gray-500 text-sm mt-2">
                Дата оценки: {new Date(mockResults.evaluationDate).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-600 mb-1">Общая оценка</div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getRatingColor(parseFloat(overallAverage))}`}>
              <span className="text-3xl">{overallAverage}</span>
              <span className="text-sm">из 5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-1">
            <button
              onClick={() => setSelectedView('overview')}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                selectedView === 'overview'
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Общий обзор
            </button>
            <button
              onClick={() => setSelectedView('detailed')}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                selectedView === 'detailed'
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Детальная оценка
            </button>
            <button
              onClick={() => setSelectedView('comments')}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                selectedView === 'comments'
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Комментарии
            </button>
          </div>
        </div>

        <div className="p-6">
          {selectedView === 'overview' && (
            <div className="space-y-8">
              {/* Радарная диаграмма */}
              <div>
                <h3 className="text-gray-900 mb-4">Радарная диаграмма компетенций</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="competency" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#6b7280' }} />
                    <Radar name="Самооценка" dataKey="Самооценка" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                    <Radar name="Руководитель" dataKey="Руководитель" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="Коллеги" dataKey="Коллеги" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Radar name="Подчиненные" dataKey="Подчиненные" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Разрывный анализ */}
              <div>
                <h3 className="text-gray-900 mb-4">Разрывный анализ (Self vs Others)</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Сравнение самооценки с оценкой окружения помогает выявить области переоценки или недооценки
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gapData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <YAxis domain={[0, 5]} tick={{ fill: '#6b7280' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Самооценка" fill="#a855f7" />
                    <Bar dataKey="Оценка окружения" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {gapData.map((item) => (
                    <div key={item.name} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">{item.name}</div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: getGapColor(item.gap) }}>
                          Разрыв: {item.gap > 0 ? '+' : ''}{item.gap}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Сильные стороны и зоны развития */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gray-900 mb-4">Сильные стороны</h3>
                  <div className="space-y-3">
                    {competencies
                      .sort((a, b) => mockResults.competencyScores[b.id].average - mockResults.competencyScores[a.id].average)
                      .slice(0, 3)
                      .map((comp) => {
                        const score = mockResults.competencyScores[comp.id];
                        return (
                          <div key={comp.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-900">{comp.name}</span>
                              <span className="text-green-600">{score.average.toFixed(1)}</span>
                            </div>
                            <p className="text-gray-600 text-sm italic">
                              "Всегда демонстрирует высокий уровень данной компетенции"
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-4">Зоны развития</h3>
                  <div className="space-y-3">
                    {competencies
                      .sort((a, b) => mockResults.competencyScores[a.id].average - mockResults.competencyScores[b.id].average)
                      .slice(0, 2)
                      .map((comp) => {
                        const score = mockResults.competencyScores[comp.id];
                        return (
                          <div key={comp.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-900">{comp.name}</span>
                              <span className="text-yellow-600">{score.average.toFixed(1)}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              Рекомендуется уделить внимание развитию этой компетенции
                            </p>
                            <button className="text-purple-600 text-sm hover:underline">
                              Рекомендации по развитию →
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Распределение оценок */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-gray-900 mb-4">Средние оценки по группам</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-purple-600 text-sm mb-1">Самооценка</div>
                    <div className="text-purple-900 text-2xl">4.0</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-blue-600 text-sm mb-1">Руководитель</div>
                    <div className="text-blue-900 text-2xl">4.4</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-green-600 text-sm mb-1">Коллеги</div>
                    <div className="text-green-900 text-2xl">4.3</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-orange-600 text-sm mb-1">Подчиненные</div>
                    <div className="text-orange-900 text-2xl">4.4</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'detailed' && (
            <div className="space-y-4">
              <h3 className="text-gray-900 mb-4">Детальный анализ по компетенциям</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">Компетенция</th>
                      <th className="text-center py-3 px-4 text-gray-700">Самооценка</th>
                      <th className="text-center py-3 px-4 text-gray-700">Руководитель</th>
                      <th className="text-center py-3 px-4 text-gray-700">Коллеги</th>
                      <th className="text-center py-3 px-4 text-gray-700">Подчиненные</th>
                      <th className="text-center py-3 px-4 text-gray-700">Средняя</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competencies.map((competency) => {
                      const scores = mockResults.competencyScores[competency.id];
                      return (
                        <tr key={competency.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{competency.name}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-lg">
                              {scores.self.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg">
                              {scores.manager.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-lg">
                              {scores.peers.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 rounded-lg">
                              {scores.subordinates.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-lg ${getRatingColor(scores.average)}`}>
                              {scores.average.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Детальный анализ по каждой компетенции */}
              <div className="mt-8 space-y-4">
                {competencies.map((comp) => {
                  const scores = mockResults.competencyScores[comp.id];
                  return (
                    <div key={comp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-gray-900">{comp.name}</h4>
                        <span className={`px-3 py-1 rounded-lg ${getRatingColor(scores.average)}`}>
                          {scores.average.toFixed(1)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: 'Самооценка', value: scores.self, color: 'purple' },
                          { label: 'Руководитель', value: scores.manager, color: 'blue' },
                          { label: 'Коллеги', value: scores.peers, color: 'green' },
                          { label: 'Подчиненные', value: scores.subordinates, color: 'orange' }
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-3">
                            <div className="w-32 text-sm text-gray-600">{item.label}</div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`bg-${item.color}-500 h-2 rounded-full`}
                                style={{ width: `${(item.value / 5) * 100}%` }}
                              />
                            </div>
                            <div className="w-12 text-sm text-gray-900 text-right">{item.value.toFixed(1)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedView === 'comments' && (
            <div className="space-y-4">
              <h3 className="text-gray-900 mb-4">Комментарии оценщиков</h3>
              <p className="text-gray-600 text-sm mb-6">
                Анонимные комментарии от участников оценки по различным компетенциям
              </p>
              {mockResults.comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        comment.role === 'manager' ? 'bg-blue-100' :
                        comment.role === 'peer' ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        <User className={`w-5 h-5 ${
                          comment.role === 'manager' ? 'text-blue-600' :
                          comment.role === 'peer' ? 'text-green-600' : 'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <div className="text-gray-900">{comment.author}</div>
                        <div className="text-gray-500 text-sm">
                          {comment.role === 'manager' ? 'Руководитель' : 
                           comment.role === 'peer' ? 'Коллега' : 'Подчиненный'}
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded text-sm">
                      {comment.competency}
                    </span>
                  </div>
                  <p className="text-gray-700 pl-13">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Рекомендации */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Рекомендации по развитию</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">!</span>
            </div>
            <div>
              <div className="text-gray-900 mb-1">Инициативность</div>
              <p className="text-gray-600 text-sm">
                Средняя оценка 3.7. Рекомендуется развивать проактивный подход к работе, 
                чаще вносить предложения по улучшению процессов.
              </p>
              <button className="text-purple-600 text-sm mt-2 hover:underline">
                Просмотреть план развития →
              </button>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <div className="text-gray-900 mb-1">Командная работа</div>
              <p className="text-gray-600 text-sm">
                Отличный результат 4.6. Продолжайте развивать навыки работы в команде, 
                делитесь опытом с коллегами.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">i</span>
            </div>
            <div>
              <div className="text-gray-900 mb-1">Лидерство</div>
              <p className="text-gray-600 text-sm">
                Высокая оценка 4.4. Рекомендуем принять участие в программе развития лидерских качеств 
                для дальнейшего карьерного роста.
              </p>
              <button className="text-purple-600 text-sm mt-2 hover:underline">
                Записаться на программу →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
