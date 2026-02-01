// src/components/Medical/MedicalSection.tsx
import React, { useState } from 'react';
import { useFamilyStore } from '../../store/familyStore';
import type { MedicalCondition, Person } from '../../types';
import { getSeverityColor } from '../../utils/treeLayout';

interface MedicalSectionProps {
  person: Person;
}

const MedicalSection: React.FC<MedicalSectionProps> = ({ person }) => {
  const { addMedicalCondition, deleteMedicalCondition } = useFamilyStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newCondition, setNewCondition] = useState({
    name: '',
    severity: 'medium' as const,
    isHereditary: false,
    status: 'active' as const
  });

  const handleAdd = async () => {
    if (!newCondition.name) return;
    await addMedicalCondition({ ...newCondition, personId: person.id });
    setNewCondition({ name: '', severity: 'medium', isHereditary: false, status: 'active' });
    setIsAdding(false);
  };

  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Historial Médico</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
        >
          + Añadir Enfermedad
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3 border border-red-100">
          <input 
            placeholder="Nombre de la enfermedad"
            className="w-full p-2 border rounded"
            value={newCondition.name}
            onChange={e => setNewCondition({...newCondition, name: e.target.value})}
          />
          <div className="flex gap-4">
            <select 
              className="flex-1 p-2 border rounded"
              value={newCondition.severity}
              onChange={e => setNewCondition({...newCondition, severity: e.target.value as any})}
            >
              <option value="low">Gravedad: Baja</option>
              <option value="medium">Gravedad: Media</option>
              <option value="high">Gravedad: Alta</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                checked={newCondition.isHereditary}
                onChange={e => setNewCondition({...newCondition, isHereditary: e.target.checked})}
              />
              ¿Es hereditaria?
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="text-xs text-gray-500">Cancelar</button>
            <button onClick={handleAdd} className="bg-red-500 text-white px-3 py-1 rounded text-xs">Guardar</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {person.medicalConditions?.map((condition) => (
          <div key={condition.id} className="flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{condition.name}</span>
                {condition.isHereditary && (
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">🧬 HEREDITARIA</span>
                )}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${getSeverityColor(condition.severity)}`}>
                {condition.severity}
              </span>
            </div>
            <button 
              onClick={() => deleteMedicalCondition(condition.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              🗑️
            </button>
          </div>
        ))}
        {(!person.medicalConditions || person.medicalConditions.length === 0) && (
          <p className="text-sm text-gray-400 italic text-center py-4">No hay registros médicos.</p>
        )}
      </div>
    </div>
  );
};

export default MedicalSection;