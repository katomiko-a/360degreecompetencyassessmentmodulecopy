import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, Search, Mail, GripVertical, X } from 'lucide-react';

interface CampaignWizardProps {
  onBack: () => void;
}

interface Competency {
  id: string;
  name: string;
  description: string;
  indicators: {
    level1: string;
    level5: string;
  };
}

interface Participant {
  id: string;
  name: string;
  position: string;
  department: string;
  selected: boolean;
}

const mockParticipants: Participant[] = [
  { id: '1', name: 'Иванов Иван Иванович', position: 'Senior Developer', department: 'Разработка', selected: false },
  { id: '2', name: 'Петрова Ирина Сергеевна', position: 'Project Manager', department: 'Управление проектами', selected: false },
  { id: '3', name: 'Сидоров Сергей Петрович', position: 'Team Lead', department: 'Разработка', selected: false },
  { id: '4', name: 'Козлова Анна Владимировна', position: 'HR Manager', department: 'HR', selected: false },
  { id: '5', name: 'Михайлов Михаил Михайлович', position: 'Sales Manager', department: 'Продажи', selected: false },
  { id: '6', name: 'Смирнова Елена Петровна', position: 'Marketing Specialist', department: 'Маркетинг', selected: false },
  { id: '7', name: 'Новиков Андрей Сергеевич', position: 'Backend Developer', department: 'Разработка', selected: false },
  { id: '8', name: 'Федорова Ольга Ивановна', position: 'UX Designer', department: 'Дизайн', selected: false },
];

