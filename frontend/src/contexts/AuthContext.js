import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('gameUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Check for admin credentials
    if (email === 'Olti1992@gmail.com' && password === 'OltiL1752s!') {
      const adminUser = {
        id: 'admin-001',
        email: email,
        username: 'AdminOlti',
        level: 99,
        experience: 999999,
        coins: 999999,
        gems: 999,
        isAdmin: true,
        adminRole: 'Super Admin'
      };
      setUser(adminUser);
      localStorage.setItem('gameUser', JSON.stringify(adminUser));
      return adminUser;
    }

    // Mock login for regular users
    const mockUser = {
      id: Date.now(),
      email: email,
      username: email.split('@')[0],
      level: 25,
      experience: 75640,
      coins: 12450,
      gems: 89,
      isAdmin: false
    };

    setUser(mockUser);
    localStorage.setItem('gameUser', JSON.stringify(mockUser));
    return mockUser;
  };

  const register = async (email, password, username) => {
    // Mock registration
    const mockUser = {
      id: Date.now(),
      email: email,
      username: username,
      level: 1,
      experience: 0,
      coins: 100,
      gems: 10,
      isAdmin: false
    };

    setUser(mockUser);
    localStorage.setItem('gameUser', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gameUser');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};