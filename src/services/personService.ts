// src/services/personService.ts
import api from './api';
import { API_ENDPOINTS } from '../config/api';
import type { Person } from '../types';

export const personService = {
  getAll: async (): Promise<Person[]> => {
    const response = await api.get(API_ENDPOINTS.PERSONS.BASE);
    return response.data;
  },

  getById: async (id: string): Promise<Person> => {
    const response = await api.get(API_ENDPOINTS.PERSONS.BY_ID(id));
    return response.data;
  },

  create: async (data: Partial<Person>): Promise<Person> => {
    const response = await api.post(API_ENDPOINTS.PERSONS.BASE, data);
    return response.data;
  },

  update: async (id: string, data: Partial<Person>): Promise<Person> => {
    const response = await api.put(API_ENDPOINTS.PERSONS.BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.PERSONS.BY_ID(id));
  },
};