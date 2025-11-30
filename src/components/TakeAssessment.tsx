import React, { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import type { Assessment } from '../App';

interface TakeAssessmentProps {
  assessment: Assessment;
  onBack: () => void;
}

const competencies = [
  {
    id: '1',
    name: 'Лидерство',
    description: 'Способность вдохновлять и направлять команду к достижению целей'
  },
  {
    id: '2',
    name: 'Коммуникация',
    description: 'Эффективное общение с коллегами и клиентами'
  },
  {
    id: '3',
    name: 'Командная работа',
    description: 'Способность работать в команде и достигать общих целей'
  },
  {
    id: '4',
    name: 'Решение проблем',
    description: 'Аналитические навыки и способность находить решения'
  },
  {
    id: '5',
    name: 'Инициативность',
    description: 'Проактивный подход к работе и внесение предложений'
  }
];

const ratingLabels = [
  'Неудовлетворительно',
  'Ниже среднего',
  'Удовлетворительно',
  'Хорошо',
  'Отлично'
];

export function TakeAssessment({ assessment, onBack }: TakeAssessmentProps) {
  const [participantName, setParticipantName] = useState('');
  const [participantRole, setParticipantRole] = useState<string>('self');
  const [targetEmployee, setTargetEmployee] = useState('');
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState<'info' | 'assessment'>('info');

  const handleRatingChange = (competencyId: string, rating: number) => {
    setRatings({ ...ratings, [competencyId]: rating });
  };

  const handleCommentChange = (competencyId: string, comment: string) => {
    setComments({ ...comments, [competencyId]: comment });
  };

  const handleStartAssessment = () => {
    if (!participantName || !targetEmployee) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    setStep('assessment');
  };

  const handleSubmit = () => {
    const allRated = competencies.every((comp) => ratings[comp.id] !== undefined);
    if (!allRated) {
      alert('Пожалуйста, оцените все компетенции');
      return;
    }
    alert('Оценка успешно отправлена!');
    onBack();
  };

  const progress = (Object.keys(ratings).length / competencies.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-gray-900 text-2xl">{assessment.name}</h1>
          <p className="text-gray-600">{assessment.project}</p>
        </div>
      </div>

      {step === 'info' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <h2 className="text-gray-900 mb-4">Информация об участнике</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Ваше имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Введите ваше имя"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Ваша роль <span className="text-red-500">*</span>
                </label>
                <select
                  value={participantRole}
                  onChange={(e) => setParticipantRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="self">Самооценка</option>
                  <option value="manager">Руководитель</option>
                  <option value="peer">Коллега</option>
                  <option value="subordinate">Подчиненный</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Кого вы оцениваете <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={targetEmployee}
                  onChange={(e) => setTargetEmployee(e.target.value)}
                  placeholder="Введите имя сотрудника"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <h3 className="text-purple-900 mb-2">О системе оценки 360 градусов</h3>
              <p className="text-purple-800 text-sm">
                Система оценки 360 градусов позволяет получить всестороннюю оценку компетенций 
                сотрудника от его руководителя, коллег, подчиненных и самого сотрудника. 
                Оценивайте объективно, используя шкалу от 1 до 5.
              </p>
            </div>

            <button
              onClick={handleStartAssessment}
              className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Начать оценку
            </button>
          </div>
        </div>
      )}

      {step === 'assessment' && (
        <div className="space-y-6">
          {/* Прогресс */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Прогресс оценки</span>
              <span className="text-gray-900">
                {Object.keys(ratings).length} / {competencies.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Информация об оценке */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-gray-900">{targetEmployee}</div>
                <div className="text-gray-600 text-sm">
                  Оценивает: {participantName} ({participantRole === 'self' ? 'Самооценка' : participantRole === 'manager' ? 'Руководитель' : participantRole === 'peer' ? 'Коллега' : 'Подчиненный'})
                </div>
              </div>
            </div>
          </div>

          {/* Оценка компетенций */}
          <div className="space-y-4">
            {competencies.map((competency, index) => (
              <div
                key={competency.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="mb-4">
                  <h3 className="text-gray-900 mb-2">
                    {index + 1}. {competency.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{competency.description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-3">
                      Оценка <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRatingChange(competency.id, rating)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            ratings[competency.id] === rating
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{rating}</div>
                          <div className="text-xs text-gray-600">{ratingLabels[rating - 1]}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Комментарий (необязательно)
                    </label>
                    <textarea
                      value={comments[competency.id] || ''}
                      onChange={(e) => handleCommentChange(competency.id, e.target.value)}
                      rows={2}
                      placeholder="Добавьте комментарий к оценке..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep('info')}
                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Назад
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                Отправить оценку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}