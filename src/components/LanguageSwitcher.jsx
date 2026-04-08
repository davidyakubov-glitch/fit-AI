import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="h-8 w-12 text-[10px] font-bold border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all rounded-full"
    >
      {i18n.language.toUpperCase().substring(0, 2)}
    </Button>
  );
}