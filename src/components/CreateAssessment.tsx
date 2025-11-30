import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';

interface Competency {
  id: string;
  name: string;
  description: string;
}

interface CreateAssessmentProps {
  onBack: () => void;
}

export function CreateAssessment({ onBack }: CreateAssessmentProps) {
  const [assessmentName, setAssessmentName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [competencies, setCompetencies] = useState<Competency[]>([
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
  ]);

  const addCompetency = () => {
    const newCompetency: Competency = {
      id: Date.now().toString(),
      name: '',
      description: ''
    };
    setCompetencies([...competencies, newCompetency]);
  };

  const updateCompetency = (id: string, field: keyof Competency, value: string) => {
    setCompetencies(
      competencies.map((comp) =>
        comp.id === id ? { ...comp, [field]: value } : comp
      )
    );
  };

  const deleteCompetency = (id: string) => {
    setCompetencies(competencies.filter((comp) => comp.id !== id));
  };

  const handleSave = () => {
    alert('Оценка создана успешно!');
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-gray-900 text-2xl">Создать оценку 360 градусов</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Основная информация */}
        <div className="space-y-4">
          <h2 className="text-gray-900">Основная информация</h2>
          
          <div>
            <label className="block text-gray-700 mb-2">Название оценки</label>
            <input
              type="text"
              value={assessmentName}
              onChange={(e) => setAssessmentName(e.target.value)}
              placeholder="Например: Оценка компетенций Q4 2024"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Проект</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Например: Проект Organ HR"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Описание</label>
            <textarea
              rows={3}
              placeholder="Краткое описание целей и задач оценки"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-900">Компетенции для оценки</h2>
              <p className="text-gray-600 text-sm mt-1">
                Добавьте компетенции, которые будут оцениваться участниками
              </p>
            </div>
            <button
              onClick={addCompetency}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>
          </div>

          <div className="space-y-3">
            {competencies.map((competency, index) => (
              <div
                key={competency.id}
                className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="cursor-move pt-2">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <input
                      type="text"
                      value={competency.name}
                      onChange={(e) =>
                        updateCompetency(competency.id, 'name', e.target.value)
                      }
                      placeholder="Название компетенции"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={competency.description}
                      onChange={(e) =>
                        updateCompetency(competency.id, 'description', e.target.value)
                      }
                      placeholder="Описание компетенции"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => deleteCompetency(competency.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-gray-900 mb-4">Участники оценки</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="self"
                defaultChecked
                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="self" className="text-gray-700">
                Самооценка
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="manager"
                defaultChecked
                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="manager" className="text-gray-700">
                Оценка руководителем
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="peers"
                defaultChecked
                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="peers" className="text-gray-700">
                Оценка коллегами
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="subordinates"
                defaultChecked
                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="subordinates" className="text-gray-700">
                Оценка подчиненными
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex justify-end gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Создать оценку
          </button>
        </div>
      </div>
    </div>
  );
}