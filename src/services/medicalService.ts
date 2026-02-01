// src/services/medicalService.ts
import api from './api';
import { API_ENDPOINTS } from '../config/api';
import type { MedicalCondition } from '../types';

export const medicalService = {
  getByPerson: async (personId: string): Promise<MedicalCondition[]> => {
    const response = await api.get(API_ENDPOINTS.MEDICAL.BY_PERSON(personId));
    return response.data;
  },

  create: async (data: Partial<MedicalCondition>): Promise<MedicalCondition> => {
    const response = await api.post(API_ENDPOINTS.MEDICAL.BASE, data);
    return response.data;
  },

  update: async (id: string, data: Partial<MedicalCondition>): Promise<MedicalCondition> => {
    const response = await api.put(API_ENDPOINTS.MEDICAL.BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.MEDICAL.BY_ID(id));
  },
};