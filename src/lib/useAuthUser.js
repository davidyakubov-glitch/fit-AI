import { useEffect, useState } from "react";
import { listenToAuthChanges } from "./auth";

export function useAuthUser() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((firebaseUser) => {
      setUser(firebaseUser || null);
    });

    return () => unsubscribe();
  }, []);

  return user;
}