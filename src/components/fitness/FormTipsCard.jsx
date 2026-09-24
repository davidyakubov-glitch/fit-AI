import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

export default function FormTipsCard() {
  const { i18n } = useTranslation();
  const isRussian = String(i18n.resolvedLanguage || i18n.language).startsWith('ru');

  const englishIssues = [
    {
      issue: 'Knees caving in',
      fixes: [
        'Widen your stance to shoulder-width or slightly wider',
        'Push your knees out and track them over your toes',
        'Strengthen glutes with band exercises',
        'Focus on engaging outer thighs'
      ]
    },
    {
      issue: 'Heels lifting',
      fixes: [
        "Shift weight to your heels and think 'sit back'",
        'Improve ankle mobility with daily stretches',
        'Try squatting with heels slightly elevated first',
        'Ensure shoes are flat and stable'
      ]
    },
    {
      issue: 'Shallow depth',
      fixes: [
        'Work on hip and ankle flexibility',
        'Use a box or chair as a depth guide',
        'Practice deep squat holds',
        'Try goblet squats for better form'
      ]
    },
    {
      issue: 'Forward lean',
      fixes: [
        'Engage your core throughout the movement',
        'Keep chest up and eyes forward',
        'Strengthen your back and core',
        'Do not rush, control the descent'
      ]
    }
  ];

  const russianIssues = [
    {
      issue: 'Колени заваливаются внутрь',
      fixes: [
        'Поставьте стопы на ширину плеч или немного шире',
        'Разводите колени наружу и ведите их по линии носков',
        'Укрепляйте ягодицы упражнениями с резинкой',
        'Сосредоточьтесь на включении внешней стороны бёдер'
      ]
    },
    {
      issue: 'Пятки отрываются',
      fixes: [
        'Перенесите вес на пятки и думайте: "сядь назад"',
        'Ежедневно улучшайте подвижность голеностопа растяжкой',
        'Сначала попробуйте приседать с небольшим подъёмом под пятками',
        'Убедитесь, что обувь плоская и устойчивая'
      ]
    },
    {
      issue: 'Недостаточная глубина',
      fixes: [
        'Работайте над гибкостью бёдер и голеностопа',
        'Используйте коробку или стул как ориентир глубины',
        'Практикуйте удержание глубокого приседа',
        'Попробуйте гоблет-приседания для лучшей техники'
      ]
    },
    {
      issue: 'Наклон вперёд',
      fixes: [
        'Напрягайте кор на протяжении всего движения',
        'Держите грудь выше, а взгляд направляйте вперёд',
        'Укрепляйте спину и мышцы кора',
        'Не спешите, контролируйте опускание'
      ]
    }
  ];

  const commonIssues = isRussian ? russianIssues : englishIssues;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Lightbulb className="h-5 w-5" />
          {isRussian ? 'Частые ошибки техники и исправления' : 'Common Form Issues & Fixes'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {commonIssues.map((item) => (
          <div key={item.issue} className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-2">
              {isRussian ? 'Ошибка: ' : 'Issue: '}{item.issue}
            </h4>
            <ul className="space-y-1.5">
              {item.fixes.map((fix) => (
                <li key={fix} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{fix}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