export function CampaignWizard({ onBack }: CampaignWizardProps) {
  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [competencies, setCompetencies] = useState<Competency[]>([
    {
      id: '1',
      name: 'Коммуникация',
      description: 'Эффективное общение с коллегами и клиентами',
      indicators: {
        level1: 'Избегает обсуждений, информация доносится несвоевременно',
        level5: 'Активно слушает, ясно и структурированно излагает мысли, адаптирует стиль общения под аудиторию'
      }
    },
    {
      id: '2',
      name: 'Лидерство',
      description: 'Способность вдохновлять и направлять команду',
      indicators: {
        level1: 'Не берет на себя ответственность, избегает принятия решений',
        level5: 'Вдохновляет команду, принимает взвешенные решения, берет ответственность за результаты'
      }
    },
    {
      id: '3',
      name: 'Командная работа',
      description: 'Способность эффективно работать в команде',
      indicators: {
        level1: 'Работает изолированно, не делится информацией',
        level5: 'Активно сотрудничает, поддерживает коллег, делится знаниями'
      }
    }
  ]);
  const [assessorRoles, setAssessorRoles] = useState({
    self: true,
    manager: true,
    peers: true,
    subordinates: true,
    clients: false
  });
  const [notifications, setNotifications] = useState({
    autoSend: true,
    reminders: true,
    reminderDays: 3,
    customEmail: ''
  });

  const toggleParticipant = (id: string) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, selected: !p.selected } : p
    ));
  };

  const selectAll = () => {
    setParticipants(participants.map(p => ({ ...p, selected: true })));
  };

  const deselectAll = () => {
    setParticipants(participants.map(p => ({ ...p, selected: false })));
  };

  const addCompetency = () => {
    const newComp: Competency = {
      id: Date.now().toString(),
      name: '',
      description: '',
      indicators: { level1: '', level5: '' }
    };
    setCompetencies([...competencies, newComp]);
  };

  const updateCompetency = (id: string, field: string, value: string) => {
    setCompetencies(competencies.map(c => {
      if (c.id !== id) return c;
      if (field.startsWith('indicators.')) {
        const indicatorField = field.split('.')[1] as 'level1' | 'level5';
        return { ...c, indicators: { ...c.indicators, [indicatorField]: value } };
      }
      return { ...c, [field]: value };
    }));
  };

  const deleteCompetency = (id: string) => {
    setCompetencies(competencies.filter(c => c.id !== id));
  };

  const handleFinish = () => {
    alert('Кампания успешно создана!');
    onBack();
  };

  const departments = Array.from(new Set(participants.map(p => p.department)));
  
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || p.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const selectedCount = participants.filter(p => p.selected).length;

  const steps = [
    { number: 1, title: 'Основное', subtitle: 'Название и даты' },
    { number: 2, title: 'Участники', subtitle: 'Выбор сотрудников' },
    { number: 3, title: 'Компетенции', subtitle: 'Анкеты оценки' },
    { number: 4, title: 'Уведомления', subtitle: 'Настройка писем' }
  ];

  const canProceed = () => {
    if (step === 1) return campaignName && startDate && endDate;
    if (step === 2) return selectedCount > 0;
    if (step === 3) return competencies.length > 0 && competencies.every(c => c.name);
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-gray-900 text-2xl">Создание кампании оценки 360°</h1>
          <p className="text-gray-600">Настройте параметры новой кампании оценки компетенций</p>
        </div>
      </div>

      {/* Индикатор прогресса */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, index) => (
            <React.Fragment key={s.number}>
              <div className="flex flex-col items-center gap-3 flex-1">
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      step > s.number
                        ? 'bg-purple-500 text-white'
                        : step === s.number
                        ? 'bg-purple-500 text-white ring-4 ring-purple-100'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step > s.number ? <Check className="w-6 h-6" /> : s.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 rounded transition-all ${step > s.number ? 'bg-purple-500' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="text-center">
                  <div className={`text-sm ${step >= s.number ? 'text-gray-900' : 'text-gray-500'}`}>
                    {s.title}
                  </div>
                  <div className="text-xs text-gray-400">{s.subtitle}</div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Шаг 1: Основное */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">1</span>
              </div>
              <div>
                <h2 className="text-gray-900 text-xl">Основная информация</h2>
                <p className="text-gray-600 text-sm">Укажите название кампании и временные рамки</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Название кампании <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Например: Оценка лидерского потенциала, Q2 2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-gray-500 text-sm mt-1">Это название будут видеть участники оценки</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Старт сбора оценок <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Окончание <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Описание кампании</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Опишите цели и задачи этой кампании оценки. Эта информация поможет участникам понять важность процесса."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">i</span>
                  </div>
                  <div>
                    <h4 className="text-purple-900 mb-1">Рекомендации</h4>
                    <p className="text-purple-800 text-sm">
                      Оптимальная длительность кампании оценки 360° — 2-3 недели. Это позволяет участникам 
                      качественно заполнить анкеты без спешки.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Шаг 2: Участники */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">2</span>
              </div>
              <div>
                <h2 className="text-gray-900 text-xl">Выбор участников</h2>
                <p className="text-gray-600 text-sm">Выберите сотрудников, которые будут участвовать в оценке</p>
              </div>
            </div>

            {/* Панель поиска и фильтров */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по имени, должности или подразделению..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Все подразделения</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Панель действий */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAll}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Выбрать все
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={deselectAll}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Снять выделение
                </button>
              </div>
              <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
                Выбрано: {selectedCount} из {participants.length}
              </div>
            </div>

            {/* Список участников */}
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredParticipants.map((participant) => (
                <label
                  key={participant.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={participant.selected}
                    onChange={() => toggleParticipant(participant.id)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600">
                      {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-900">{participant.name}</div>
                    <div className="text-gray-500 text-sm">
                      {participant.position} • {participant.department}
                    </div>
                  </div>
                  {participant.selected && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Настройка ролей оценивающих */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-gray-900 mb-4">Настройка ролей оценивающих</h3>
            <p className="text-gray-600 text-sm mb-4">
              Выберите, кто будет оценивать участников. Система 360° предполагает оценку со всех сторон.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={assessorRoles.self}
                  onChange={(e) => setAssessorRoles({ ...assessorRoles, self: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-gray-900 mb-1">Самооценка</div>
                  <div className="text-gray-500 text-sm">Сотрудник оценивает себя самостоятельно</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={assessorRoles.manager}
                  onChange={(e) => setAssessorRoles({ ...assessorRoles, manager: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-gray-900 mb-1">Руководитель</div>
                  <div className="text-gray-500 text-sm">Непосредственный руководитель</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={assessorRoles.peers}
                  onChange={(e) => setAssessorRoles({ ...assessorRoles, peers: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-gray-900 mb-1">Коллеги (минимум 3)</div>
                  <div className="text-gray-500 text-sm">Коллеги того же уровня</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={assessorRoles.subordinates}
                  onChange={(e) => setAssessorRoles({ ...assessorRoles, subordinates: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-gray-900 mb-1">Подчиненные</div>
                  <div className="text-gray-500 text-sm">Сотрудники в подчинении</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={assessorRoles.clients}
                  onChange={(e) => setAssessorRoles({ ...assessorRoles, clients: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-gray-900 mb-1">Внешние клиенты</div>
                  <div className="text-gray-500 text-sm">Клиенты компании</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Шаг 3: Компетенции */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">3</span>
                </div>
                <div>
                  <h2 className="text-gray-900 text-xl">Компетенции для оценки</h2>
                  <p className="text-gray-600 text-sm">Настройте компетенции и поведенческие индикаторы</p>
                </div>
              </div>
              <button
                onClick={addCompetency}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Добавить компетенцию
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Выбрать из библиотеки шаблонов</label>
              <div className="flex gap-3">
                <select className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Создать с нуля</option>
                  <option>Универсальные компетенции</option>
                  <option>Компетенции лидера</option>
                  <option>Компетенции специалиста</option>
                  <option>Управленческие компетенции</option>
                  <option>Технические компетенции</option>
                </select>
                <button
                  onClick={() => window.location.href = '#surveys'}
                  className="px-4 py-3 text-purple-600 hover:bg-purple-50 border border-purple-300 rounded-lg transition-colors whitespace-nowrap"
                >
                  Управление анкетами
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {competencies.map((comp, index) => (
                <div key={comp.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-purple-200 transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="cursor-move pt-2">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-gray-700 text-sm mb-2">
                            Название компетенции <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={comp.name}
                            onChange={(e) => updateCompetency(comp.id, 'name', e.target.value)}
                            placeholder="Например: Коммуникация"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm mb-2">Описание компетенции</label>
                        <input
                          type="text"
                          value={comp.description}
                          onChange={(e) => updateCompetency(comp.id, 'description', e.target.value)}
                          placeholder="Краткое описание того, что включает эта компетенция"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <h4 className="text-gray-900 text-sm">Поведенческие индикаторы</h4>
                        
                        <div>
                          <label className="block text-gray-700 text-sm mb-2 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">1 балл</span>
                            Минимальный уровень развития
                          </label>
                          <textarea
                            value={comp.indicators.level1}
                            onChange={(e) => updateCompetency(comp.id, 'indicators.level1', e.target.value)}
                            rows={2}
                            placeholder="Опишите поведение для минимального уровня развития компетенции..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 text-sm mb-2 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">5 баллов</span>
                            Максимальный уровень развития
                          </label>
                          <textarea
                            value={comp.indicators.level5}
                            onChange={(e) => updateCompetency(comp.id, 'indicators.level5', e.target.value)}
                            rows={2}
                            placeholder="Опишите поведение для максимального уровня развития компетенции..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCompetency(comp.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {competencies.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-4">Компетенции не добавлены</p>
                <button
                  onClick={addCompetency}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Добавить первую компетенцию
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Шаг 4: Уведомления */}
      {step === 4 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">4</span>
              </div>
              <div>
                <h2 className="text-gray-900 text-xl">Настройка уведомлений</h2>
                <p className="text-gray-600 text-sm">Настройте автоматические уведомления для участников</p>
              </div>
            </div>

            <div className="space-y-6">
              <label className="flex items-start gap-4 p-5 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={notifications.autoSend}
                  onChange={(e) => setNotifications({ ...notifications, autoSend: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Автоматически отправлять приглашения</span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Участники получат email-приглашение сразу после запуска кампании
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-5 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={notifications.reminders}
                  onChange={(e) => setNotifications({ ...notifications, reminders: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Отправлять напоминания</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">
                    Автоматические напоминания для участников, не завершивших оценку
                  </p>
                  {notifications.reminders && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">За</span>
                      <select
                        value={notifications.reminderDays}
                        onChange={(e) => setNotifications({ ...notifications, reminderDays: parseInt(e.target.value) })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value={1}>1 день</option>
                        <option value={3}>3 дня</option>
                        <option value={5}>5 дней</option>
                        <option value={7}>7 дней</option>
                      </select>
                      <span className="text-sm text-gray-600">до окончания кампании</span>
                    </div>
                  )}
                </div>
              </label>

              <div>
                <label className="block text-gray-700 mb-2">Текст email-приглашения</label>
                <textarea
                  value={notifications.customEmail}
                  onChange={(e) => setNotifications({ ...notifications, customEmail: e.target.value })}
                  rows={10}
                  placeholder="Здравствуйте, {имя}!

Приглашаем вас принять участие в кампании оценки 360 градусов: {название_кампании}.

Ваше участие очень важно для развития компании и ваших коллег.

Период проведения: {дата_начала} - {дата_окончания}

Пожалуйста, заполните анкету по ссылке: {ссылка}

С уважением,
Отдел по работе с персоналом"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                />
                <p className="text-gray-500 text-sm mt-2">
                  Используйте переменные: {'{имя}'}, {'{название_кампании}'}, {'{дата_начала}'}, {'{дата_окончания}'}, {'{ссылка}'}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">i</span>
                  </div>
                  <div>
                    <h4 className="text-blue-900 mb-1">Предпросмотр</h4>
                    <p className="text-blue-800 text-sm">
                      Перед отправкой вы сможете просмотреть, как будет выглядеть письмо для участников.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Навигация */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
        <button
          onClick={() => step > 1 && setStep(step - 1)}
          disabled={step === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            step === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </button>

        <div className="text-gray-600">
          Шаг {step} из {steps.length}
        </div>

        {step < steps.length ? (
          <button
            onClick={() => canProceed() && setStep(step + 1)}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              canProceed()
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Далее
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Check className="w-5 h-5" />
            Создать кампанию
          </button>
        )}
      </div>
    </div>
  );
}