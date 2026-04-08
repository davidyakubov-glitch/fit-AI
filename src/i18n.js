import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Меню
      "workout": "Workout",
      "exercisecatalog": "Catalog",
      "workoutplan": "Plan",
      "community": "Community",
      "progress": "Progress",
      "referral": "Refer",
      "settings": "Settings",
      "sign_in": "Sign In",
      "sign_out": "Sign Out",
      // Упражнения (для примера)
      "barbell_row": "Barbell Row",
      "bicep_curl": "Bicep Curl",
      "leg_press": "Leg Press",
      "intermediate": "Intermediate",
      "beginner": "Beginner",
      "gym": "Gym",
      "back": "Back"
    }
  },
  ru: {
    translation: {
      // Меню
      "workout": "Треня",
      "exercisecatalog": "Каталог",
      "workoutplan": "План",
      "community": "Группа",
      "progress": "Прогресс",
      "referral": "Реферал",
      "settings": "Настройки",
      "sign_in": "Войти",
      "sign_out": "Выйти",
      // Упражнения
      "barbell_row": "Тяга штанги",
      "bicep_curl": "Бицепс",
      "leg_press": "Жим ногами",
      "intermediate": "Средний",
      "beginner": "Новичок",
      "gym": "Зал",
      "back": "Спина"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: { escapeValue: false }
  });

export default i18n;