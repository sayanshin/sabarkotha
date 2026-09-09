import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../lib/firebase'; // Ensure your firebase auth instance path is correct
import { api, tokenStore } from '../lib/api';

interface AdminContextValue {
  isAdmin: boolean;
  checking: boolean;
  user: User | null;
  login: (password: string) => Promise<string | null>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  checking: true,
  user: null,
  login: async () => null,
  logout: () => {
    /* noop */
  },
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Listen to Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        setIsAdmin(true);
      } else {
        // Fallback check for custom token if present
        const token = tokenStore.get();
        if (token) {
          try {
            const res = await api.admin.verify();
            setIsAdmin(res.valid);
          } catch {
            tokenStore.clear();
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (password: string) => {
    try {
      const { token } = await api.admin.login(password);
      tokenStore.set(token);
      setIsAdmin(true);
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : 'লগইন ব্যর্থ হয়েছে';
    }
  };

  const logout = () => {
    tokenStore.clear();
    void signOut(auth);
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, checking, user, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
