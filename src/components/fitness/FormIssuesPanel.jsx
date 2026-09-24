import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const issueCategories = {
  knees_caving_in: {
    title: 'Knees Caving In',
    description: 'Your knees are collapsing inward during the squat',
    causes: ['Weak glutes', 'Tight hip adductors', 'Stance too narrow'],
    fixes: [
      'Push knees out actively during descent',
      'Widen your stance to shoulder-width or slightly wider',
      'Use a resistance band around knees for awareness',
      'Strengthen glutes with clamshells and hip thrusts'
    ],
    priority: 1
  },
  heels_lifting: {
    title: 'Heels Lifting',
    description: 'Your heels are coming off the ground',
    causes: ['Limited ankle mobility', 'Weight too far forward', 'Tight calves'],
    fixes: [
      'Keep weight on your heels throughout the movement',
      'Improve ankle mobility with calf stretches',
      'Try elevating heels slightly with plates temporarily',
      'Focus on sitting back rather than down'
    ],
    priority: 1
  },
  insufficient_depth: {
    title: 'Insufficient Depth',
    description: 'Not reaching proper squat depth',
    causes: ['Limited mobility', 'Lack of confidence', 'Weak legs'],
    fixes: [
      'Work on hip and ankle flexibility',
      'Use box squats to build confidence',
      'Practice deep squat holds',
      'Gradually increase depth over time'
    ],
    priority: 2
  },
  excessive_forward_lean: {
    title: 'Excessive Forward Lean',
    description: 'Torso leaning too far forward',
    causes: ['Weak core', 'Poor hip mobility', 'Incorrect form'],
    fixes: [
      'Keep chest up and look forward',
      'Engage your core throughout the movement',
      'Strengthen lower back and core',
      'Focus on sitting back rather than folding forward'
    ],
    priority: 2
  },
  knees_too_forward: {
    title: 'Knees Too Far Forward',
    description: 'Knees tracking excessively past toes',
    causes: ['Shifting weight forward', 'Poor squat pattern'],
    fixes: [
      'Sit back more into the squat',
      'Keep weight centered on mid-foot',
      'Engage glutes and hamstrings',
      'Practice wall squats for proper pattern'
    ],
    priority: 2
  },
  stance_too_narrow: {
    title: 'Narrow Stance',
    description: 'Feet too close together',
    causes: ['Improper setup', 'Lack of awareness'],
    fixes: [
      'Set feet shoulder-width apart or slightly wider',
      'Toes pointed slightly outward, about 10-15 degrees',
      'This provides better stability and depth'
    ],
    priority: 2
  },
  hip_shift: {
    title: 'Hip Shift',
    description: 'Hips shifting to one side',
    causes: ['Muscle imbalance', 'Previous injury', 'Weak side compensation'],
    fixes: [
      'Focus on keeping hips level',
      'Add single-leg exercises to correct imbalances',
      'Reduce weight and focus on symmetry',
      'Consider consulting a professional if persistent'
    ],
    priority: 2
  },
  uneven_leg_descent: {
    title: 'Uneven Descent',
    description: 'One leg bending more than the other',
    causes: ['Muscle imbalance', 'Poor coordination'],
    fixes: [
      'Slow down and focus on symmetry',
      'Use a mirror to check form',
      'Practice single-leg exercises',
      'Ensure equal weight distribution'
    ],
    priority: 2
  },
  neck_forward: {
    title: 'Neck Forward',
    description: 'Your head is drifting forward from a neutral line',
    causes: ['Looking too far up or down', 'Neck tension', 'Poor camera awareness'],
    fixes: [
      'Keep your chin slightly tucked',
      'Look forward or slightly down depending on the exercise',
      'Keep ears aligned over shoulders'
    ],
    priority: 1
  },
  spine_not_neutral: {
    title: 'Back Not Neutral',
    description: 'Your spine angle is drifting away from a stable neutral line',
    causes: ['Weak bracing', 'Rounding the back', 'Hips sagging or piking'],
    fixes: [
      'Brace your core before each rep',
      'Keep ribs down and spine long',
      'Move slower until the back line stays stable'
    ],
    priority: 1
  },
  knee_asymmetry: {
    title: 'Uneven Knees',
    description: 'Left and right knee angles are moving unevenly',
    causes: ['Weight shifted to one side', 'Mobility difference', 'Poor balance'],
    fixes: [
      'Push evenly through both feet',
      'Slow the rep down',
      'Keep knees tracking in the same direction as toes'
    ],
    priority: 2
  },
  elbow_asymmetry: {
    title: 'Uneven Elbows',
    description: 'Left and right elbow angles are not matching',
    causes: ['One arm working harder', 'Uneven grip', 'Shoulder instability'],
    fixes: [
      'Move both arms at the same speed',
      'Keep grip and elbow path symmetrical',
      'Reduce load or slow down if needed'
    ],
    priority: 2
  },
  shoulder_asymmetry: {
    title: 'Uneven Shoulders',
    description: 'Your shoulder angles are uneven from side to side',
    causes: ['Shrugging one shoulder', 'Uneven arm path', 'Torso rotation'],
    fixes: [
      'Level both shoulders before the rep',
      'Avoid twisting your torso',
      'Keep both arms on the same path'
    ],
    priority: 2
  }
};

