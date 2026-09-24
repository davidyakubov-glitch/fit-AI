import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scale } from 'lucide-react';
import InfoPageLayout from '@/components/settings/InfoPageLayout';

const COPY = {
  en: {
    title: 'Terms of Service',
    subtitle: 'Core rules for using the app responsibly.',
    backLabel: 'Back to settings',
    sections: [
      {
        title: 'Using the app',
        paragraphs: [
          'Use AI Fitness Coach for lawful personal fitness and wellness purposes.',
          'Do not abuse, scrape, disrupt, or attempt unauthorized access to the service.',
        ],
      },
      {
        title: 'Fitness guidance',
        paragraphs: [
          'Workout, nutrition, and technique suggestions are educational and recommendation-based content and may not fit every body, injury history, or medical condition.',
          'The app does not provide medical treatment, diagnosis, rehabilitation oversight, or guaranteed results.',
          'You are responsible for choosing safe intensity, range of motion, training load, and recovery for your situation.',
        ],
      },
      {
        title: 'Injury and liability disclaimer',
        paragraphs: [
          'Use the app and perform exercises at your own risk.',
          'To the extent permitted by law, AI Fitness Coach is not responsible for injuries, pain, strain, worsening of existing conditions, or other damages that may result from following app content or recommendations.',
          'If you have pain, dizziness, injury history, medical restrictions, or uncertainty about safe exercise, stop and seek qualified professional advice before continuing.',
        ],
      },
      {
        title: 'Account responsibilities',
        paragraphs: [
          'Keep your login secure and protect access to your device and account.',
          'We may restrict access when there is misuse, fraud, or repeated violation of app rules.',
        ],
      },
    ],
  },
  ru: {
    title: 'Условия использования',
    subtitle: 'Основные правила безопасного и ответственного использования приложения.',
    backLabel: 'Назад к настройкам',
    sections: [
      {
        title: 'Использование приложения',
        paragraphs: [
          'Используйте AI Fitness Coach только в законных личных целях, связанных с фитнесом и самочувствием.',
          'Запрещается злоупотреблять сервисом, нарушать его работу, собирать данные без разрешения или пытаться получить несанкционированный доступ.',
        ],
      },
      {
        title: 'Фитнес-рекомендации',
        paragraphs: [
          'Рекомендации по тренировкам, питанию и технике носят обучающий и рекомендательный характер и могут подходить не каждому человеку, состоянию здоровья или истории травм.',
          'Приложение не предоставляет медицинское лечение, диагностику, реабилитационное сопровождение и не гарантирует результат.',
          'Вы сами отвечаете за выбор безопасной интенсивности, амплитуды, нагрузки и восстановления в своей ситуации.',
        ],
      },
      {
        title: 'Травмы и ограничение ответственности',
        paragraphs: [
          'Вы используете приложение и выполняете упражнения на свой страх и риск.',
          'В максимально допустимой законом степени AI Fitness Coach не несет ответственности за травмы, боль, растяжения, ухудшение существующих состояний и иной вред, который может возникнуть при следовании рекомендациям приложения.',
          'Если у вас есть боль, головокружение, ограничения по здоровью, травмы или сомнения в безопасности упражнений, прекратите тренировку и обратитесь к квалифицированному специалисту.',
        ],
      },
      {
        title: 'Ответственность за аккаунт',
        paragraphs: [
          'Храните данные входа в безопасности и защищайте доступ к своему устройству и аккаунту.',
          'Мы можем ограничить доступ при злоупотреблении сервисом, мошенничестве или повторных нарушениях правил.',
        ],
      },
    ],
  },
};

export default function TermsOfService() {
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || 'ru').slice(0, 2) === 'ru' ? 'ru' : 'en';
  const copy = COPY[language];

  return (
    <InfoPageLayout
      icon={Scale}
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
