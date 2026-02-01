import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Register = () => {
  const { register, handleSubmit } = useForm();
  const registerUser = useAuthStore(state => state.register);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/');
    } catch (error) {
      alert('Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-blue-700 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl md:text-4xl">
            👨‍👩‍👧‍👦
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Crear Cuenta</h2>
          <p className="text-gray-500 text-sm mt-2">Comienza tu árbol genealógico</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Juan Pérez"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 md:py-3.5 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all shadow-lg text-base"
          >
            Registrarse
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-600 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-green-600 hover:underline font-semibold">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;