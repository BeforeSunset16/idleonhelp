'use client';

import {
  createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback,
} from 'react';
import { Amplify } from 'aws-amplify';
import { signOut as amplifySignOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import outputs from '#/amplify_outputs.json';

Amplify.configure(outputs);

interface AuthContextType {
  user: any | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      setUser({
        ...currentUser,
        signInDetails: {
          loginId: attributes.email || currentUser.username,
        },
      });
    } catch (err) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

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
    refreshUser,
  }), [user, refreshUser]);

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
