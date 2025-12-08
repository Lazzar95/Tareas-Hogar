import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu espacio personal</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre</label>
                <p className="text-gray-800">{user?.name || 'No disponible'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-800">{user?.email || 'No disponible'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
            <div className="flex items-center mb-4">
              <Settings className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Configuración</h3>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-4">
              Editar preferencias
            </button>
            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;