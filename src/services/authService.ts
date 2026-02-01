import api from './api';
import type { LoginCredentials, RegisterData, User } from '../types';

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (data: RegisterData): Promise<User> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const logout = () => {
  // Limpiar cualquier dato local si es necesario
  localStorage.removeItem('auth-storage');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data;
};