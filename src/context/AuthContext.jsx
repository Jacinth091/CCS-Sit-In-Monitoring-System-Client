import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  clearStoredAuthSession,
  getStoredAuthToken,
  hasTokenExpired,
  decodeJwtPayload,
} from "../utils/authToken";
import studentService from '../services/student.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  // Sync token cleanup on user logout
  useEffect(() => {
    if (!user && !isLoading) {
      clearStoredAuthSession();
    }
  }, [user, isLoading]);

  // Initial session verification & Refresh
  useEffect(() => {
    const verifySession = async () => {
      const token = getStoredAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      if (hasTokenExpired(token, 10)) {
        setUser(null);
        clearStoredAuthSession();
        setIsLoading(false);
        return;
      }

      // Reconstruct basic user info from JWT
      const payload = decodeJwtPayload(token);
      const tokenData = payload?.data || {};

      if (tokenData.role === 'student') {
        try {
          const freshData = await studentService.getProfile();
          if (freshData) {
            setUser({ ...freshData, role: 'student' });
          } else {
            // Fallback to JWT data if profile fetch fails but token is valid
            setUser({ ...tokenData });
          }
        } catch (err) {
          // If profile fetch fails with 401, logout
          if (err.response?.status === 401) {
            setUser(null);
            clearStoredAuthSession();
          } else {
            // Network error or other: trust JWT for now
            setUser({ ...tokenData });
          }
        }
      } else if (tokenData.role === 'admin') {
        // For admin, we trust the JWT data
        setUser({ ...tokenData });
      }

      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    clearStoredAuthSession();
  };

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isStudent, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
