import { useState, useEffect } from 'react';
import { authClient, type User } from '@/utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    const initializeAuth = () => {
      const storedUser = authClient.getUser();

      setUser(storedUser);
      setIsLoading(false);
    };

    initializeAuth();

    // Optional: Listen for storage changes (if user logs in/out in another tab)
    const handleStorageChange = () => {
      initializeAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    authClient.clearAuthData();
    setUser(null);
  };

  return {
    user,
    isLoading,
    logout,
  };
};
