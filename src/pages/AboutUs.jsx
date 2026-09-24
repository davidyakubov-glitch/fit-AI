import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import InfoPageLayout from '@/components/settings/InfoPageLayout';

const COPY = {
  en: {
    title: 'About Us',
    subtitle: 'A short look at the product and its direction.',
    backLabel: 'Back to settings',
    sections: [
      {
        title: 'What we are building',
        paragraphs: [
          'AI Fitness Coach brings workouts, exercise learning, tracking, nutrition, and live movement feedback into one training flow.',
          'The goal is to make everyday fitness guidance simpler, clearer, and more useful.',
        ],
      },
      {
        title: 'Product direction',
        paragraphs: [
          'We are improving exercise analysis, rep counting, personalized plans, and training quality guidance across the app.',
          'Settings, legal pages, and account controls are part of making the experience feel complete and trustworthy.',
        ],
      },
      {
        title: 'Current stage',
        paragraphs: [
          'The product is actively evolving, with new training flows, better localization, and more stable exercise detection being added over time.',
        ],
      },
    ],
  },
  ru: {
    title: 'О нас',
    subtitle: 'Коротко о продукте и направлении его развития.',
    backLabel: 'Назад к настройкам',
    sections: [
      {
        title: 'Что мы строим',
        paragraphs: [
          'AI Fitness Coach объединяет тренировки, обучение упражнениям, трекинг, питание и обратную связь по движениям в один понятный процесс.',
          'Наша цель — сделать ежедневные фитнес-рекомендации проще, понятнее и полезнее.',
        ],
      },
      {
        title: 'Куда движется продукт',
        paragraphs: [
          'Мы улучшаем анализ упражнений, подсчет повторений, персональные планы и качество тренировочных подсказок по всему приложению.',
          'Настройки, юридические страницы и управление аккаунтом тоже важны, потому что делают продукт более цельным и надежным.',
        ],
      },
      {
        title: 'Текущий этап',
        paragraphs: [
          'Продукт активно развивается: мы добавляем новые тренировочные сценарии, улучшаем локализацию и повышаем стабильность распознавания упражнений.',
        ],
      },
    ],
  },
};

export default function AboutUs() {
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || 'ru').slice(0, 2) === 'ru' ? 'ru' : 'en';
  const copy = COPY[language];

  return (
    <InfoPageLayout
      icon={Info}
      title={copy.title}
      subtitle={copy.subtitle}
      backLabel={copy.backLabel}
      sections={copy.sections.map((section) => ({
        title: section.title,
        content: (
          <>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </>
        ),
      }))}
    />
  );
}
