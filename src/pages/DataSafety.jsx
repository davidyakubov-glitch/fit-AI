import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileCheck2 } from 'lucide-react';
import InfoPageLayout from '@/components/settings/InfoPageLayout';

const COPY = {
  en: {
    title: 'Data Usage / Data Safety',
    subtitle: 'A quick summary of how app data supports the product.',
    backLabel: 'Back to settings',
    sections: [
      {
        title: 'What data is used',
        paragraphs: [
          'The app may use account details, workout history, nutrition logs, and exercise analysis outputs to power your experience.',
          'Camera-based features can process pose and movement data while analysis is active.',
        ],
      },
      {
        title: 'Why it is used',
        paragraphs: [
          'Data supports workout tracking, progress insights, personalized plans, and real-time coaching feedback.',
          'Some usage data may also help improve product stability and feature quality.',
        ],
      },
      {
        title: 'Storage and control',
        paragraphs: [
          'Only the data needed for account and product functionality should be retained.',
          'You can review available settings, account details, and privacy information from within the app.',
        ],
      },
    ],
  },
  ru: {
    title: 'Использование данных / Безопасность данных',
    subtitle: 'Кратко о том, какие данные помогают работе приложения.',
    backLabel: 'Назад к настройкам',
    sections: [
      {
        title: 'Какие данные используются',
        paragraphs: [
          'Приложение может использовать данные аккаунта, историю тренировок, журналы питания и результаты анализа упражнений для работы функций сервиса.',
          'Функции с камерой могут обрабатывать данные о позе и движении, пока анализ активен.',
        ],
      },
      {
        title: 'Зачем они используются',
        paragraphs: [
          'Данные помогают вести учет тренировок, показывать прогресс, персонализировать планы и давать обратную связь в реальном времени.',
          'Часть технических данных также может использоваться для повышения стабильности и качества продукта.',
        ],
      },
      {
        title: 'Хранение и контроль',
        paragraphs: [
          'Мы стараемся хранить только те данные, которые нужны для работы аккаунта и функций приложения.',
          'Пользователь может просматривать доступные настройки, сведения об аккаунте и информацию о конфиденциальности внутри приложения.',
        ],
      },
    ],
  },
};

export default function DataSafety() {
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || 'ru').slice(0, 2) === 'ru' ? 'ru' : 'en';
  const copy = COPY[language];

  return (
    <InfoPageLayout
      icon={FileCheck2}
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
