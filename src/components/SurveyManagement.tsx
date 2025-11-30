import React, { useState } from 'react';
import { Plus, Edit, Trash2, Copy, FileText, Users, ChevronDown, ChevronRight, GripVertical, BookOpen, Save, X } from 'lucide-react';

interface BehavioralIndicator {
  level: number;
  description: string;
}

interface Competency {
  id: string;
  name: string;
  description: string;
  category: string;
  indicators: BehavioralIndicator[];
}

interface Survey {
  id: string;
  name: string;
  description: string;
  competencies: Competency[];
  assignedTo: string[];
  createdDate: string;
  status: 'draft' | 'active' | 'archived';
}

const competencyLibrary: Competency[] = [
  {
    id: 'c1',
    name: 'Коммуникация',
    description: 'Эффективное общение с коллегами и клиентами',
    category: 'Универсальные компетенции',
    indicators: [
      { level: 1, description: 'Избегает обсуждений, информация доносится несвоевременно' },
      { level: 2, description: 'Общается эпизодически, не всегда доносит информацию полностью' },
      { level: 3, description: 'Регулярно общается с коллегами, доносит информацию своевременно' },
      { level: 4, description: 'Эффективно общается, структурирует информацию, учитывает потребности собеседника' },
      { level: 5, description: 'Активно слушает, ясно и структурированно излагает мысли, адаптирует стиль общения под аудиторию' }
    ]
  },
  {
    id: 'c2',
    name: 'Лидерство',
    description: 'Способность вдохновлять и направлять команду',
    category: 'Управленческие компетенции',
    indicators: [
      { level: 1, description: 'Не берет на себя ответственность, избегает принятия решений' },
      { level: 2, description: 'Принимает решения только в рамках четких инструкций' },
      { level: 3, description: 'Берет на себя ответственность за свою работу, направляет коллег при необходимости' },
      { level: 4, description: 'Мотивирует команду, принимает взвешенные решения, делегирует задачи' },
      { level: 5, description: 'Вдохновляет команду, принимает взвешенные решения, берет ответственность за результаты' }
    ]
  },
  {
    id: 'c3',
    name: 'Командная работа',
    description: 'Способность эффективно работать в команде',
    category: 'Универсальные компетенции',
    indicators: [
      { level: 1, description: 'Работает изолированно, не делится информацией' },
      { level: 2, description: 'Взаимодействует с командой по необходимости' },
      { level: 3, description: 'Активно участвует в работе команды, делится информацией' },
      { level: 4, description: 'Поддерживает коллег, инициирует совместную работу' },
      { level: 5, description: 'Активно сотрудничает, поддерживает коллег, делится знаниями' }
    ]
  },
  {
    id: 'c4',
    name: 'Стратегическое мышление',
    description: 'Способность видеть перспективу и планировать на долгий срок',
    category: 'Управленческие компетенции',
    indicators: [
      { level: 1, description: 'Фокусируется только на текущих задачах, не видит общую картину' },
      { level: 2, description: 'Понимает краткосрочные цели своего подразделения' },
      { level: 3, description: 'Учитывает среднесрочную перспективу при планировании' },
      { level: 4, description: 'Разрабатывает долгосрочные планы, учитывает тренды рынка' },
      { level: 5, description: 'Формирует видение развития, выстраивает стратегию с учетом внешних и внутренних факторов' }
    ]
  },
  {
    id: 'c5',
    name: 'Ориентация на результат',
    description: 'Стремление к достижению поставленных целей',
    category: 'Универсальные компетенции',
    indicators: [
      { level: 1, description: 'Не ставит цели, работает без фокуса на результат' },
      { level: 2, description: 'Выполняет поставленные задачи, но не всегда в срок' },
      { level: 3, description: 'Достигает поставленных целей в установленные сроки' },
      { level: 4, description: 'Превосходит ожидания, ищет пути оптимизации' },
      { level: 5, description: 'Устанавливает амбициозные цели, последовательно достигает выдающихся результатов' }
    ]
  },
  {
    id: 'c6',
    name: 'Клиентоориентированность',
    description: 'Фокус на потребностях клиента',
    category: 'Специализированные компетенции',
    indicators: [
      { level: 1, description: 'Не учитывает потребности клиентов, формальный подход' },
      { level: 2, description: 'Реагирует на запросы клиентов по мере поступления' },
      { level: 3, description: 'Понимает потребности клиентов, стремится их удовлетворить' },
      { level: 4, description: 'Проактивно выявляет потребности, предлагает решения' },
      { level: 5, description: 'Создает исключительный клиентский опыт, превосходит ожидания, выстраивает долгосрочные отношения' }
    ]
  },
  {
    id: 'c7',
    name: 'Адаптивность',
    description: 'Способность работать в условиях изменений',
    category: 'Универсальные компетенции',
    indicators: [
      { level: 1, description: 'Сопротивляется изменениям, теряется в новых условиях' },
      { level: 2, description: 'Принимает изменения с трудом, требует значительной поддержки' },
      { level: 3, description: 'Адаптируется к изменениям, сохраняет эффективность' },
      { level: 4, description: 'Быстро адаптируется, помогает другим в период изменений' },
      { level: 5, description: 'Процветает в условиях неопределенности, инициирует позитивные изменения' }
    ]
  },
  {
    id: 'c8',
    name: 'Аналитическое мышление',
    description: 'Способность анализировать данные и принимать обоснованные решения',
    category: 'Технические компетенции',
    indicators: [
      { level: 1, description: 'Не анализирует данные, принимает решения интуитивно' },
      { level: 2, description: 'Использует базовый анализ для простых решений' },
      { level: 3, description: 'Систематически анализирует информацию перед принятием решений' },
      { level: 4, description: 'Проводит глубокий анализ, выявляет закономерности и тренды' },
      { level: 5, description: 'Применяет сложные методы анализа, синтезирует информацию из разных источников для принятия стратегических решений' }
    ]
  }
];

