import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ExerciseCatalog from './pages/ExerciseCatalog';
import Referral from './pages/Referral';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { useEffect } from 'react'; // Добавили
import { db } from './firebase';    // Добавили
import { collection, getDocs } from 'firebase/firestore'; // Добавили

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // ПРОВЕРКА FIREBASE
  useEffect(() => {
    const checkFirebase = async () => {
      try {
        await getDocs(collection(db, "test"));
        console.log("🔥 Firebase: Соединение установлено успешно!");
      } catch (err) {
        console.warn("⚠️ Firebase: База создана, но проверь правила доступа (Rules)");
      }
    }
    checkFirebase();
  }, []);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/auth" element={<LayoutWrapper currentPageName="auth"><Auth /></LayoutWrapper>} />
      <Route path="/login" element={<LayoutWrapper currentPageName="auth"><Auth /></LayoutWrapper>} />
      <Route path="/settings" element={<LayoutWrapper currentPageName="settings"><Settings /></LayoutWrapper>} />
      
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />

      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}

      <Route path="/ExerciseCatalog" element={<LayoutWrapper currentPageName="ExerciseCatalog"><ExerciseCatalog /></LayoutWrapper>} />
      <Route path="/Referral" element={<LayoutWrapper currentPageName="Referral"><Referral /></LayoutWrapper>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App;