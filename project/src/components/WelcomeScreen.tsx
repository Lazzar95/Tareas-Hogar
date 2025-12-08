import React, { useState } from 'react';
import { Heart, Shield, Users, Brain } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const WelcomeScreen: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />;
  }

  if (showRegister) {
    return <RegisterForm onBack={() => setShowRegister(false)} onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-playfair">
            <span className="text-blue-600">Mente Serena</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            <strong>Descarga tu mente, reconecta contigo y con tus hijos</strong>
          </p>
          
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            El espacio seguro que necesitas para liberarte de la carga mental y encontrar tu equilibrio como madre.
          </p>
          
          {/* Pain Points Validation */}
          <div className="bg-red-50 border-l-4 border-red-300 p-6 rounded-r-lg max-w-2xl mx-auto mb-12">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-red-800 mb-3">¿Te sientes identificada?</h3>
              <ul className="text-red-700 space-y-2 text-sm">
                <li>✓ Llevas la agenda mental de toda la familia</li>
                <li>✓ Te culpas por no ser la madre "perfecta"</li>
                <li>✓ Sientes que tu pareja no comprende tu carga</li>
                <li>✓ La ansiedad te acompaña a diario</li>
                <li>✓ No tienes tiempo para ti misma</li>
              </ul>
              <p className="text-red-800 font-medium mt-4 text-sm">
                <strong>No eres mala madre. Estás saturada.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-blue-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No estás sola</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">7 de cada 10</div>
              <p className="text-gray-600">madres se sienten agotadas a diario</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">44%</div>
              <p className="text-gray-600">considera imposible la conciliación</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Desahogo 24/7</h3>
            <p className="text-gray-600 text-sm">Chat inmediato cuando necesites liberarte</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-green-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Antídoto a la Culpa</h3>
            <p className="text-gray-600 text-sm">Aprende autocompasión y el arte de ser "suficientemente buena"</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Corresponsabilidad</h3>
            <p className="text-gray-600 text-sm">Herramientas para redistribuir tareas familiares</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-orange-100">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Indicador Personal</h3>
            <p className="text-gray-600 text-sm">Monitorea tu carga mental con alertas personalizadas</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 rounded-2xl text-white mb-6">
            <h2 className="text-2xl font-bold mb-4">Empieza tu camino hacia la serenidad</h2>
            <p className="text-blue-100 mb-6">
              Únete a miles de madres que ya encontraron su espacio seguro
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowRegister(true)}
                className="w-full bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg"
              >
                Crear mi cuenta gratuita
              </button>
              
              <button
                onClick={() => setShowLogin(true)}
                className="w-full bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors duration-300"
              >
                Ya tengo cuenta
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            100% gratuito • Sin compromiso • Datos seguros
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;