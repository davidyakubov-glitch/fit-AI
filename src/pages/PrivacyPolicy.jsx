import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { createPageUrl } from '@/utils';

const Section = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      {children}
    </div>
  </section>
);

const COPY = {
  en: {
    backLabel: 'Back to settings',
    title: 'Privacy Policy & Terms',
    updated: 'Last updated: February 25, 2026',
    intro:
      'This Privacy Policy explains how AI Fitness Coach may collect, use, and protect information when you use the application. By using the app, you acknowledge this policy and the terms described below.',
    goBack: 'Go Back',
    sections: [
      {
        title: '1. Information We Collect',
        paragraphs: [
          'Account data may include your email address, name, and account credentials.',
          'Workout data may include workout sessions, exercise logs, rep counts, form scores, and body-related inputs that you choose to record.',
          'Nutrition data may include meal logs and food information that you add to the app.',
          'Camera features may access pose and movement data when exercise analysis is enabled.',
          'Limited usage data may be collected to maintain and improve the app.',
        ],
      },
      {
        title: '2. How We Use Your Data',
        paragraphs: [
          'Data is used to provide workout tracking, recommendations, insights, account support, and app improvements.',
          'We do not use personal information for unrelated purposes without an appropriate basis.',
        ],
      },
      {
        title: '3. Data Storage & Security',
        paragraphs: [
          'We use reasonable technical and organizational measures to help protect your information.',
          'No platform or transmission method can be guaranteed as completely secure, so you should also protect your device and account credentials.',
        ],
      },
      {
        title: '4. Camera & Sensor Data',
        paragraphs: [
          'Camera access is used only when a related feature is active.',
          'Processing methods may vary by feature, and saved outputs may include scores, counts, or exercise summaries.',
        ],
      },
      {
        title: '5. Your Rights',
        paragraphs: [
          'Depending on your location, you may have rights to access, correct, delete, or export certain personal data and to withdraw consent where applicable.',
          'To exercise these rights, use the in-app settings or contact us.',
        ],
      },
      {
        title: '6. Data Retention',
        paragraphs: [
          'Data may be retained as long as reasonably necessary to provide the service, comply with legal obligations, resolve disputes, and enforce agreements.',
        ],
      },
      {
        title: '7. Third-Party Services',
        paragraphs: [
          'The app may rely on third-party infrastructure such as backend, authentication, analytics, or device-processing tools.',
          'Those services operate under their own policies and technical implementations.',
        ],
      },
      {
        title: "8. Children's Privacy",
        paragraphs: [
          'The app is not intended for children under 13 years of age, and we do not knowingly seek personal data from that age group.',
        ],
      },
      {
        title: '9. Terms of Service',
        paragraphs: [
          'Use the app only for lawful and personal purposes.',
          'Do not misuse, disrupt, scrape, or attempt unauthorized access to the service.',
          'Use your own judgment before following workout or nutrition suggestions.',
          'AI-generated guidance may be limited or imperfect.',
        ],
      },
      {
        title: '10. Disclaimer and Limitation of Liability',
        paragraphs: [
          'The content provided by AI Fitness Coach, including workout instructions, exercise suggestions, AI-generated feedback, and nutrition content, is intended for informational, educational, and recommendation-based wellness purposes only.',
          'It is not medical advice, diagnosis, treatment, or a substitute for qualified professional guidance.',
          'The application does not guarantee safety, suitability, or results for any specific person, body type, injury history, or health condition.',
          'Consult a qualified healthcare professional before beginning a new exercise, nutrition, or wellness program, especially if you have injuries, medical conditions, or other health concerns.',
          'To the extent permitted by law, we are not responsible for injuries, pain, worsening of existing conditions, losses, or damages arising from the use of the app or from performing activities based on app guidance.',
          'By using the application, you accept responsibility for your own health, safety, and decisions.',
        ],
        bullets: [
          'Following workouts or recommendations provided in the app',
          'Improper, unsafe, or unsuitable exercise execution',
          'Reliance on AI-generated analysis or coaching feedback',
          'Training through pain, fatigue, instability, or physical limitation',
          'Failure to seek appropriate professional advice when needed',
        ],
      },
      {
        title: '11. Changes to This Policy',
        paragraphs: [
          'We may update this policy from time to time and revise the date shown at the top of the page.',
        ],
      },
      {
        title: '12. Contact Us',
        paragraphs: [
          'For privacy-related questions, requests, or concerns, contact info52.aifit@gmail.com.',
        ],
      },
    ],
  },
  ru: {
    backLabel: 'Назад к настройкам',
    title: 'Политика конфиденциальности и условия',
    updated: 'Последнее обновление: 25 февраля 2026',
    intro:
      'Эта Политика конфиденциальности объясняет, как AI Fitness Coach может собирать, использовать и защищать информацию при использовании приложения. Используя приложение, вы подтверждаете, что ознакомились с этой политикой и условиями ниже.',
    goBack: 'Назад',
    sections: [
      {
        title: '1. Какие данные мы собираем',
        paragraphs: [
          'Данные аккаунта могут включать email, имя и учетные данные для входа.',
          'Данные тренировок могут включать сессии, журналы упражнений, количество повторений, оценки техники и введенные пользователем показатели тела.',
          'Данные питания могут включать журналы приемов пищи и информацию о продуктах, которые вы добавляете в приложение.',
          'Функции камеры могут получать данные о позе и движении, когда включен анализ упражнений.',
          'Для поддержки и улучшения продукта могут собираться ограниченные технические данные об использовании.',
        ],
      },
      {
        title: '2. Как мы используем данные',
        paragraphs: [
          'Данные используются для трекинга тренировок, рекомендаций, аналитики прогресса, поддержки аккаунта и улучшения приложения.',
          'Мы не используем персональную информацию для несвязанных целей без надлежащих оснований.',
        ],
      },
      {
        title: '3. Хранение и защита данных',
        paragraphs: [
          'Мы применяем разумные технические и организационные меры для защиты информации.',
          'Ни одна платформа или способ передачи данных не может быть абсолютно безопасным, поэтому также важно защищать свое устройство и доступ к аккаунту.',
        ],
      },
      {
        title: '4. Данные камеры и сенсоров',
        paragraphs: [
          'Доступ к камере используется только тогда, когда активна соответствующая функция.',
          'Методы обработки могут отличаться в зависимости от функции, а сохраненные результаты могут включать оценки, повторы или сводки по упражнениям.',
        ],
      },
      {
        title: '5. Ваши права',
        paragraphs: [
          'В зависимости от вашего местоположения у вас могут быть права на доступ, исправление, удаление или экспорт части персональных данных, а также на отзыв согласия там, где это применимо.',
          'Чтобы воспользоваться этими правами, используйте настройки в приложении или свяжитесь с нами.',
        ],
      },
      {
        title: '6. Срок хранения данных',
        paragraphs: [
          'Данные могут храниться столько, сколько это разумно необходимо для работы сервиса, выполнения юридических обязательств, урегулирования споров и соблюдения договоренностей.',
        ],
      },
      {
        title: '7. Сторонние сервисы',
        paragraphs: [
          'Приложение может использовать стороннюю инфраструктуру, например backend, аутентификацию, аналитику или инструменты обработки на устройстве.',
          'Такие сервисы работают по собственным политикам и техническим правилам.',
        ],
      },
      {
        title: '8. Конфиденциальность детей',
        paragraphs: [
          'Приложение не предназначено для детей младше 13 лет, и мы не стремимся сознательно собирать персональные данные этой возрастной группы.',
        ],
      },
      {
        title: '9. Условия использования',
        paragraphs: [
          'Используйте приложение только в законных и личных целях.',
          'Запрещается злоупотреблять сервисом, нарушать его работу, собирать данные без разрешения или пытаться получить несанкционированный доступ.',
          'Прежде чем следовать рекомендациям по тренировкам или питанию, принимайте собственное взвешенное решение.',
          'Рекомендации, созданные ИИ, могут быть ограниченными или неидеальными.',
        ],
      },
      {
        title: '10. Отказ от ответственности и ограничение ответственности',
        paragraphs: [
          'Контент AI Fitness Coach, включая инструкции по упражнениям, рекомендации по тренировкам, AI-обратную связь и материалы по питанию, предоставляется только в информационных, обучающих и рекомендательных целях.',
          'Он не является медицинской консультацией, диагностикой, лечением или заменой квалифицированной профессиональной помощи.',
          'Приложение не гарантирует безопасность, пригодность или результат для конкретного человека, телосложения, истории травм или состояния здоровья.',
          'Перед началом новой программы тренировок, питания или оздоровления проконсультируйтесь с квалифицированным специалистом, особенно если у вас есть травмы, заболевания или другие проблемы со здоровьем.',
          'В максимально допустимой законом степени мы не несем ответственности за травмы, боль, ухудшение существующих состояний, убытки или иной вред, возникший при использовании приложения или выполнении действий на основе его рекомендаций.',
          'Используя приложение, вы принимаете ответственность за собственное здоровье, безопасность и принятые решения.',
        ],
        bullets: [
          'Следование тренировкам или рекомендациям из приложения',
          'Неправильное, небезопасное или неподходящее выполнение упражнений',
          'Опора на AI-анализ или AI-подсказки без дополнительной оценки',
          'Тренировки через боль, усталость, нестабильность или физические ограничения',
          'Отказ от обращения к специалисту, когда это необходимо',
        ],
      },
      {
        title: '11. Изменения этой политики',
        paragraphs: [
          'Мы можем время от времени обновлять эту политику и менять дату, указанную в верхней части страницы.',
        ],
      },
      {
        title: '12. Связь с нами',
        paragraphs: [
          'По вопросам конфиденциальности, запросам или обращениям пишите на info52.aifit@gmail.com.',
        ],
      },
    ],
  },
};

export default function PrivacyPolicy() {
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || 'ru').slice(0, 2) === 'ru' ? 'ru' : 'en';
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link to={createPageUrl('settings')}>
            <Button variant="ghost" size="icon" type="button" aria-label={copy.backLabel}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Shield className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{copy.title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{copy.updated}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-8 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {copy.intro}
          </div>

          <div className="space-y-8">
            {copy.sections.map((section) => (
              <Section key={section.title} title={section.title}>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </Section>
            ))}
          </div>
        </div>

        <div className="pb-8">
          <Link to={createPageUrl('settings')}>
            <Button variant="outline" type="button">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {copy.goBack}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
