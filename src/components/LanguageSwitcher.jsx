import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { value: 'en', label: 'EN' },
  { value: 'ru', label: 'RU' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLanguage = (i18n.resolvedLanguage || i18n.language || 'ru').slice(0, 2);

  return (
    <div className="inline-flex rounded-full border border-gray-200 bg-white/90 p-1 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90">
      {LANGUAGES.map((language) => {
        const active = currentLanguage === language.value;
        return (
          <button
            key={language.value}
            type="button"
            onClick={() => i18n.changeLanguage(language.value)}
            className={`min-w-[44px] rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
              active
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            aria-pressed={active}
          >
            {language.label}
          </button>
        );
      })}
    </div>
  );
}
