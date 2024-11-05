'use client';

import {
  createContext, useContext, ReactNode, useState, useEffect, useMemo,
} from 'react';
import { Amplify } from 'aws-amplify';
import { signOut as amplifySignOut, getCurrentUser } from 'aws-amplify/auth';
import outputs from '#/amplify_outputs.json';

Amplify.configure(outputs);

interface AuthContextType {
  user: any | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  async function signOut() {
    try {
      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const contextValue = useMemo(() => ({
    user,
    signOut,
  }), [user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