const mockSurveys: Survey[] = [
  {
    id: 's1',
    name: 'Универсальная анкета сотрудника',
    description: 'Базовая оценка компетенций для всех сотрудников',
    competencies: [competencyLibrary[0], competencyLibrary[2], competencyLibrary[4], competencyLibrary[6]],
    assignedTo: ['Все сотрудники'],
    createdDate: '2024-09-10',
    status: 'active'
  },
  {
    id: 's2',
    name: 'Анкета для руководителей',
    description: 'Оценка управленческих компетенций',
    competencies: [competencyLibrary[1], competencyLibrary[3], competencyLibrary[0], competencyLibrary[4]],
    assignedTo: ['Руководители'],
    createdDate: '2024-09-15',
    status: 'active'
  }
];

export function SurveyManagement() {
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveys);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [editingCompetency, setEditingCompetency] = useState<Competency | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(competencyLibrary.map(c => c.category)));

  const createNewSurvey = () => {
    const newSurvey: Survey = {
      id: `s${Date.now()}`,
      name: 'Новая анкета',
      description: '',
      competencies: [],
      assignedTo: [],
      createdDate: new Date().toISOString().split('T')[0],
      status: 'draft'
    };
    setSurveys([...surveys, newSurvey]);
    setSelectedSurvey(newSurvey);
    setIsEditing(true);
  };

  const duplicateSurvey = (survey: Survey) => {
    const newSurvey: Survey = {
      ...survey,
      id: `s${Date.now()}`,
      name: `${survey.name} (копия)`,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0]
    };
    setSurveys([...surveys, newSurvey]);
  };

  const deleteSurvey = (surveyId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту анкету?')) {
      setSurveys(surveys.filter(s => s.id !== surveyId));
      if (selectedSurvey?.id === surveyId) {
        setSelectedSurvey(null);
      }
    }
  };

  const addCompetencyToSurvey = (competency: Competency) => {
    if (!selectedSurvey) return;
    if (selectedSurvey.competencies.some(c => c.id === competency.id)) {
      alert('Эта компетенция уже добавлена в анкету');
      return;
    }
    const updated = {
      ...selectedSurvey,
      competencies: [...selectedSurvey.competencies, competency]
    };
    setSelectedSurvey(updated);
    setSurveys(surveys.map(s => s.id === updated.id ? updated : s));
  };

  const removeCompetencyFromSurvey = (competencyId: string) => {
    if (!selectedSurvey) return;
    const updated = {
      ...selectedSurvey,
      competencies: selectedSurvey.competencies.filter(c => c.id !== competencyId)
    };
    setSelectedSurvey(updated);
    setSurveys(surveys.map(s => s.id === updated.id ? updated : s));
  };

  const createCustomCompetency = () => {
    const newCompetency: Competency = {
      id: `custom_${Date.now()}`,
      name: '',
      description: '',
      category: 'Кастомные компетенции',
      indicators: [
        { level: 1, description: '' },
        { level: 2, description: '' },
        { level: 3, description: '' },
        { level: 4, description: '' },
        { level: 5, description: '' }
      ]
    };
    setEditingCompetency(newCompetency);
  };

  const saveCustomCompetency = () => {
    if (!editingCompetency) return;
    if (!editingCompetency.name) {
      alert('Укажите название компетенции');
      return;
    }
    addCompetencyToSurvey(editingCompetency);
    setEditingCompetency(null);
  };

  const updateSurveyField = (field: keyof Survey, value: any) => {
    if (!selectedSurvey) return;
    const updated = { ...selectedSurvey, [field]: value };
    setSelectedSurvey(updated);
    setSurveys(surveys.map(s => s.id === updated.id ? updated : s));
  };

  const filteredLibrary = selectedCategory === 'all' 
    ? competencyLibrary 
    : competencyLibrary.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-2xl mb-2">Управление анкетами</h1>
          <p className="text-gray-600">
            Создавайте и настраивайте анкеты оценки компетенций
          </p>
        </div>
        <button
          onClick={createNewSurvey}
          className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Создать анкету
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Список анкет */}
        <div className="col-span-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-gray-900">Все анкеты</h2>
              <p className="text-gray-600 text-sm mt-1">{surveys.length} анкет</p>
            </div>

            <div className="divide-y divide-gray-200 max-h-[700px] overflow-y-auto">
              {surveys.map((survey) => (
                <div
                  key={survey.id}
                  onClick={() => {
                    setSelectedSurvey(survey);
                    setIsEditing(false);
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedSurvey?.id === survey.id
                      ? 'bg-purple-50 border-l-4 border-l-purple-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{survey.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{survey.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      survey.status === 'active' 
                        ? 'bg-green-100 text-green-700'
                        : survey.status === 'draft'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {survey.status === 'active' ? 'Активна' : survey.status === 'draft' ? 'Черновик' : 'Архив'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {survey.competencies.length} компетенций
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {survey.assignedTo.length} групп
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateSurvey(survey);
                      }}
                      className="p-1 hover:bg-white rounded transition-colors"
                      title="Дублировать"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSurvey(survey.id);
                      }}
                      className="p-1 hover:bg-white rounded transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Редактор анкеты */}
        <div className="col-span-8">
          {selectedSurvey ? (
            <div className="space-y-6">
              {/* Основная информация */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-gray-900">Основная информация</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    {isEditing ? 'Закончить редактирование' : 'Редактировать'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Название анкеты</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={selectedSurvey.name}
                        onChange={(e) => updateSurveyField('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <div className="text-gray-900 text-lg">{selectedSurvey.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Описание</label>
                    {isEditing ? (
                      <textarea
                        value={selectedSurvey.description}
                        onChange={(e) => updateSurveyField('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                    ) : (
                      <div className="text-gray-600">{selectedSurvey.description || 'Описание не указано'}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Назначение анкеты</label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {selectedSurvey.assignedTo.map((group, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg"
                            >
                              <span>{group}</span>
                              <button
                                onClick={() => {
                                  updateSurveyField(
                                    'assignedTo',
                                    selectedSurvey.assignedTo.filter((_, i) => i !== index)
                                  );
                                }}
                                className="hover:bg-purple-200 rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <select
                          onChange={(e) => {
                            if (e.target.value && !selectedSurvey.assignedTo.includes(e.target.value)) {
                              updateSurveyField('assignedTo', [...selectedSurvey.assignedTo, e.target.value]);
                            }
                            e.target.value = '';
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Добавить группу...</option>
                          <option value="Все сотрудники">Все сотрудники</option>
                          <option value="Руководители">Руководители</option>
                          <option value="Специалисты">Специалисты</option>
                          <option value="Отдел продаж">Отдел продаж</option>
                          <option value="Разработка">Разработка</option>
                          <option value="HR">HR</option>
                          <option value="Маркетинг">Маркетинг</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedSurvey.assignedTo.length > 0 ? (
                          selectedSurvey.assignedTo.map((group, index) => (
                            <div
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg"
                            >
                              {group}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500">Не назначена</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Дата создания</label>
                      <div className="text-gray-600">
                        {new Date(selectedSurvey.createdDate).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Статус</label>
                      {isEditing ? (
                        <select
                          value={selectedSurvey.status}
                          onChange={(e) => updateSurveyField('status', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="draft">Черновик</option>
                          <option value="active">Активна</option>
                          <option value="archived">Архив</option>
                        </select>
                      ) : (
                        <div className={`inline-block px-3 py-1 rounded ${
                          selectedSurvey.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : selectedSurvey.status === 'draft'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {selectedSurvey.status === 'active' ? 'Активна' : selectedSurvey.status === 'draft' ? 'Черновик' : 'Архив'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Компетенции */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-gray-900">Компетенции</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedSurvey.competencies.length} компетенций в анкете
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={createCustomCompetency}
                      className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Создать компетенцию
                    </button>
                    <button
                      onClick={() => setShowLibrary(!showLibrary)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      {showLibrary ? 'Скрыть библиотеку' : 'Библиотека'}
                    </button>
                  </div>
                </div>

                {/* Библиотека компетенций */}
                {showLibrary && (
                  <div className="mb-6 border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-900">Библиотека компетенций</h3>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      >
                        <option value="all">Все категории</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {filteredLibrary.map((competency) => (
                        <div
                          key={competency.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="text-gray-900 mb-1">{competency.name}</h4>
                              <p className="text-gray-600 text-sm mb-2">{competency.description}</p>
                              <div className="text-xs text-gray-500">{competency.category}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => addCompetencyToSurvey(competency)}
                            className="w-full mt-3 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 border border-purple-300 rounded-lg transition-colors"
                          >
                            Добавить в анкету
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Создание кастомной компетенции */}
                {editingCompetency && (
                  <div className="mb-6 border-2 border-green-200 rounded-lg p-6 bg-green-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-900">Создание новой компетенции</h3>
                      <button
                        onClick={() => setEditingCompetency(null)}
                        className="p-1 hover:bg-green-100 rounded"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 text-sm mb-2">
                          Название компетенции <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editingCompetency.name}
                          onChange={(e) => setEditingCompetency({ ...editingCompetency, name: e.target.value })}
                          placeholder="Например: Креативность"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm mb-2">Описание</label>
                        <input
                          type="text"
                          value={editingCompetency.description}
                          onChange={(e) => setEditingCompetency({ ...editingCompetency, description: e.target.value })}
                          placeholder="Краткое описание компетенции"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        />
                      </div>

                      <div>
                        <h4 className="text-gray-900 mb-3 text-sm">Поведенческие индикаторы</h4>
                        <div className="space-y-3">
                          {editingCompetency.indicators.map((indicator) => (
                            <div key={indicator.level}>
                              <label className="block text-gray-700 text-sm mb-1 flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                  indicator.level === 1 ? 'bg-red-100 text-red-700' :
                                  indicator.level === 2 ? 'bg-orange-100 text-orange-700' :
                                  indicator.level === 3 ? 'bg-yellow-100 text-yellow-700' :
                                  indicator.level === 4 ? 'bg-green-100 text-green-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {indicator.level} {indicator.level === 1 ? 'балл' : 'балла'}
                                </span>
                              </label>
                              <textarea
                                value={indicator.description}
                                onChange={(e) => {
                                  const updated = { ...editingCompetency };
                                  updated.indicators[indicator.level - 1].description = e.target.value;
                                  setEditingCompetency(updated);
                                }}
                                rows={2}
                                placeholder={`Опишите поведение для уровня ${indicator.level}...`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={saveCustomCompetency}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Добавить компетенцию в анкету
                      </button>
                    </div>
                  </div>
                )}

                {/* Список компетенций в анкете */}
                <div className="space-y-4">
                  {selectedSurvey.competencies.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 mb-2">Компетенции не добавлены</p>
                      <p className="text-gray-400 text-sm">Выберите компетенции из библиотеки или создайте новые</p>
                    </div>
                  ) : (
                    selectedSurvey.competencies.map((competency, index) => (
                      <div
                        key={competency.id}
                        className="border-2 border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="cursor-move pt-1">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-gray-500">#{index + 1}</span>
                                  <h4 className="text-gray-900">{competency.name}</h4>
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                    {competency.category}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm">{competency.description}</p>
                              </div>
                              {isEditing && (
                                <button
                                  onClick={() => removeCompetencyFromSurvey(competency.id)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              )}
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                              <h5 className="text-gray-900 text-sm mb-3">Поведенческие индикаторы:</h5>
                              
                              <div className="grid grid-cols-1 gap-3">
                                <div className="flex gap-3">
                                  <div className="flex-shrink-0">
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                      1 балл
                                    </span>
                                  </div>
                                  <div className="text-gray-700 text-sm">
                                    {competency.indicators.find(i => i.level === 1)?.description}
                                  </div>
                                </div>

                                <div className="flex gap-3">
                                  <div className="flex-shrink-0">
                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                                      2 балла
                                    </span>
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    {competency.indicators.find(i => i.level === 2)?.description}
                                  </div>
                                </div>

                                <div className="flex gap-3">
                                  <div className="flex-shrink-0">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                                      3 балла
                                    </span>
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    {competency.indicators.find(i => i.level === 3)?.description}
                                  </div>
                                </div>

                                <div className="flex gap-3">
                                  <div className="flex-shrink-0">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                      4 балла
                                    </span>
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    {competency.indicators.find(i => i.level === 4)?.description}
                                  </div>
                                </div>

                                <div className="flex gap-3">
                                  <div className="flex-shrink-0">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                      5 баллов
                                    </span>
                                  </div>
                                  <div className="text-gray-700 text-sm">
                                    {competency.indicators.find(i => i.level === 5)?.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">Выберите анкету</h3>
              <p className="text-gray-600 mb-6">
                Выберите анкету из списка слева или создайте новую
              </p>
              <button
                onClick={createNewSurvey}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                Создать анкету
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
