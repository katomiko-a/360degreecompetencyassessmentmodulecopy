import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Star, MessageSquare, Save, AlertCircle, Clock, User } from 'lucide-react';

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

interface Rating {
  competencyId: string;
  score: number;
  comment: string;
}

interface Assessment {
  id: string;
  name: string;
  project: string;
  createdDate: string;
  participants: number;
  completed: number;
  status: 'draft' | 'published' | 'completed';
}

interface AssessmentFormProps {
  assessment?: Assessment;
  onBack?: () => void;
}

const mockCompetencies: Competency[] = [
  {
    id: 'c1',
    name: 'Командная работа',
    description: 'Эффективно взаимодействует с коллегами для достижения общих целей',
    category: 'Универсальные компетенции',
    indicators: [
      { level: 1, description: 'Работает изолированно, не делится информацией, избегает совместной работы' },
      { level: 2, description: 'Взаимодействует с командой по необходимости, минимально делится информацией' },
      { level: 3, description: 'Активно участвует в работе команды, регулярно делится информацией' },
      { level: 4, description: 'Поддерживает коллег, инициирует совместную работу, способствует командному духу' },
      { level: 5, description: 'Активно сотрудничает, поддерживает коллег, делится знаниями, создает синергию в команде' }
    ]
  },
  {
    id: 'c2',
    name: 'Коммуникация',
    description: 'Эффективное общение с коллегами и клиентами',
    category: 'Универсальные компетенции',
    indicators: [
      { level: 1, description: 'Избегает обсуждений, информация доносится несвоевременно или некорректно' },
      { level: 2, description: 'Общается эпизодически, не всегда доносит информацию полностью' },
      { level: 3, description: 'Регулярно общается с коллегами, доносит информацию своевременно' },
      { level: 4, description: 'Эффективно общается, структурирует информацию, учитывает потребности собеседника' },
      { level: 5, description: 'Активно слушает, ясно и структурированно излагает мысли, адаптирует стиль общения под аудиторию' }
    ]
  },
  {
    id: 'c3',
    name: 'Ориентация на результат',
    description: 'Стремление к достижению поставленных целей',
    category: 'Универсальные компетенции',
    indicators: [
      { level: 1, description: 'Не ставит цели, работает без фокуса на результат' },
      { level: 2, description: 'Выполняет поставленные задачи, но не всегда в срок' },
      { level: 3, description: 'Достигает поставленных целей в установленные сроки' },
      { level: 4, description: 'Превосходит ожидания, ищет пути оптимизации для достижения лучших результатов' },
      { level: 5, description: 'Устанавливает амбициозные цели, последовательно достигает выдающихся результатов' }
    ]
  },
  {
    id: 'c4',
    name: 'Лидерство',
    description: 'Способность вдохновлять и направлять команду',
    category: 'Управленческие компетенции',
    indicators: [
      { level: 1, description: 'Не берет на себя ответственность, избегает принятия решений' },
      { level: 2, description: 'Принимает решения только в рамках четких инструкций' },
      { level: 3, description: 'Берет на себя ответственность за свою работу, направляет коллег при необходимости' },
      { level: 4, description: 'Мотивирует команду, принимает взвешенные решения, эффективно делегирует задачи' },
      { level: 5, description: 'Вдохновляет команду, принимает взвешенные решения, берет ответственность за результаты, развивает потенциал сотрудников' }
    ]
  },
  {
    id: 'c5',
    name: 'Адаптивность',
    description: 'Способность работать в условиях изменений',
    category: 'Универсальные компетенции',
    indicators: [
      { level: 1, description: 'Сопротивляется изменениям, теряется в новых условиях' },
      { level: 2, description: 'Принимает изменения с трудом, требует значительной поддержки' },
      { level: 3, description: 'Адаптируется к изменениям, сохраняет эффективность работы' },
      { level: 4, description: 'Быстро адаптируется, помогает другим в период изменений' },
      { level: 5, description: 'Процветает в условиях неопределенности, инициирует позитивные изменения' }
    ]
  }
];