const ruIssueCategories = {
  knees_caving_in: {
    title: 'Колени заваливаются внутрь',
    description: 'Колени сходятся внутрь во время приседания',
    causes: ['Слабые ягодичные мышцы', 'Зажатые приводящие мышцы бедра', 'Слишком узкая стойка'],
    fixes: [
      'Активно разводите колени наружу при опускании',
      'Поставьте стопы на ширину плеч или чуть шире',
      'Используйте резинку над коленями для контроля',
      'Укрепляйте ягодицы: ракушка, ягодичный мостик, отведения'
    ],
    priority: 1
  },
  heels_lifting: {
    title: 'Пятки отрываются',
    description: 'Пятки отрываются от пола во время движения',
    causes: ['Ограниченная подвижность голеностопа', 'Вес уходит слишком далеко вперёд', 'Зажатые икроножные мышцы'],
    fixes: [
      'Держите вес на середине стопы и пятках',
      'Работайте над подвижностью голеностопа и растяжкой икр',
      'Временно попробуйте небольшое возвышение под пятки',
      'Садитесь тазом назад, а не только вниз'
    ],
    priority: 1
  },
  insufficient_depth: {
    title: 'Недостаточная глубина',
    description: 'Присед не достигает нужной глубины',
    causes: ['Ограниченная мобильность', 'Неуверенность в движении', 'Недостаточная сила ног'],
    fixes: [
      'Развивайте подвижность бёдер и голеностопа',
      'Используйте приседания на коробку для уверенности',
      'Практикуйте удержание глубокого приседа',
      'Постепенно увеличивайте глубину'
    ],
    priority: 2
  },
  excessive_forward_lean: {
    title: 'Сильный наклон вперёд',
    description: 'Корпус слишком сильно наклоняется вперёд',
    causes: ['Слабый кор', 'Плохая подвижность бёдер', 'Неверная техника'],
    fixes: [
      'Держите грудь выше и смотрите вперёд',
      'Напрягайте кор на протяжении всего движения',
      'Укрепляйте низ спины и мышцы кора',
      'Садитесь назад, а не складывайтесь вперёд'
    ],
    priority: 2
  },
  knees_too_forward: {
    title: 'Колени слишком далеко вперёд',
    description: 'Колени чрезмерно выходят за линию носков',
    causes: ['Вес смещается вперёд', 'Неправильный паттерн приседа'],
    fixes: [
      'Сильнее отводите таз назад в приседе',
      'Держите вес по центру стопы',
      'Включайте ягодицы и заднюю поверхность бедра',
      'Практикуйте приседания у стены для правильного паттерна'
    ],
    priority: 2
  },
  stance_too_narrow: {
    title: 'Слишком узкая стойка',
    description: 'Стопы стоят слишком близко друг к другу',
    causes: ['Неправильная постановка стоп', 'Недостаточный контроль позиции'],
    fixes: [
      'Поставьте стопы на ширину плеч или немного шире',
      'Разверните носки слегка наружу на 10-15 градусов',
      'Так будет легче удерживать стабильность и глубину'
    ],
    priority: 2
  },
  hip_shift: {
    title: 'Смещение таза',
    description: 'Таз уходит в одну сторону',
    causes: ['Мышечный дисбаланс', 'Последствия травмы', 'Компенсация слабой стороны'],
    fixes: [
      'Следите, чтобы таз оставался ровным',
      'Добавьте упражнения на одну ногу для устранения дисбаланса',
      'Уменьшите нагрузку и работайте над симметрией',
      'Если проблема сохраняется, лучше обратиться к специалисту'
    ],
    priority: 2
  },
  uneven_leg_descent: {
    title: 'Неровное опускание',
    description: 'Одна нога сгибается сильнее другой',
    causes: ['Мышечный дисбаланс', 'Плохая координация'],
    fixes: [
      'Замедлите движение и следите за симметрией',
      'Используйте зеркало для контроля техники',
      'Практикуйте упражнения на одну ногу',
      'Распределяйте вес равномерно'
    ],
    priority: 2
  },
  neck_forward: {
    title: 'Голова уходит вперёд',
    description: 'Голова смещается вперёд относительно нейтральной линии',
    causes: ['Взгляд слишком высоко или слишком низко', 'Напряжение в шее', 'Недостаточный контроль положения перед камерой'],
    fixes: [
      'Слегка подтяните подбородок',
      'Смотрите вперёд или немного вниз в зависимости от упражнения',
      'Держите уши над линией плеч'
    ],
    priority: 1
  },
  spine_not_neutral: {
    title: 'Спина не нейтральна',
    description: 'Положение позвоночника уходит от стабильной нейтральной линии',
    causes: ['Слабая фиксация корпуса', 'Округление спины', 'Провисание или подъём таза'],
    fixes: [
      'Напрягайте кор перед каждым повторением',
      'Держите рёбра опущенными, а спину длинной',
      'Двигайтесь медленнее, пока линия спины не станет стабильной'
    ],
    priority: 1
  },
  knee_asymmetry: {
    title: 'Колени движутся несимметрично',
    description: 'Углы левого и правого колена отличаются во время движения',
    causes: ['Вес смещён на одну сторону', 'Разница в мобильности', 'Плохой баланс'],
    fixes: [
      'Отталкивайтесь равномерно обеими стопами',
      'Замедлите повторение',
      'Ведите колени в направлении носков'
    ],
    priority: 2
  },
  elbow_asymmetry: {
    title: 'Локти движутся несимметрично',
    description: 'Углы левого и правого локтя не совпадают',
    causes: ['Одна рука работает сильнее', 'Неровный хват', 'Нестабильность плеч'],
    fixes: [
      'Двигайте обе руки с одинаковой скоростью',
      'Держите хват и траекторию локтей симметричными',
      'Уменьшите нагрузку или замедлитесь'
    ],
    priority: 2
  },
  shoulder_asymmetry: {
    title: 'Плечи неровные',
    description: 'Плечи расположены несимметрично относительно друг друга',
    causes: ['Одно плечо поднимается выше', 'Неровная траектория рук', 'Поворот корпуса'],
    fixes: [
      'Выравнивайте плечи перед повторением',
      'Не разворачивайте корпус',
      'Держите обе руки на одной траектории'
    ],
    priority: 2
  }
};

