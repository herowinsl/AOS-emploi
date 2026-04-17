import { useState, useEffect } from 'react';
import { getAuthToken, clearAuthToken } from '../services/api';

/**
 * Custom hook for authentication state management
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has auth token
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
      // Try to parse user data from token or load from API
      try {
        // JWT payload is the second part
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        setUser({
          id: payload.id,
          email: payload.email,
        });
      } catch (err) {
        console.error('[v0] Failed to parse auth token:', err);
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    logout,
  };
}
