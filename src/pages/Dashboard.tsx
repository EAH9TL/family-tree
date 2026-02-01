import React, { useEffect, useState } from 'react';
import TreeView from '../components/FamilyTree/TreeView';
import PersonForm from '../components/PersonForm/PersonForm';
import MedicalSection from '../components/Medical/MedicalSection';
import { useFamilyStore } from '../store/familyStore';
import { useAuthStore } from '../store/authStore';

const Dashboard: React.FC = () => {
  const { fetchPersons, selectedPerson, selectPerson, deletePerson } = useFamilyStore();
  const { logout, user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState<any>(null);

  useEffect(() => {
    fetchPersons();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar de Detalles - Responsivo */}
      {selectedPerson && (
        <>
          {/* Overlay oscuro en móvil */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => selectPerson(null)}
          />
          
          {/* Panel de detalles */}
          <div className="fixed inset-x-0 bottom-0 md:relative md:inset-auto md:w-80 bg-white shadow-2xl z-50 flex flex-col border-r animate-slide-in max-h-[85vh] md:max-h-full rounded-t-3xl md:rounded-none">
            {/* Barra de arrastre en móvil */}
            <div className="md:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />
            
            <div className="p-4 md:p-6 overflow-y-auto flex-1">
              <button 
                onClick={() => selectPerson(null)} 
                className="text-gray-400 hover:text-gray-600 mb-4 text-base"
              >
                ← Cerrar
              </button>
              
              <div className="text-center mb-6">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto flex items-center justify-center text-white text-2xl md:text-3xl font-bold mb-4 ${
                  selectedPerson.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                }`}>
                  {selectedPerson.firstName[0]}{selectedPerson.lastName[0]}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {selectedPerson.firstName} {selectedPerson.lastName}
                </h2>
                <p className="text-gray-500 text-sm">
                  {selectedPerson.gender === 'male' ? 'Hombre' : 'Mujer'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase font-bold">Notas</p>
                  <p className="text-sm text-gray-700">
                    {selectedPerson.notes || 'Sin notas adicionales.'}
                  </p>
                </div>
                
                <MedicalSection person={selectedPerson} />
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex gap-2">
              <button 
                onClick={() => { 
                  setEditingPerson(selectedPerson); 
                  setShowForm(true); 
                }}
                className="flex-1 bg-blue-600 text-white py-3 md:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Editar
              </button>
              <button 
                onClick={() => { 
                  if(window.confirm('¿Eliminar familiar?')) {
                    deletePerson(selectedPerson.id);
                    selectPerson(null);
                  }
                }}
                className="px-4 md:px-3 py-3 md:py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-lg md:text-base"
              >
                🗑️
              </button>
            </div>
          </div>
        </>
      )}

      {/* Área Principal */}
      <div className="flex-1 flex flex-col relative">
        <header className="bg-white border-b px-4 md:px-6 py-3 md:py-4 flex justify-between items-center z-10">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Mi Árbol Genealógico</h1>
            <p className="text-xs text-gray-500 hidden md:block">Bienvenido, {user?.name}</p>
          </div>
          <div className="flex gap-2 md:gap-3">
            <button 
              onClick={() => { setEditingPerson(null); setShowForm(true); }}
              className="bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-xs md:text-sm font-medium"
            >
              <span className="hidden md:inline">+ Nuevo Familiar</span>
              <span className="md:hidden">+ Nuevo</span>
            </button>
            <button 
              onClick={logout} 
              className="text-gray-400 hover:text-red-500 p-2 text-sm md:text-base"
            >
              Salir
            </button>
          </div>
        </header>

        <main className="flex-1 relative">
          <TreeView />
        </main>
      </div>

      {showForm && (
        <PersonForm 
          initialData={editingPerson} 
          onClose={() => { setShowForm(false); setEditingPerson(null); }} 
        />
      )}
    </div>
  );
};

export default Dashboard;