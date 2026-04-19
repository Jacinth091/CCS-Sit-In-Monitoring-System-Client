import React, { createContext, useContext, useState, useEffect } from 'react';
import studentService from '../services/student.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Keep sessionStorage in sync
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('authToken');
    }
  }, [user]);

  // Initial session verification
  useEffect(() => {
    const verifySession = async () => {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // If it's a student, we can check their profile
        if (user?.role === 'student') {
          await studentService.getProfile();
        }
        // If it's an admin, we might need an admin-specific check or just a general heartbeat
        // For now, if we have a user and token, and any request fails, 
        // the interceptor in backendConnection.js will handle the logout/redirect.
      } catch (err) {
        console.error("Initial session verification failed:", err);
        // Interceptor already handles 401, but we ensure state is cleared if not handled
        if (err.response?.status === 401) {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
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
