import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, tokenStore } from '../lib/api';

interface AdminContextValue {
  isAdmin: boolean;
  checking: boolean;
  login: (password: string) => Promise<string | null>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  checking: true,
  login: async () => null,
  logout: () => {
    /* noop */
  },
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = tokenStore.get();
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        const res = await api.admin.verify();
        if (res.valid) {
          setIsAdmin(true);
        } else {
          tokenStore.clear();
        }
      } catch {
        tokenStore.clear();
      } finally {
        setChecking(false);
      }
    };
    void verify();
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
    setIsAdmin(false);
  };

  return <AdminContext.Provider value={{ isAdmin, checking, login, logout }}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => useContext(AdminContext);
