import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verifyToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        logout();
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      logout();
    }
  }, [token]);

  // Verificar token ao carregar
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token, verifyToken]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        toast.success('Login realizado com sucesso!');
        navigate('/dashboard');
        return { success: true };
      } else {
        toast.error(data.error || 'Erro no login');
        return { success: false, error: data.error };
      }
    } catch (error) {
      toast.error('Erro de conexão');
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Registo realizado com sucesso!');
        return { success: true };
      } else {
        toast.error(data.error || 'Erro no registo');
        return { success: false, error: data.error };
      }
    } catch (error) {
      toast.error('Erro de conexão');
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    toast.success('Logout realizado com sucesso');
  };

  const updateProfile = async (profileData) => {
    if (!user) return { success: false, error: 'Utilizador não autenticado' };

    try {
      const response = await fetch(`/api/users/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
        toast.success('Perfil atualizado com sucesso!');
        return { success: true };
      } else {
        toast.error(data.error || 'Erro ao atualizar perfil');
        return { success: false, error: data.error };
      }
    } catch (error) {
      toast.error('Erro de conexão');
      return { success: false, error: 'Erro de conexão' };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};