export function AssessmentForm({ assessment, onBack }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);
  const [showIndicators, setShowIndicators] = useState(true);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const assesseeName = 'Петрова Ирина Сергеевна';
  const assessorRole = 'Коллега';
  const currentCompetency = mockCompetencies[currentStep];
  const totalSteps = mockCompetencies.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const currentRating = ratings[currentCompetency?.id];

  const handleScoreChange = (score: number) => {
    const updated = {
      ...ratings,
      [currentCompetency.id]: {
        competencyId: currentCompetency.id,
        score,
        comment: currentRating?.comment || ''
      }
    };
    setRatings(updated);
    // Симуляция автосохранения
    setSavedAt(new Date());
  };

  const handleCommentChange = (comment: string) => {
    const updated = {
      ...ratings,
      [currentCompetency.id]: {
        competencyId: currentCompetency.id,
        score: currentRating?.score || 0,
        comment
      }
    };
    setRatings(updated);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setHoveredScore(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setHoveredScore(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    const completed = Object.keys(ratings).length;
    if (completed < totalSteps) {
      if (!confirm(`Вы оценили ${completed} из ${totalSteps} компетенций. Продолжить отправку?`)) {
        return;
      }
    }
    alert('Оценка успешно отправлена! Спасибо за участие.');
    if (onBack) onBack();
  };

  const canProceed = currentRating && currentRating.score > 0;
  const completedCount = Object.keys(ratings).filter(key => ratings[key].score > 0).length;

  const getScoreColor = (level: number) => {
    switch (level) {
      case 1: return 'text-red-500';
      case 2: return 'text-orange-500';
      case 3: return 'text-yellow-500';
      case 4: return 'text-green-500';
      case 5: return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  const getScoreBgColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-red-50 border-red-200';
      case 2: return 'bg-orange-50 border-orange-200';
      case 3: return 'bg-yellow-50 border-yellow-200';
      case 4: return 'bg-green-50 border-green-200';
      case 5: return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getScoreLabel = (level: number) => {
    switch (level) {
      case 1: return 'Не развита';
      case 2: return 'Развита слабо';
      case 3: return 'Развита на базовом уровне';
      case 4: return 'Развита хорошо';
      case 5: return 'Развита отлично';
      default: return '';
    }
  };

  if (!currentCompetency) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Вернуться</span>
            </button>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              {savedAt && (
                <div className="flex items-center gap-2 text-green-600">
                  <Save className="w-4 h-4" />
                  <span>Сохранено {savedAt.toLocaleTimeString()}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>~{(totalSteps - currentStep) * 2} мин</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-gray-600 text-sm">Вы оцениваете:</div>
                <div className="text-gray-900 text-lg">{assesseeName}</div>
              </div>
              <div className="ml-auto">
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
                  Ваша роль: {assessorRole}
                </div>
              </div>
            </div>
          </div>

          {/* Прогресс бар */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Компетенция {currentStep + 1} из {totalSteps}
              </span>
              <span className="text-sm text-gray-600">
                {completedCount} оценено
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Заголовок компетенции */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-gray-400 text-2xl">#{currentStep + 1}</span>
                  <h2 className="text-gray-900 text-2xl">{currentCompetency.name}</h2>
                </div>
                <p className="text-gray-600 text-lg">{currentCompetency.description}</p>
              </div>
              <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                {currentCompetency.category}
              </div>
            </div>
          </div>

          {/* Шкала оценки */}
          <div className="mb-8">
            <h3 className="text-gray-900 mb-4">Оцените уровень развития компетенции</h3>
            
            {/* Звезды */}
            <div className="flex items-center gap-2 mb-6 justify-center">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => handleScoreChange(score)}
                  onMouseEnter={() => setHoveredScore(score)}
                  onMouseLeave={() => setHoveredScore(null)}
                  className={`transition-all transform hover:scale-110 ${
                    currentRating?.score >= score || (hoveredScore && hoveredScore >= score)
                      ? ''
                      : 'opacity-30'
                  }`}
                >
                  <Star
                    className={`w-12 h-12 ${
                      currentRating?.score >= score || (hoveredScore && hoveredScore >= score)
                        ? `${getScoreColor(score)} fill-current`
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Текущая оценка */}
            {currentRating?.score > 0 && (
              <div className={`text-center mb-6 p-4 border-2 rounded-lg ${getScoreBgColor(currentRating.score)}`}>
                <div className={`text-lg mb-1 ${getScoreColor(currentRating.score)}`}>
                  {currentRating.score} из 5 — {getScoreLabel(currentRating.score)}
                </div>
              </div>
            )}

            {/* Радиокнопки с описаниями */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((score) => (
                <label
                  key={score}
                  className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    currentRating?.score === score
                      ? `${getScoreBgColor(score)} border-current`
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleScoreChange(score)}
                >
                  <input
                    type="radio"
                    name="score"
                    value={score}
                    checked={currentRating?.score === score}
                    onChange={() => handleScoreChange(score)}
                    className="w-5 h-5 text-purple-600 focus:ring-2 focus:ring-purple-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-2xl ${getScoreColor(score)}`}>
                        {'★'.repeat(score)}{'☆'.repeat(5 - score)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        score === 1 ? 'bg-red-100 text-red-700' :
                        score === 2 ? 'bg-orange-100 text-orange-700' :
                        score === 3 ? 'bg-yellow-100 text-yellow-700' :
                        score === 4 ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {getScoreLabel(score)}
                      </span>
                    </div>
                    {showIndicators && (
                      <p className="text-gray-700 text-sm">
                        {currentCompetency.indicators[score - 1]?.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className="mt-4 text-sm text-purple-600 hover:text-purple-700"
            >
              {showIndicators ? 'Скрыть' : 'Показать'} описания уровней
            </button>
          </div>

          {/* Комментарий */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-gray-900 mb-3">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span>Комментарий (необязательно)</span>
            </label>
            <textarea
              value={currentRating?.comment || ''}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder={`Например: ${assesseeName.split(' ')[1]} всегда готова помочь и делится своими знаниями на командных стендапах...`}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <p className="text-gray-500 text-sm mt-2">
              Ваши комментарии помогут сделать обратную связь более содержательной и полезной
            </p>
          </div>

          {/* Навигация */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Назад
            </button>

            <div className="flex gap-2">
              {mockCompetencies.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-purple-500 w-8'
                      : ratings[mockCompetencies[index].id]?.score > 0
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < totalSteps - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  canProceed
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Далее
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Check className="w-5 h-5" />
                Отправить оценку
              </button>
            )}
          </div>
        </div>

        {/* Подсказка */}
        {!canProceed && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-900 mb-1">Выберите оценку</h4>
              <p className="text-blue-800 text-sm">
                Пожалуйста, оцените компетенцию "{currentCompetency.name}" перед переходом к следующей.
                Вы можете вернуться и изменить оценки позже.
              </p>
            </div>
          </div>
        )}

        {/* Информация о конфиденциальности */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Конфиденциальность
          </h4>
          <p className="text-gray-600 text-sm">
            Ваши оценки и комментарии конфиденциальны и будут агрегированы с оценками других участников.
            Оцениваемый сотрудник получит только обобщенные результаты без указания конкретных авторов.
          </p>
        </div>
      </div>
    </div>
  );
}