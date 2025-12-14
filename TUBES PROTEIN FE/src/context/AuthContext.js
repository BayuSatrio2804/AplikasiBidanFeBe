/**
 * Auth Context - Global authentication state management
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, getStoredUser, clearAuth } from '../services/api';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const token = getToken();
      const storedUser = getStoredUser();
      
      if (token && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login handler - stores user data after OTP verification
   */
  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * Update user data
   */
  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  /**
   * Refresh user profile from API
   */
  const refreshProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      // If token invalid, logout
      if (error.status === 401 || error.status === 403) {
        logout();
      }
    }
    return null;
  }, [logout]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
