import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Heart, 
  Clock, 
  Zap, 
  Brain,
  Moon,
  Sun,
  Coffee
} from 'lucide-react';

const CargaMentalTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyData, setDailyData] = useState({
    logisticaFamiliar: 5,
    cargaEmocional: 5,
    autoexigencia: 5,
    agotamientoFisico: 5,
    notas: ''
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // Simulando datos históricos
  const historicalData = {
    '2024-01-15': { logisticaFamiliar: 8, cargaEmocional: 7, autoexigencia: 9, agotamientoFisico: 8, notas: 'Día muy difícil con las citas médicas de los niños' },
    '2024-01-14': { logisticaFamiliar: 6, cargaEmocional: 5, autoexigencia: 7, agotamientoFisico: 6, notas: 'Mejor día, pude descansar un poco' },
    '2024-01-13': { logisticaFamiliar: 7, cargaEmocional: 8, autoexigencia: 8, agotamientoFisico: 7, notas: 'Preocupada por el rendimiento escolar' }
  };

  const categories = [
    {
      id: 'logisticaFamiliar',
      name: 'Logística Familiar',
      icon: Calendar,
      description: 'Citas médicas, actividades, planificación...',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'cargaEmocional',
      name: 'Carga Emocional',
      icon: Heart,
      description: 'Preocupaciones por los hijos, culpa maternal...',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200'
    },
    {
      id: 'autoexigencia',
      name: 'Autoexigencia',
      icon: Zap,
      description: 'Presión de ser "madre perfecta"...',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'agotamientoFisico',
      name: 'Agotamiento Físico',
      icon: Moon,
      description: 'Cansancio, falta de sueño, energía baja...',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    }
  ];

  const getOverallScore = () => {
    const values = Object.values(dailyData).filter(v => typeof v === 'number');
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  };

  const getScoreColor = (score) => {
    if (score <= 3) return 'text-green-600';
    if (score <= 6) return 'text-yellow-600';
    if (score <= 8) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score <= 3) return { message: '¡Excelente! Te sientes equilibrada', icon: Sun, color: 'text-green-600' };
    if (score <= 6) return { message: 'Carga moderada, cuídate un poco más', icon: Coffee, color: 'text-yellow-600' };
    if (score <= 8) return { message: 'Carga alta, necesitas apoyo urgente', icon: AlertTriangle, color: 'text-orange-600' };
    return { message: 'Sobrecarga crítica, busca ayuda inmediata', icon: AlertTriangle, color: 'text-red-600' };
  };

  const updateCategory = (categoryId, value) => {
    setDailyData(prev => ({ ...prev, [categoryId]: value }));
  };

  const saveDailyData = () => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    console.log('Guardando datos del día:', dateKey, dailyData);
    
    const overallScore = getOverallScore();
    if (overallScore >= 8) {
      setShowAlert(true);
    }
    
    alert('Datos guardados. ¡Recuerda que reconocer tus límites es fortaleza, no debilidad!');
  };

  const overallScore = getOverallScore();
  const scoreInfo = getScoreMessage(overallScore);
  const ScoreIcon = scoreInfo.icon;

  // Efecto para manejar el viewport dinámico
  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
    
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        :root {
          --safe-area-inset-top: env(safe-area-inset-top, 0px);
          --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
        }
        
        .main-container {
          min-height: 100vh;
          min-height: calc(var(--vh, 1vh) * 100);
          background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%);
          position: relative;
          overflow-x: hidden;
          isolation: isolate;
        }
        
        .content-wrapper {
          position: relative;
          z-index: 1;
          background: transparent;
          padding-top: env(safe-area-inset-top, 0px);
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #f43f5e, #fb923c);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #f43f5e, #fb923c);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        /* Fix para evitar el fondo verde cuando se oculta la barra de navegación */
        @supports (-webkit-touch-callout: none) {
          .main-container {
            min-height: -webkit-fill-available;
          }
        }
        
        /* Asegurar que el fondo siempre cubra toda la pantalla */
        html, body {
          height: 100%;
          overflow-x: hidden;
        }
        
        #root {
          min-height: 100%;
          isolation: isolate;
        }
      `}</style>
      
      <div className="main-container">
        <div className="content-wrapper p-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-rose-100 to-orange-100 rounded-full mb-4">
                <Brain className="w-8 h-8 text-rose-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Mi Carga Mental
              </h1>
              <p className="text-gray-600">
                Registra cómo te sientes hoy. No hay respuestas correctas, solo tu verdad.
              </p>
            </div>

            {/* Fecha selector */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedDate.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h2>
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Score general */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${scoreInfo.color === 'text-green-600' ? 'bg-green-100' : scoreInfo.color === 'text-yellow-600' ? 'bg-yellow-100' : scoreInfo.color === 'text-orange-600' ? 'bg-orange-100' : 'bg-red-100'}`}>
                  <ScoreIcon className={`w-10 h-10 ${scoreInfo.color}`} />
                </div>
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
                  {overallScore}/10
                </div>
                <p className={`text-lg font-medium ${scoreInfo.color}`}>
                  {scoreInfo.message}
                </p>
              </div>
            </div>

            {/* Categorías de carga mental */}
            <div className="grid gap-6 mb-6">
              {categories.map(category => {
                const CategoryIcon = category.icon;
                const currentValue = dailyData[category.id];
                
                return (
                  <div key={category.id} className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${category.borderColor}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-full ${category.bgColor}`}>
                          <CategoryIcon className={`w-6 h-6 ${category.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(currentValue)}`}>
                        {currentValue}/10
                      </div>
                    </div>
                    
                    {/* Slider */}
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={currentValue}
                        onChange={(e) => updateCategory(category.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Muy baja</span>
                        <span>Moderada</span>
                        <span>Muy alta</span>
                      </div>
                    </div>

                    {/* Consejos específicos según el nivel */}
                    {currentValue >= 8 && (
                      <div className={`mt-4 p-4 rounded-lg ${category.bgColor} border ${category.borderColor}`}>
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className={`w-5 h-5 ${category.color} mt-0.5`} />
                          <div>
                            <p className="text-sm font-medium text-gray-800 mb-1">
                              Nivel alto detectado
                            </p>
                            <p className="text-sm text-gray-600">
                              {category.id === 'logisticaFamiliar' && 'Considera delegar tareas o pedir ayuda con la organización familiar.'}
                              {category.id === 'cargaEmocional' && 'Es momento de hablar con alguien. La preocupación excesiva no te hace mejor madre.'}
                              {category.id === 'autoexigencia' && 'Recuerda: una madre suficientemente buena es mejor que una perfecta inexistente.'}
                              {category.id === 'agotamientoFisico' && 'Tu cuerpo necesita descanso. Busca momentos para recuperarte, aunque sean cortos.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Notas del día */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ¿Qué ha influido en tu carga mental hoy?
              </h3>
              <textarea
                value={dailyData.notas}
                onChange={(e) => setDailyData(prev => ({ ...prev, notas: e.target.value }))}
                placeholder="Escribe aquí sin filtros... Nadie te juzgará por sentirte agotada, preocupada o saturada. Es normal y humano."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Botón guardar */}
            <div className="text-center mb-8">
              <button
                onClick={saveDailyData}
                className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
              >
                Registrar mi día
              </button>
            </div>

            {/* Gráfico semanal simplificado */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-rose-600" />
                <h3 className="text-lg font-semibold text-gray-800">Tendencia de la semana</h3>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => {
                  const mockScore = Math.floor(Math.random() * 10) + 1;
                  return (
                    <div key={day} className="text-center">
                      <div className="text-xs text-gray-500 mb-2">{day}</div>
                      <div 
                        className={`h-16 rounded-lg flex items-end justify-center text-white text-xs font-semibold ${
                          mockScore <= 3 ? 'bg-green-400' :
                          mockScore <= 6 ? 'bg-yellow-400' :
                          mockScore <= 8 ? 'bg-orange-400' : 'bg-red-400'
                        }`}
                      >
                        <div 
                          className="w-full rounded-lg flex items-end justify-center pb-1"
                          style={{ height: `${(mockScore / 10) * 100}%` }}
                        >
                          {mockScore}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Tu carga mental fluctúa - es completamente normal. 
                Lo importante es que estás tomando conciencia de ella.</p>
              </div>
            </div>

            {/* Alert de sobrecarga */}
            {showAlert && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-6 max-w-md mx-auto">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Sobrecarga detectada
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Tu carga mental está en niveles críticos. No estás sola en esto, 
                      y reconocerlo es el primer paso para cuidarte mejor.
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <button className="w-full bg-rose-100 text-rose-700 py-3 rounded-lg hover:bg-rose-200 transition-all">
                      Hablar con Mia ahora
                    </button>
                    <button className="w-full bg-purple-100 text-purple-700 py-3 rounded-lg hover:bg-purple-200 transition-all">
                      Ver técnicas de alivio inmediato
                    </button>
                    <button className="w-full bg-blue-100 text-blue-700 py-3 rounded-lg hover:bg-blue-200 transition-all">
                      Contactar mi red de apoyo
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowAlert(false)}
                    className="w-full text-gray-500 py-2 hover:text-gray-700 transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CargaMentalTracker;