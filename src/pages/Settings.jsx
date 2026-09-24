import { useEffect, useMemo, useState } from 'react';
import packageJson from '../../package.json';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Activity,
  BadgeCheck,
  FileCheck2,
  Globe,
  Info,
  LogOut,
  Mail,
  Moon,
  Palette,
  PencilLine,
  Scale,
  Shield,
  Sun,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { useAuthUser } from '@/lib/useAuthUser';
import { logoutUser } from '@/lib/auth';
import { useThemePreference } from '@/lib/theme';
import { createPageUrl } from '@/utils';
import SettingsSectionCard from '@/components/settings/SettingsSectionCard';
import SettingsLinkRow from '@/components/settings/SettingsLinkRow';

const THEME_OPTIONS = [
  { value: 'light', label: { en: 'Light', ru: 'Светлая' }, icon: Sun },
  { value: 'dark', label: { en: 'Dark', ru: 'Темная' }, icon: Moon },
  { value: 'system', label: { en: 'System', ru: 'Системная' }, icon: Palette },
];

const COPY = {
  en: {
    loading: 'Loading settings...',
    title: 'Settings',
    subtitle: 'Manage your account, preferences, privacy information, and app details.',
    ready: 'Signed in and ready to train',
    editProfile: 'Edit Profile',
    logout: 'Log out',
    theme: 'Theme',
    language: 'Language',
    appVersion: 'App version',
    account: 'Account',
    accountDescription: 'Your signed-in profile and account actions.',
    displayName: 'Display name',
    email: 'Email',
    preferences: 'App Preferences',
    preferencesDescription: 'Theme and app display preferences.',
    activeTheme: 'Active theme',
    saved: 'Saved',
    currentLanguage: 'Current language',
    privacy: 'Privacy & Legal',
    privacyDescription: 'Important policy and safety information.',
    legalNotice:
      'The app provides educational and recommendation-based fitness content. It is not a replacement for medical advice or supervised rehabilitation.',
    privacyPolicy: 'Privacy Policy',
    privacyPolicyDescription: 'How your account and fitness data are handled.',
    terms: 'Terms of Service',
    termsDescription: 'Rules for using the app and its coaching features.',
    dataSafety: 'Data Usage / Data Safety',
    dataSafetyDescription: 'What data the app uses and why.',
    support: 'Support / Contact Us',
    supportDescription: 'Reach our team by email for account, product, or privacy questions.',
    about: 'About',
    aboutDescription: 'Version details and product background.',
    appName: 'App name',
    shortDescription: 'Short description',
    shortDescriptionText:
      'AI-guided workouts, progress tracking, nutrition planning, and camera-based exercise feedback in one place.',
    aboutUs: 'About Us',
    aboutUsDescription: 'What the product is building and where it is going.',
    dialogTitle: 'Edit Profile',
    dialogDescription: 'Update the display name shown inside your account settings.',
    name: 'Name',
    namePlaceholder: 'Enter your name',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    profileUpdated: 'Profile updated',
    saveError: 'Could not save profile',
    enterName: 'Enter your name',
    mustBeSignedIn: 'You must be signed in',
  },
  ru: {
    loading: 'Загрузка настроек...',
    title: 'Настройки',
    subtitle: 'Управляйте аккаунтом, предпочтениями, конфиденциальностью и сведениями о приложении.',
    ready: 'Вы вошли в аккаунт и готовы к тренировкам',
    editProfile: 'Редактировать профиль',
    logout: 'Выйти',
    theme: 'Тема',
    language: 'Язык',
    appVersion: 'Версия приложения',
    account: 'Аккаунт',
    accountDescription: 'Профиль пользователя и действия с аккаунтом.',
    displayName: 'Имя профиля',
    email: 'Email',
    preferences: 'Предпочтения приложения',
    preferencesDescription: 'Настройки темы и отображения приложения.',
    activeTheme: 'Активная тема',
    saved: 'Сохранено',
    currentLanguage: 'Текущий язык',
    privacy: 'Конфиденциальность и документы',
    privacyDescription: 'Важная информация о политике, безопасности и правилах.',
    legalNotice:
      'Приложение предоставляет обучающий и рекомендательный фитнес-контент. Это не замена медицинской консультации или реабилитации под наблюдением специалиста.',
    privacyPolicy: 'Политика конфиденциальности',
    privacyPolicyDescription: 'Как обрабатываются данные аккаунта и фитнес-активности.',
    terms: 'Условия использования',
    termsDescription: 'Правила использования приложения и его рекомендаций.',
    dataSafety: 'Использование данных / Безопасность данных',
    dataSafetyDescription: 'Какие данные используются и зачем они нужны.',
    support: 'Поддержка / Связаться с нами',
    supportDescription: 'Свяжитесь с нашей командой по email по вопросам аккаунта, продукта или конфиденциальности.',
    about: 'О приложении',
    aboutDescription: 'Версия, описание и информация о продукте.',
    appName: 'Название приложения',
    shortDescription: 'Краткое описание',
    shortDescriptionText:
      'AI-тренировки, отслеживание прогресса, планирование питания и анализ упражнений с камеры в одном месте.',
    aboutUs: 'О нас',
    aboutUsDescription: 'Что мы создаем и куда движется продукт.',
    dialogTitle: 'Редактировать профиль',
    dialogDescription: 'Обновите имя, которое показывается в настройках аккаунта.',
    name: 'Имя',
    namePlaceholder: 'Введите ваше имя',
    cancel: 'Отмена',
    saveChanges: 'Сохранить изменения',
    saving: 'Сохранение...',
    profileUpdated: 'Профиль обновлен',
    saveError: 'Не удалось сохранить профиль',
    enterName: 'Введите ваше имя',
    mustBeSignedIn: 'Необходимо войти в аккаунт',
  },
};

