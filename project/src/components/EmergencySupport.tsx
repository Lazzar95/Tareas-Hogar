import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  Heart, 
  Shield, 
  Clock,
  Volume2,
  Play,
  Pause,
  Star,
  X
} from 'lucide-react';

const EmergencySupportWidget = ({ triggerWords = [], userMessage = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('immediate');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingCount, setBreathingCount] = useState(4);
  const [groundingStep, setGroundingStep] = useState(0);
  const [userCountry, setUserCountry] = useState('ES'); // Por defecto España
  const breathingTimerRef = useRef(null);

  // Detectar país del usuario (simulado - en producción usarías geolocalización o IP)
  useEffect(() => {
    // Simulación de detección de país
    // En producción: usar API de geolocalización o servicio de IP
    const detectCountry = () => {
      // Por ahora priorizamos España
      const locale = navigator.language || navigator.userLanguage;
      if (locale.includes('es-ES')) return 'ES';
      if (locale.includes('es-MX')) return 'MX';
      if (locale.includes('es-AR')) return 'AR';
      if (locale.includes('es-CO')) return 'CO';
      if (locale.includes('es-CL')) return 'CL';
      if (locale.includes('es-PE')) return 'PE';
      return 'ES'; // Por defecto España
    };
    
    setUserCountry(detectCountry());
  }, []);

  // Palabras críticas que activan el widget automáticamente
  const criticalTriggers = [
    'no puedo más', 'quiero desaparecer', 'mala madre', 'no sirvo',
    'mejor sin mí', 'no lo merezco', 'colapso', 'todo mal',
    'fracaso total', 'quiero morir', 'no vale la pena',
    'estoy perdida', 'no aguanto', 'me rindo'
  ];

  // Recursos de crisis por país - NÚMEROS REALES Y VERIFICADOS
  const crisisResourcesByCountry = {
    ES: [ // España
      {
        name: 'Teléfono de la Esperanza',
        phone: '717 003 717',
        description: 'Atención 24h gratuita para crisis emocionales y prevención del suicidio',
        type: 'phone',
        availability: '24/7',
        specialized: true
      },
      {
        name: 'Teléfono contra el Suicidio',
        phone: '024',
        description: 'Línea oficial del Ministerio de Sanidad para prevención del suicidio',
        type: 'phone',
        availability: '24/7',
        specialized: true
      },
      {
        name: 'Fundación ANAR - Ayuda a Madres',
        phone: '600 50 51 52',
        description: 'Apoyo psicológico para madres y familias en crisis',
        type: 'phone',
        availability: '24/7',
        specialized: true
      },
      {
        name: '112 - Emergencias',
        phone: '112',
        description: 'Para situaciones de riesgo inmediato para la vida',
        type: 'emergency',
        availability: '24/7',
        specialized: false
      }
    ],
    MX: [ // México
      {
        name: 'Línea de la Vida',
        phone: '800 911 2000',
        description: 'Prevención del suicidio y crisis emocionales',
        type: 'phone',
        availability: '24/7',
        specialized: true
      },
      {
        name: 'SAPTEL - Crisis Emocional',
        phone: '55 5259 8121',
        description: 'Sistema Nacional de Apoyo Psicológico',
        type: 'phone',
        availability: '24/7',
        specialized: true
      },
      {
        name: '911 - Emergencias',
        phone: '911',
        description: 'Para situaciones de riesgo inmediato',
        type: 'emergency',
        availability: '24/7',
        specialized: false
      }
    ],
    AR: [ // Argentina
      {
        name: 'Centro de Atención al Suicida',
        phone: '135',
        description: 'Línea gratuita desde Buenos Aires',
        type: 'phone',
        availability: '24/7',
        specialized: true
      },
      {
        name: 'SOS Un Amigo Anónimo',
        phone: '(011) 4783 8888',
        description: 'Apoyo emocional y prevención',
        type: 'phone',
        availability: 'Diario 10-24h',
        specialized: true
      },
      {
        name: '911 - Emergencias',
        phone: '911',
        description: 'Para situaciones de riesgo inmediato',
        type: 'emergency',
        availability: '24/7',
        specialized: false
      }
    ],
    CO: [ // Colombia
      {
        name: 'Línea de la Vida',
        phone: '106',
        description: 'Apoyo en crisis y prevención del suicidio',
        type: 'phone',
        availability: '24/7',
        specialized: true
      },
      {
        name: 'Línea Calma',
        phone: '01 8000 423 614',
        description: 'Apoyo en salud mental',
        type: 'phone',
        availability: '24/7',
        specialized: true
      },
      {
        name: '123 - Emergencias',
        phone: '123',
        description: 'Para situaciones de riesgo inmediato',
        type: 'emergency',
        availability: '24/7',
        specialized: false
      }
    ],
    CL: [ // Chile
      {
        name: 'Salud Responde',
        phone: '600 360 7777',
        description: 'Apoyo psicológico y orientación en salud mental',
        type: 'phone',
        availability: '24/7',
        specialized: true
      },
      {
        name: 'Fono Prevención Suicidio',
        phone: '4141',
        description: 'Línea directa para crisis y prevención',
        type: 'phone',
        availability: '24/7',
        specialized: true
      },
      {
        name: '131 - Emergencias',
        phone: '131',
        description: 'Ambulancia para emergencias médicas',
        type: 'emergency',
        availability: '24/7',
        specialized: false
      }
    ],
    PE: [ // Perú
      {
        name: 'Línea 113 Salud',
        phone: '113',
        description: 'Orientación en salud mental y crisis',
        type: 'phone',
        availability: '24/7',
        specialized: true
      },
      {
        name: 'Centro de Salud Mental',
        phone: '0800 41212',
        description: 'Apoyo psicológico gratuito',
        type: 'phone',
        availability: 'Lun-Sab 8-20h',
        specialized: true
      },
      {
        name: '105 - Emergencias',
        phone: '105',
        description: 'Para situaciones de riesgo inmediato',
        type: 'emergency',
        availability: '24/7',
        specialized: false
      }
    ]
  };

  // Obtener recursos del país actual
  const crisisResources = crisisResourcesByCountry[userCountry] || crisisResourcesByCountry['ES'];

  // Detectar palabras críticas en el mensaje del usuario
  useEffect(() => {
    if (userMessage) {
      const lowerMessage = userMessage.toLowerCase();
      const hasCriticalWords = criticalTriggers.some(trigger => 
        lowerMessage.includes(trigger)
      );
      
      if (hasCriticalWords) {
        setIsVisible(true);
        setActiveSection('crisis');
        console.log('🚨 Crisis detected:', userMessage);
      }
    }
  }, [userMessage]);

  // Técnica de respiración 4-7-8
  useEffect(() => {
    if (isBreathingActive) {
      const durations = {
        inhale: 4000,
        hold: 7000,
        exhale: 8000
      };
      
      breathingTimerRef.current = setTimeout(() => {
        if (breathingPhase === 'inhale') {
          setBreathingPhase('hold');
          setBreathingCount(7);
        } else if (breathingPhase === 'hold') {
          setBreathingPhase('exhale');
          setBreathingCount(8);
        } else {
          setBreathingPhase('inhale');
          setBreathingCount(4);
        }
      }, durations[breathingPhase]);
    }
    
    return () => {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
      }
    };
  }, [isBreathingActive, breathingPhase]);

  // Técnica de grounding 5-4-3-2-1
  const groundingSteps = [
    {
      step: 1,
      sense: 'Vista',
      instruction: 'Nombra 5 cosas que puedes VER a tu alrededor',
      examples: ['La pared', 'Una silla', 'Tus manos', 'Una ventana', 'Un objeto cercano'],
      color: 'blue'
    },
    {
      step: 2,
      sense: 'Tacto',
      instruction: 'Identifica 4 cosas que puedes TOCAR',
      examples: ['La superficie donde estás', 'Tu ropa', 'El aire en tu piel', 'Un objeto cercano'],
      color: 'green'
    },
    {
      step: 3,
      sense: 'Oído',
      instruction: 'Escucha 3 sonidos diferentes',
      examples: ['Ruido de fondo', 'Tu respiración', 'Sonidos lejanos'],
      color: 'yellow'
    },
    {
      step: 4,
      sense: 'Olfato',
      instruction: 'Identifica 2 olores',
      examples: ['El aire del lugar', 'Algún aroma cercano'],
      color: 'purple'
    },
    {
      step: 5,
      sense: 'Gusto',
      instruction: 'Nota 1 sabor en tu boca',
      examples: ['El sabor actual de tu boca'],
      color: 'rose'
    }
  ];

  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathingPhase('inhale');
    setBreathingCount(4);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current);
    }
  };

  const nextGroundingStep = () => {
    if (groundingStep < groundingSteps.length - 1) {
      setGroundingStep(groundingStep + 1);
    } else {
      setGroundingStep(0);
      alert('🌟 Excelente trabajo. Has completado la técnica de grounding. ¿Te sientes un poco más presente?');
    }
  };

  // Función para obtener el nombre del país
  const getCountryName = (code) => {
    const countries = {
      ES: 'España',
      MX: 'México',
      AR: 'Argentina',
      CO: 'Colombia',
      CL: 'Chile',
      PE: 'Perú'
    };
    return countries[code] || 'España';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-6 w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl hover:shadow-red-500/25 transition-all z-[100] flex items-center justify-center group animate-pulse"
      >
        <Shield className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 rounded-full animate-ping" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header de crisis */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Apoyo Inmediato Disponible</h2>
                <p className="text-red-100">No estás sola. Hay ayuda disponible ahora mismo.</p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs - Solo 2 ahora */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveSection('immediate')}
            className={`flex-1 py-4 px-4 text-sm font-medium transition-all ${
              activeSection === 'immediate'
                ? 'bg-white text-red-700 border-b-2 border-red-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
          >
            <Heart className="w-4 h-4 mx-auto mb-1" />
            Técnicas Inmediatas
          </button>
          <button
            onClick={() => setActiveSection('crisis')}
            className={`flex-1 py-4 px-4 text-sm font-medium transition-all ${
              activeSection === 'crisis'
                ? 'bg-white text-red-700 border-b-2 border-red-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
          >
            <Phone className="w-4 h-4 mx-auto mb-1" />
            Líneas de Crisis
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          
          {/* Técnicas Inmediatas */}
          {activeSection === 'immediate' && (
            <div className="p-6 space-y-6">
              
              {/* Mensaje de validación inmediata */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-6 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-blue-600 mt-1 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-blue-800 mb-2 text-lg">
                      Respira. Estás a salvo en este momento.
                    </h3>
                    <p className="text-blue-700">
                      Lo que sientes es temporal. Pasará. Estas técnicas te ayudarán a sentirte más centrada 
                      hasta que puedas hablar con alguien de confianza.
                    </p>
                  </div>
                </div>
              </div>

              {/* Técnica de respiración 4-7-8 */}
              <div className="bg-white border-2 border-green-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Volume2 className="w-6 h-6 mr-3 text-green-600" />
                  Respiración Calmante (4-7-8)
                </h3>
                
                <div className="text-center mb-6">
                  <div className="relative inline-flex items-center justify-center w-40 h-40 mb-6">
                    <div className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                      breathingPhase === 'inhale' ? 'border-blue-400 scale-110 shadow-blue-400/30' :
                      breathingPhase === 'hold' ? 'border-yellow-400 scale-100 shadow-yellow-400/30' :
                      'border-green-400 scale-90 shadow-green-400/30'
                    } shadow-lg`}></div>
                    <div className="text-center z-10">
                      <div className="text-3xl font-bold text-gray-800 mb-1">{breathingCount}</div>
                      <div className="text-sm text-gray-600 capitalize font-medium">{breathingPhase === 'inhale' ? 'Inhala' : breathingPhase === 'hold' ? 'Mantén' : 'Exhala'}</div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6 font-medium">
                    {breathingPhase === 'inhale' && '🌬️ Inhala lentamente por la nariz'}
                    {breathingPhase === 'hold' && '⏸️ Mantén la respiración'}
                    {breathingPhase === 'exhale' && '💨 Exhala lentamente por la boca'}
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    {!isBreathingActive ? (
                      <button
                        onClick={startBreathing}
                        className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
                      >
                        <Play className="w-5 h-5" />
                        <span className="font-semibold">Comenzar</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopBreathing}
                        className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-red-500/25"
                      >
                        <Pause className="w-5 h-5" />
                        <span className="font-semibold">Detener</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Técnica de grounding 5-4-3-2-1 */}
              <div className="bg-white border-2 border-purple-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-purple-600" />
                  Técnica de Conexión con el Presente
                </h3>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      Paso {groundingStep + 1} de {groundingSteps.length}
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                      {Math.round(((groundingStep + 1) / groundingSteps.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div 
                      className={`bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-500 shadow-sm`}
                      style={{ width: `${((groundingStep + 1) / groundingSteps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className={`bg-gradient-to-r from-${groundingSteps[groundingStep].color}-50 to-${groundingSteps[groundingStep].color}-100/50 border-2 border-${groundingSteps[groundingStep].color}-200 rounded-xl p-6 mb-6`}>
                  <h4 className={`font-bold text-${groundingSteps[groundingStep].color}-800 mb-3 text-lg`}>
                    {groundingSteps[groundingStep].sense}: {groundingSteps[groundingStep].instruction}
                  </h4>
                  <div className="text-sm text-gray-700">
                    <p className="mb-3 font-medium">Ejemplos para guiarte:</p>
                    <ul className="space-y-2">
                      {groundingSteps[groundingStep].examples.map((example, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 bg-${groundingSteps[groundingStep].color}-400 rounded-full`} />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={nextGroundingStep}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-semibold shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02]"
                >
                  {groundingStep < groundingSteps.length - 1 ? 'Siguiente paso →' : '✨ Completar ejercicio'}
                </button>
              </div>

              {/* Mantras de emergencia */}
              <div className="bg-white border-2 border-rose-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Heart className="w-6 h-6 mr-3 text-rose-600" />
                  Mantras de Supervivencia
                </h3>
                
                <div className="space-y-4">
                  {[
                    'Este sentimiento es temporal. Pasará.',
                    'He superado momentos difíciles antes. Puedo con esto.',
                    'Mis hijos me necesitan viva y presente.',
                    'No tengo que ser perfecta, solo tengo que seguir.',
                    'Pedir ayuda es un acto de amor, no de debilidad.',
                    'Este momento no define quien soy como madre.'
                  ].map((mantra, index) => (
                    <div key={index} className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                      <p className="text-rose-800 italic font-medium text-center">"{mantra}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Líneas de Crisis */}
          {activeSection === 'crisis' && (
            <div className="p-6 space-y-6">
              
              {/* Indicador del país */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <p className="text-blue-800 text-sm font-medium text-center">
                  📍 Mostrando líneas de ayuda de {getCountryName(userCountry)}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 p-6 rounded-xl">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-8 h-8 text-red-600 mt-1 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-red-800 mb-2 text-lg">
                      Si sientes que puedes hacerte daño, llama AHORA
                    </h3>
                    <p className="text-red-700">
                      Estos profesionales están entrenados específicamente para crisis maternales. 
                      No te juzgarán, solo te ayudarán. Tu vida y bienestar importan.
                    </p>
                  </div>
                </div>
              </div>

              {crisisResources.map((resource, index) => (
                <div key={index} className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-4 rounded-full ${
                        resource.type === 'emergency' ? 'bg-red-100 ring-2 ring-red-200' :
                        resource.specialized ? 'bg-purple-100 ring-2 ring-purple-200' : 'bg-blue-100 ring-2 ring-blue-200'
                      }`}>
                        {resource.type === 'emergency' ? (
                          <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
                        ) : (
                          <Phone className={`w-6 h-6 ${
                            resource.specialized ? 'text-purple-600' : 'text-blue-600'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-bold text-gray-800 text-lg">{resource.name}</h4>
                          {resource.specialized && (
                            <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                              Especializado
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3 leading-relaxed">{resource.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{resource.availability}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span className="font-mono font-bold text-gray-700">{resource.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => window.location.href = `tel:${resource.phone}`}
                        className={`text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg transform hover:scale-105 ${
                          resource.type === 'emergency' ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-red-500/25' :
                          resource.specialized ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-purple-500/25' :
                          'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/25'
                        }`}
                      >
                        📞 Llamar Ahora
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mensaje de apoyo adicional */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-green-800 mb-2">
                      También puedes usar el chat de la app
                    </h4>
                    <p className="text-green-700">
                      Recuerda que Mia, tu asistente personal, está disponible 24/7 en el chat principal 
                      de la aplicación para escucharte y apoyarte en cualquier momento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con mensaje de esperanza */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t-2 border-gray-200">
          <div className="text-center">
            <p className="text-gray-700 italic font-medium leading-relaxed">
              💕 "Las tormentas emocionales pasan. Tú tienes la fuerza para atravesarlas. 
              No tienes que hacerlo sola. Eres más valiente de lo que crees y más fuerte de lo que sabes."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencySupportWidget;