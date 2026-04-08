import { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import { listenToAuthChanges, logoutUser } from "./lib/auth";

function WorkoutPage({ user }) {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">FitAI Dashboard</h1>
            <p className="text-gray-500 mt-2">
              Welcome, {user?.email}
            </p>
          </div>

          <button
            onClick={logoutUser}
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            Log out
          </button>
        </div>

        <div className="p-6 rounded-2xl border bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">You are logged in</h2>
          <p className="text-gray-600">
            Firebase auth works, and this is your protected app screen.
          </p>
        </div>
      </div>
    </div>
  );
}

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
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Auth onLoginSuccess={setUser} />;
  }

  return <WorkoutPage user={user} />;
}
