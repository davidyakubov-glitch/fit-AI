import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Для перевода
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, User, Globe, Moon, Sun, Loader2, LogOut } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function Settings() {
  const { t, i18n } = useTranslation(); // Хук для перевода

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold">{t('settings')}</h1>
        </div>

        {/* ВЫБОР ЯЗЫКА */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('language')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button 
              variant={i18n.language === 'ru' ? 'default' : 'outline'} 
              onClick={() => changeLanguage('ru')}
            >
              Русский
            </Button>
            <Button 
              variant={i18n.language === 'en' ? 'default' : 'outline'} 
              onClick={() => changeLanguage('en')}
            >
              English
            </Button>
          </CardContent>
        </Card>

        {/* ИНФОРМАЦИЯ ОБ АККАУНТЕ */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('account_info')}
            </CardTitle>
          </CardHeader>
          <CardContent>
             {user ? (
               <div className="flex justify-between items-center">
                 <span>Email</span>
                 <span className="font-medium">{user.email}</span>
               </div>
             ) : (
               <Button onClick={() => base44.auth.redirectToLogin(createPageUrl('settings'))}>
                 {t('sign_in')}
               </Button>
             )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}