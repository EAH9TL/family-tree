// src/config/api.ts
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  PERSONS: {
    BASE: '/persons',
    BY_ID: (id: string) => `/persons/${id}`,
  },
  MEDICAL: {
    BASE: '/medical',
    BY_ID: (id: string) => `/medical/${id}`,
    BY_PERSON: (personId: string) => `/medical/person/${personId}`,
  },
};