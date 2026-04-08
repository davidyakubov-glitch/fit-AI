import AboutAICoach from './pages/AboutAICoach';
import Auth from './pages/Auth';
import Community from './pages/Community';
import Nutrition from './pages/Nutrition';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import Workout from './pages/Workout';
import WorkoutPlan from './pages/WorkoutPlan';
import __Layout from './Layout.jsx';

export const PAGES = {
    "aboutaicoach": AboutAICoach,
    "auth": Auth,
    "login": Auth, // ДОБАВЛЕНО: теперь адрес /login тоже будет открывать Auth
    "community": Community,
    "nutrition": Nutrition,
    "privacypolicy": PrivacyPolicy,
    "progress": Progress,
    "settings": Settings,
    "workout": Workout,
    "workoutplan": WorkoutPlan,
}

export const pagesConfig = {
    mainPage: "workout",
    Pages: PAGES,
    Layout: __Layout,
};