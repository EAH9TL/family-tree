// src/store/familyStore.ts
import { create } from 'zustand';
import type { Person, MedicalCondition } from '../types';
import { personService } from '../services/personService';
import { medicalService } from '../services/medicalService';

interface FamilyState {
  persons: Person[];
  selectedPerson: Person | null;
  isLoading: boolean;
  error: string | null;
  
  fetchPersons: () => Promise<void>;
  addPerson: (person: Partial<Person>) => Promise<void>;
  updatePerson: (id: string, person: Partial<Person>) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  selectPerson: (person: Person | null) => void;
  
  addMedicalCondition: (condition: Partial<MedicalCondition>) => Promise<void>;
  updateMedicalCondition: (id: string, condition: Partial<MedicalCondition>) => Promise<void>;
  deleteMedicalCondition: (id: string) => Promise<void>;
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  persons: [],
  selectedPerson: null,
  isLoading: false,
  error: null,

  fetchPersons: async () => {
    set({ isLoading: true, error: null });
    try {
      const persons = await personService.getAll();
      set({ persons, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addPerson: async (person) => {
    set({ isLoading: true, error: null });
    try {
      const newPerson = await personService.create(person);
      set((state) => ({
        persons: [...state.persons, newPerson],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updatePerson: async (id, person) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPerson = await personService.update(id, person);
      set((state) => ({
        persons: state.persons.map((p) => (p.id === id ? updatedPerson : p)),
        selectedPerson: state.selectedPerson?.id === id ? updatedPerson : state.selectedPerson,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deletePerson: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await personService.delete(id);
      set((state) => ({
        persons: state.persons.filter((p) => p.id !== id),
        selectedPerson: state.selectedPerson?.id === id ? null : state.selectedPerson,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  selectPerson: (person) => {
    set({ selectedPerson: person });
  },

  addMedicalCondition: async (condition) => {
    try {
      const newCondition = await medicalService.create(condition);
      set((state) => ({
        persons: state.persons.map((p) =>
          p.id === condition.personId
            ? { ...p, medicalConditions: [...p.medicalConditions, newCondition] }
            : p
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateMedicalCondition: async (id, condition) => {
    try {
      const updatedCondition = await medicalService.update(id, condition);
      set((state) => ({
        persons: state.persons.map((p) => ({
          ...p,
          medicalConditions: p.medicalConditions.map((mc) =>
            mc.id === id ? updatedCondition : mc
          ),
        })),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteMedicalCondition: async (id) => {
    try {
      await medicalService.delete(id);
      set((state) => ({
        persons: state.persons.map((p) => ({
          ...p,
          medicalConditions: p.medicalConditions.filter((mc) => mc.id !== id),
        })),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));