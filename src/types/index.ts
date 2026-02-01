// src/types/index.ts
export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  deathDate?: string;
  gender: 'male' | 'female' | 'other';
  notes?: string;
  fatherId?: string;
  motherId?: string;
  medicalConditions: MedicalCondition[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicalCondition {
  id: string;
  personId: string;
  name: string;
  diagnosisDate?: string;
  severity: 'low' | 'medium' | 'high';
  isHereditary: boolean;
  notes?: string;
  status: 'active' | 'resolved' | 'chronic';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}