export default function Settings() {
  const user = useAuthUser();
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || 'ru').slice(0, 2) === 'ru' ? 'ru' : 'en';
  const copy = COPY[language];
  const queryClient = useQueryClient();
  const { theme, resolvedTheme, setTheme } = useThemePreference();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');

  const { data: profiles = [], isLoading: isProfileLoading } = useQuery({
    queryKey: ['settings-profile', user?.email],
    queryFn: () =>
      base44.entities.UserProfile.filter({ created_by: user.email }, '-created_date', 1),
    enabled: !!user?.email,
  });

  const profile = profiles[0] || null;

  useEffect(() => {
    setDisplayName(profile?.display_name || user?.displayName || '');
  }, [profile?.display_name, user?.displayName]);

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      const normalizedName = displayName.trim();
      if (!normalizedName) throw new Error(copy.enterName);
      if (!user?.email) throw new Error(copy.mustBeSignedIn);

      if (profile?.id) {
        return base44.entities.UserProfile.update(profile.id, {
          display_name: normalizedName,
        });
      }

      return base44.entities.UserProfile.create({
        display_name: normalizedName,
      });
    },
    onSuccess: async () => {
      toast.success(copy.profileUpdated);
      setIsEditOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['settings-profile'] });
    },
    onError: (error) => {
      toast.error(error?.message || copy.saveError);
    },
  });

  const accountName = useMemo(() => {
    return profile?.display_name || user?.displayName || user?.email?.split('@')[0] || 'Athlete';
  }, [profile?.display_name, user?.displayName, user?.email]);

  const currentLanguage = language === 'ru' ? 'Русский' : 'English';
  const versionLabel = packageJson.version || '1.0.0';
  const activeThemeLabel =
    resolvedTheme === 'dark'
      ? COPY[language].theme === 'Тема'
        ? 'Темная'
        : 'Dark'
      : COPY[language].theme === 'Тема'
      ? 'Светлая'
      : 'Light';

  if (user === undefined || isProfileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-sm text-gray-500 dark:text-gray-400">{copy.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{copy.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{copy.subtitle}</p>
        </div>

        <Card className="overflow-hidden border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <CardContent className="p-0">
            <div className="border-b border-gray-100 bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white dark:border-gray-800">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/10 text-2xl font-bold text-white">
                    {accountName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{accountName}</h2>
                    <p className="text-sm text-white/70">{user?.email || 'No email connected'}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-white/75">
                      <BadgeCheck className="h-4 w-4 text-emerald-300" />
                      <span>{copy.ready}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditOpen(true)}
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    <PencilLine className="mr-2 h-4 w-4" />
                    {copy.editProfile}
                  </Button>
                  <Button type="button" variant="destructive" onClick={logoutUser}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {copy.logout}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/40">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <Palette className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  {copy.theme}
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{theme === 'system' ? THEME_OPTIONS[2].label[language] : activeThemeLabel}</div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/40">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <Globe className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  {copy.language}
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{currentLanguage}</div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/40">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <Activity className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  {copy.appVersion}
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{versionLabel}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <SettingsSectionCard
            icon={User}
            title={copy.account}
            description={copy.accountDescription}
          >
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{copy.displayName}</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{accountName}</div>
                </div>
                <div className="sm:text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{copy.email}</div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 break-all">{user?.email}</div>
                </div>
              </div>
            </div>
            <SettingsLinkRow
              icon={PencilLine}
              title={copy.editProfile}
              description={language === 'ru' ? 'Обновите имя, которое видно в профиле.' : 'Update the name shown in your profile.'}
              action={() => setIsEditOpen(true)}
            />
            <SettingsLinkRow
              icon={LogOut}
              title={copy.logout}
              description={language === 'ru' ? 'Выйти из аккаунта на этом устройстве.' : 'Sign out from this device.'}
              action={logoutUser}
              danger
            />
          </SettingsSectionCard>

          <SettingsSectionCard
            icon={Palette}
            title={copy.preferences}
            description={copy.preferencesDescription}
          >
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{copy.theme}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {copy.activeTheme}: {theme === 'system' ? THEME_OPTIONS[2].label[language] : activeThemeLabel}
                  </div>
                </div>
                <div className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                  {copy.saved}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {THEME_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const selected = theme === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTheme(option.value)}
                      className={`rounded-lg border px-3 py-3 text-sm font-semibold transition-colors ${
                        selected
                          ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="mx-auto mb-2 h-4 w-4" />
                      {option.label[language]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{copy.language}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {copy.currentLanguage}: {currentLanguage}
                  </div>
                </div>
              </div>
            </div>
          </SettingsSectionCard>

          <SettingsSectionCard
            icon={Shield}
            title={copy.privacy}
            description={copy.privacyDescription}
          >
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
              {copy.legalNotice}
            </div>
            <SettingsLinkRow
              to={createPageUrl('privacypolicy')}
              icon={Shield}
              title={copy.privacyPolicy}
              description={copy.privacyPolicyDescription}
            />
            <SettingsLinkRow
              to={createPageUrl('termsofservice')}
              icon={Scale}
              title={copy.terms}
              description={copy.termsDescription}
            />
            <SettingsLinkRow
              to={createPageUrl('datasafety')}
              icon={FileCheck2}
              title={copy.dataSafety}
              description={copy.dataSafetyDescription}
            />
            <SettingsLinkRow
              icon={Mail}
              title={copy.support}
              description={`info52.aifit@gmail.com${language === 'ru' ? ' — написать в поддержку' : ' — email support'}`}
              action={() => {
                window.location.href = 'mailto:info52.aifit@gmail.com';
              }}
            />
          </SettingsSectionCard>

          <SettingsSectionCard
            icon={Info}
            title={copy.about}
            description={copy.aboutDescription}
          >
            <div className="grid gap-3">
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{copy.appName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">AI Fitness Coach</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{copy.appVersion}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{versionLabel}</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{copy.shortDescription}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{copy.shortDescriptionText}</div>
              </div>
            </div>
            <SettingsLinkRow
              to={createPageUrl('aboutus')}
              icon={Info}
              title={copy.aboutUs}
              description={copy.aboutUsDescription}
            />
          </SettingsSectionCard>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.dialogTitle}</DialogTitle>
            <DialogDescription>{copy.dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{copy.name}</label>
              <Input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder={copy.namePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{copy.email}</label>
              <Input value={user?.email || ''} disabled />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              {copy.cancel}
            </Button>
            <Button
              type="button"
              onClick={() => saveProfileMutation.mutate()}
              disabled={saveProfileMutation.isPending}
            >
              {saveProfileMutation.isPending ? copy.saving : copy.saveChanges}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