const ruLabels = {
  high: 'высокая',
  medium: 'средняя',
  low: 'низкая',
  'Start workout to see form analysis': 'Начните тренировку, чтобы увидеть анализ техники',
  'Excellent Form!': 'Отличная техника!',
  'No issues detected. Keep it up!': 'Ошибок не найдено. Продолжайте в том же духе!',
  'Form Issues Detected': 'Найдены ошибки техники',
  'Quick Fixes:': 'Быстрые исправления:',
  'Why this happens...': 'Почему это происходит...'
};

function isRussian(lang) {
  return String(lang || '').toLowerCase().startsWith('ru');
}

function translateLabel(value, lang) {
  return isRussian(lang) ? ruLabels[value] || value : value;
}

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high': return 'text-red-600';
    case 'medium': return 'text-orange-600';
    case 'low': return 'text-yellow-600';
    default: return 'text-gray-600';
  }
};

const getSeverityBg = (severity) => {
  switch (severity) {
    case 'high': return 'bg-red-50 border-red-200';
    case 'medium': return 'bg-orange-50 border-orange-200';
    case 'low': return 'bg-yellow-50 border-yellow-200';
    default: return 'bg-gray-50 border-gray-200';
  }
};

export default function FormIssuesPanel({ currentIssues = [], issueDetails = {}, isActive }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const issuesDictionary = isRussian(language) ? ruIssueCategories : issueCategories;

  const sortedIssues = currentIssues
    .filter((issue) => issuesDictionary[issue])
    .sort((a, b) => {
      const priorityA = issuesDictionary[a]?.priority || 999;
      const priorityB = issuesDictionary[b]?.priority || 999;
      return priorityA - priorityB;
    });

  if (!isActive) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="pt-6 text-center text-gray-500">
          <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>{translateLabel('Start workout to see form analysis', language)}</p>
        </CardContent>
      </Card>
    );
  }

  if (sortedIssues.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-green-900 mb-1">
            {translateLabel('Excellent Form!', language)}
          </h3>
          <p className="text-sm text-green-700">
            {translateLabel('No issues detected. Keep it up!', language)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          {translateLabel('Form Issues Detected', language)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedIssues.map((issueKey) => {
          const issue = issuesDictionary[issueKey];
          const details = issueDetails[issueKey] || {};
          const severity = details.severity || 'medium';

          return (
            <div
              key={issueKey}
              className={cn('border rounded-lg p-3 space-y-2', getSeverityBg(severity))}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn('font-semibold', getSeverityColor(severity))}>
                      {issue.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={cn('text-xs', getSeverityColor(severity))}
                    >
                      {translateLabel(severity, language)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-700">{issue.description}</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-700">
                  {translateLabel('Quick Fixes:', language)}
                </div>
                <ul className="space-y-1">
                  {issue.fixes.slice(0, 2).map((fix, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className="text-green-600 font-bold">•</span>
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <details className="text-xs">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
                  {translateLabel('Why this happens...', language)}
                </summary>
                <ul className="mt-1 space-y-0.5 ml-4">
                  {issue.causes.map((cause, idx) => (
                    <li key={idx} className="text-gray-600">• {cause}</li>
                  ))}
                </ul>
              </details>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
