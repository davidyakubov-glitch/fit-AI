import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAk9lWmsqyK3HNhHdg1B4xbHpB0_0QX-Yk",
  authDomain: "fitai-20581.firebaseapp.com",
  projectId: "fitai-20581",
  storageBucket: "fitai-20581.firebasestorage.app",
  messagingSenderId: "987728852013",
  appId: "1:987728852013:web:40ac5d9db6fc8641fc34a4",
  measurementId: "G-Z8SCXHTW0Z"
};

// Инициализация
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;