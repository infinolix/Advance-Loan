import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUserProfile: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth state on component mount
    const savedUser = localStorage.getItem('myAdvance_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // In a real app, this would be an API call
      // Simulating network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = mockUsers.find(u => u.email === email);
      
      // For demo purposes, any password works for mock users
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('myAdvance_user', JSON.stringify(foundUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === userData.email)) {
        return false;
      }
      
      // In a real app, this would create a new user in the database
      const newUser = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: userData.name || '',
        email: userData.email || '',
        role: 'employee',
        department: userData.department,
        position: userData.position,
        salary: userData.salary,
        joinDate: new Date().toISOString(),
        ...userData
      };
      
      // Add to mock users (this would be persisted in a real app)
      mockUsers.push(newUser);
      
      // Auto-login the new user
      setUser(newUser);
      localStorage.setItem('myAdvance_user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('myAdvance_user');
  };

  const updateUserProfile = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) return false;
      
      // Update user data
      const updatedUser = { ...user, ...userData };
      
      // Update in mock data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex >= 0) {
        mockUsers[userIndex] = updatedUser;
      }
      
      // Update local state
      setUser(updatedUser);
      localStorage.setItem('myAdvance_user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};