import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as loginAPI, register as registerAPI, updateProfile } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const { data } = await getMe();
          setUser(data.data);
          setToken(storedToken);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await loginAPI({ email, password });
    const t = data.data.token;
    localStorage.setItem('token', t);
    setToken(t);
    setUser(data.data.user);
    toast.success('Logged in successfully!');
    return data.data;
  };

  const register = async (formData) => {
    const { data } = await registerAPI(formData);
    const t = data.data.token;
    localStorage.setItem('token', t);
    setToken(t);
    setUser(data.data.user);
    toast.success('Account created successfully!');
    return data.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = async (formData) => {
    const { data } = await updateProfile(formData);
    setUser(data.data);
    toast.success('Profile updated successfully!');
    return data.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
