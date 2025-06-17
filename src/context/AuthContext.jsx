import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.status === 401) {
          setRole(null);
        } else if (!response.ok) {
          throw new Error('Failed to verify role');
        } else {
          const data = await response.json();
          const validRoles = ['Dosen', 'Admin'];
          setRole(validRoles.includes(data?.role) ? data.role : null);
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError(err.message);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const logout = () => {
    setRole(null);
    setError(null);
  };
  return (
    <AuthContext.Provider value={{ role, loading, error, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};