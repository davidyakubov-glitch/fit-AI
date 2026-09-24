import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Layout from "./Layout";
import Workout from "./pages/Workout";
import ExerciseCatalog from "./pages/ExerciseCatalog";
import ExerciseAnalysis from "./pages/ExerciseAnalysis";
import WorkoutPlan from "./pages/WorkoutPlan";
import Community from "./pages/Community";
import Progress from "./pages/Progress";
import Referral from "./pages/Referral";
import Settings from "./pages/Settings";
import Nutrition from "./pages/Nutrition";
import AboutAICoach from "./pages/AboutAICoach";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DataSafety from "./pages/DataSafety";
import AboutUs from "./pages/AboutUs";
import { listenToAuthChanges } from "./lib/auth";
import AutoTranslator from "./components/AutoTranslator";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((firebaseUser) => {
      setUser(firebaseUser || null);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        <AutoTranslator />
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AutoTranslator />
      {!user ? (
        <Routes>
          <Route path="*" element={<Auth onLoginSuccess={setUser} />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/workout" replace />} />
            <Route path="workout" element={<Workout />} />
            <Route path="exercisecatalog" element={<ExerciseCatalog />} />
            <Route path="exercise-analysis/:exerciseId" element={<ExerciseAnalysis />} />
            <Route path="workoutplan" element={<WorkoutPlan />} />
            <Route path="community" element={<Community />} />
            <Route path="progress" element={<Progress />} />
            <Route path="referral" element={<Referral />} />
            <Route path="settings" element={<Settings />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="aboutaicoach" element={<AboutAICoach />} />
            <Route path="privacypolicy" element={<PrivacyPolicy />} />
            <Route path="termsofservice" element={<TermsOfService />} />
            <Route path="datasafety" element={<DataSafety />} />
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="*" element={<Navigate to="/workout" replace />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}
