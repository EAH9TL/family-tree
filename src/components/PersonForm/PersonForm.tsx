import React from 'react';
import { useForm } from 'react-hook-form';
import { useFamilyStore } from '../../store/familyStore';
import type { Person } from '../../types';

interface PersonFormProps {
  initialData?: Person | null;
  onClose: () => void;
}

const PersonForm: React.FC<PersonFormProps> = ({ initialData, onClose }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: initialData || {},
  });
  const { addPerson, updatePerson, persons } = useFamilyStore();

  const onSubmit = async (data: any) => {
    try {
      if (initialData) {
        await updatePerson(initialData.id, data);
      } else {
        await addPerson(data);
      }
      onClose();
    } catch (error) {
      alert('Error al guardar');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-4 bottom-4 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full md:max-w-2xl h-full md:h-auto md:max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 md:p-6 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {initialData ? 'Editar Familiar' : 'Nuevo Familiar'}
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="space-y-4 md:space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  {...register('firstName', { required: true })}
                  className="w-full px-4 py-3 md:py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Juan"
                />
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  {...register('lastName', { required: true })}
                  className="w-full px-4 py-3 md:py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Pérez"
                />
              </div>

              {/* Género */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Género *
                </label>
                <select
                  {...register('gender', { required: true })}
                  className="w-full px-4 py-3 md:py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    {...register('birthDate')}
                    className="w-full px-4 py-3 md:py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Fallecimiento
                  </label>
                  <input
                    type="date"
                    {...register('deathDate')}
                    className="w-full px-4 py-3 md:py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Padres */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Padre
                  </label>
                  <select
                    {...register('fatherId')}
                    className="w-full px-4 py-3 md:py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sin padre registrado</option>
                    {persons
                      .filter(p => p.gender === 'male' && p.id !== initialData?.id)
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Madre
                  </label>
                  <select
                    {...register('motherId')}
                    className="w-full px-4 py-3 md:py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sin madre registrada</option>
                    {persons
                      .filter(p => p.gender === 'female' && p.id !== initialData?.id)
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-4 py-3 md:py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Información adicional..."
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t bg-gray-50 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 md:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="flex-1 px-4 py-3 md:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base"
            >
              {initialData ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonForm;