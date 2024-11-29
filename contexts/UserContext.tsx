// contexts/UserContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserPreferences } from '../types/players';
import { 
  authenticateUser, 
  updateUserPreferences, 
  fetchUserProfile 
} from '../services/api/userService';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  preferences: UserPreferences;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    darkMode: false,
    sportPreferences: [],
    notificationSettings: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userProfile = await fetchUserProfile();
          setUser(userProfile);
          setIsAuthenticated(true);
        } catch {
          // Token is invalid or expired
          localStorage.removeItem('authToken');
        }
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await authenticateUser(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', userData.token);
    } catch (err) {
      setError('Authentication failed');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    setIsLoading(true);
    try {
      const updatedPreferences = await updateUserPreferences(newPreferences);
      setPreferences(prev => ({ ...prev, ...updatedPreferences }));
    } catch (err) {
      setError('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated,
      preferences,
      login,
      logout,
      updatePreferences,
      isLoading,
      error
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};