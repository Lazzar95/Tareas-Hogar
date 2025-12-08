import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Frown, 
  Meh, 
  Smile, 
  Save, 
  X, 
  Lightbulb, 
  Award,
  AlertTriangle,
  Coffee,
  Moon,
  Sun,
  Clock,
  CheckCircle,
  Sparkles,
  Hug,
  Shield,
  BookOpen,
  TrendingUp,
  Eye,
  Users
} from 'lucide-react';

const EmotionalJournal: React.FC = () => {
  const [showDiaryForm, setShowDiaryForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [weeklyPatterns, setWeeklyPatterns] = useState([]);

  const handleSaveEntry = (entryData: any) => {
    setEntries(prev => [...prev, entryData]);
    setShowDiaryForm(false);
    
    // Analizar patrones semanales
    analyzeWeeklyPatterns([...entries, entryData]);
  };

  const analyzeWeeklyPatterns = (allEntries: any[]) => {
    // Lógica para detectar patrones semanales
    const patterns = [];
    
    if (allEntries.length >= 3) {
      const recentGuilt = allEntries.slice(-7).filter(e => 
        e.patterns?.some((p: any) => p.type === 'guilt_pattern')
      );
      
      if (recentGuilt.length >= 2) {
        patterns.push({
          type: 'recurring_guilt',
          message: 'He notado un patrón de culpa maternal esta semana',
          insight: 'La culpa recurrente puede ser una señal de estándares demasiado altos',
          suggestion: 'Considera hablar con una amiga de confianza sobre estos sentimientos'
        });
      }
    }
    
    setWeeklyPatterns(patterns);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header con mensaje empático */}
        <div className="text-center mb-8 pt-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-rose-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-rose-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Tu Santuario Emocional</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Este es tu espacio sagrado para liberar, sanar y descubrir tu fuerza interior. 
            Cada palabra que escribas aquí es un acto de amor hacia ti misma.
          </p>
        </div>

        {/* Mensaje motivacional rotativo */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-100/80 to-pink-100/80 rounded-2xl border border-purple-200 text-center">
          <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-purple-800 font-medium italic">
            "Tus emociones son válidas. Tu experiencia importa. Tu bienestar es una prioridad, no un lujo."
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          
          {/* Botón principal para nueva entrada */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-rose-100 shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">¿Qué hay en tu corazón hoy?</h3>
              <p className="text-gray-600">
                Dale voz a tus emociones. No hay sentimientos "incorrectos" aquí.
              </p>
            </div>
            
            <button
              onClick={() => setShowDiaryForm(true)}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-4 rounded-xl font-semibold hover:from-rose-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Comenzar mi reflexión de hoy</span>
              </div>
            </button>
          </div>

          {/* Patrones semanales detectados */}
          {weeklyPatterns.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-100 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Patrones que he observado</h3>
                  <p className="text-gray-600 text-sm">Insights basados en tus últimas reflexiones</p>
                </div>
              </div>
              
              {weeklyPatterns.map((pattern, index) => (
                <div key={index} className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-3">
                  <h4 className="font-semibold text-gray-800 mb-2">{pattern.message}</h4>
                  <p className="text-gray-600 text-sm mb-2">{pattern.insight}</p>
                  <p className="text-amber-700 text-sm font-medium">
                    💡 {pattern.suggestion}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Resumen de entradas recientes */}
          {entries.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Tu Viaje Emocional</h3>
                  <p className="text-gray-600 text-sm">
                    Has escrito {entries.length} {entries.length === 1 ? 'reflexión' : 'reflexiones'}. 
                    ¡Qué valiente eres por dedicarte este tiempo!
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-green-800">Días de reflexión</p>
                  <p className="text-2xl font-bold text-green-600">{entries.length}</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <Lightbulb className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-purple-800">Insights generados</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {entries.reduce((acc, entry) => acc + (entry.patterns?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recursos de apoyo */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-teal-600 mr-3" />
              <h3 className="text-lg font-bold text-gray-800">Recordatorio Amoroso</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p className="flex items-start space-x-2">
                <span className="text-teal-600">•</span>
                <span>Si te sientes abrumada, está bien pedir ayuda. Es signo de fortaleza, no debilidad.</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-teal-600">•</span>
                <span>Tus emociones son válidas, incluso las que consideras "negativas".</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-teal-600">•</span>
                <span>Cuidarte a ti misma no es egoísmo, es responsabilidad.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal del formulario de diario */}
        {showDiaryForm && (
          <MaternalDiaryForm 
            onClose={() => setShowDiaryForm(false)}
            onSave={handleSaveEntry}
          />
        )}
      </div>
    </div>
  );
};

// Componente del formulario de diario mejorado
const MaternalDiaryForm = ({ onClose, onSave }: any) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    emotion: '',
    title: '',
    content: '',
    motherMoments: [],
    challenges: [],
    gratitude: '',
    tomorrowPlan: '',
    energyLevel: 5,
    cargaMental: 5,
    triggerMoment: '',
    copingStrategies: [],
    selfCompassion: ''
  });
  const [detectedPatterns, setDetectedPatterns] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);

  const emotions = [
    { 
      id: 'Desbordada', 
      name: 'Desbordada', 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      message: 'Es normal sentirse así. Respira, estás haciendo más de lo que crees.'
    },
    { 
      id: 'Agotada', 
      name: 'Agotada', 
      icon: Moon, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      message: 'Tu cansancio es real y válido. Mereces descanso.'
    },
    { 
      id: 'Culpable', 
      name: 'Culpable', 
      icon: Frown, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50',
      message: 'La culpa maternal es común. Eres una buena madre, incluso en tus días difíciles.'
    },
    { 
      id: 'Neutral', 
      name: 'Equilibrada', 
      icon: Meh, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50',
      message: 'Los días tranquilos también son valiosos. Disfruta esta calma.'
    },
    { 
      id: 'Conectada', 
      name: 'Conectada', 
      icon: Heart, 
      color: 'text-pink-600', 
      bg: 'bg-pink-50',
      message: 'Qué hermoso sentir esta conexión contigo y tu familia.'
    },
    { 
      id: 'Orgullosa', 
      name: 'Orgullosa', 
      icon: Award, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      message: '¡Celebra estos momentos! Te los mereces todos.'
    }
  ];

  const diaryTemplates = [
    {
      id: 'guilt_release',
      title: 'Liberando la Culpa Maternal',
      subtitle: 'Un espacio seguro para soltar lo que te pesa en el corazón',
      icon: Heart,
      color: 'rose',
      prompts: {
        title: 'Hoy mi corazón de madre se siente pesado porque...',
        sections: [
          {
            label: '¿Qué situación despertó esta culpa en ti?',
            placeholder: 'Describe sin juzgarte lo que pasó. Imagina que le hablas a tu mejor amiga...',
            key: 'guilt_situation',
            empathy: 'Nombrar lo que duele es el primer paso para sanarlo.'
          },
          {
            label: 'Si tu hija creciera y viviera exactamente lo mismo, ¿qué le dirías?',
            placeholder: 'Con toda la compasión que tienes para ella, escríbelo aquí...',
            key: 'daughter_perspective',
            empathy: 'La compasión que das a otros también la mereces tú.'
          },
          {
            label: 'Tres maneras en que SÍ fuiste una buena madre hoy (por pequeñas que sean)',
            placeholder: 'Un abrazo, una comida preparada, un "te amo", una preocupación genuina...',
            key: 'good_mother_moments',
            empathy: 'Ser buena madre no significa ser perfecta.'
          }
        ]
      }
    },
    {
      id: 'overwhelm_release',
      title: 'Vaciando la Mente Saturada',
      subtitle: 'Cuando todo se siente demasiado y necesitas respirar',
      icon: AlertTriangle,
      color: 'amber',
      prompts: {
        title: 'Mi mente está llena de todo esto...',
        sections: [
          {
            label: 'Vacia aquí TODO lo que tienes en la cabeza ahora mismo',
            placeholder: 'Tareas, preocupaciones, recordatorios, miedos... todo vale aquí. No hay orden, solo descarga...',
            key: 'mental_dump',
            empathy: 'Tu mente necesita espacio para respirar. Esto es autocuidado.',
            large: true
          },
          {
            label: '¿Qué de todo eso REALMENTE necesita tu atención HOY?',
            placeholder: 'Separa lo urgente de lo que tu mente cree que es urgente...',
            key: 'today_priorities',
            empathy: 'No todo lo que grita fuerte es realmente importante.'
          },
          {
            label: '¿Qué podrías soltar, delegar o posponer sin que pase nada terrible?',
            placeholder: 'Sé honesta y compasiva contigo misma...',
            key: 'what_to_release',
            empathy: 'Soltar no es rendirse, es elegir sabiamente donde poner tu energía.'
          }
        ]
      }
    },
    {
      id: 'connection_celebration',
      title: 'Celebrando Mi Forma de Amar',
      subtitle: 'Reconociendo la madre extraordinaria que ya eres',
      icon: Award,
      color: 'green',
      prompts: {
        title: 'Hoy fui la madre que mis hijos necesitan cuando...',
        sections: [
          {
            label: 'Momentos de conexión real con tus hijos (por pequeños que sean)',
            placeholder: 'Una risa compartida, escuchar sus historias, un abrazo en el momento justo...',
            key: 'connection_moments',
            empathy: 'Los pequeños momentos construyen grandes recuerdos.'
          },
          {
            label: 'Decisiones que tomaste pensando en su bienestar (incluso las difíciles)',
            placeholder: 'Límites que pusiste, rutinas que mantuviste, comidas que preparaste...',
            key: 'wellbeing_decisions',
            empathy: 'Amor también significa decir "no" cuando es necesario.'
          },
          {
            label: 'Tu forma única de demostrar amor (que nadie más puede dar como tú)',
            placeholder: 'Tu manera de consolar, de enseñar, de jugar, de estar presente...',
            key: 'unique_love_language',
            empathy: 'Tu forma de amar es irreemplazable e invaluable.'
          }
        ]
      }
    },
    {
      id: 'exhaustion_validation',
      title: 'Honrando Mi Cansancio',
      subtitle: 'Validando tu agotamiento sin una pizca de culpa',
      icon: Moon,
      color: 'purple',
      prompts: {
        title: 'Mi cuerpo y alma están pidiendo descanso porque...',
        sections: [
          {
            label: '¿Qué te ha estado quitando energía últimamente?',
            placeholder: 'Noches sin dormir, carga mental, conflictos, decisiones constantes...',
            key: 'energy_drains',
            empathy: 'Reconocer lo que te agota es sabiduría, no queja.'
          },
          {
            label: '¿Cuándo fue la última vez que descansaste sin sentir culpa?',
            placeholder: 'Sin tiempo límite, sin pendientes en la mente, solo descanso real...',
            key: 'real_rest_memory',
            empathy: 'Mereces descansar sin tener que "ganártelo".'
          },
          {
            label: '¿Qué necesitarías para sentirte más descansada?',
            placeholder: 'Más ayuda, mejor sueño, tiempo sola, menos expectativas...',
            key: 'rest_needs',
            empathy: 'Tus necesidades de descanso no son caprichos, son supervivencia.'
          }
        ]
      }
    },
    {
      id: 'trigger_processing',
      title: 'Procesando el Momento Difícil',
      subtitle: 'Sanando con compasión lo que te activó emocionalmente',
      icon: Shield,
      color: 'blue',
      prompts: {
        title: 'Algo me activó emocionalmente hoy y necesito procesarlo...',
        sections: [
          {
            label: '¿Qué pasó exactamente? (Solo los hechos, sin juicio)',
            placeholder: 'Describe la situación como si fueras una observadora gentil...',
            key: 'trigger_facts',
            empathy: 'Separar hechos de interpretaciones es un superpoder emocional.'
          },
          {
            label: '¿Qué emociones aparecieron en tu cuerpo?',
            placeholder: 'Enojo en el pecho, tristeza en la garganta, miedo en el estómago...',
            key: 'body_emotions',
            empathy: 'Tu cuerpo siempre tiene información valiosa para ti.'
          },
          {
            label: '¿Qué le dirías a una amiga que viviera exactamente lo mismo?',
            placeholder: 'Con toda la compasión que tienes para quienes amas...',
            key: 'friend_compassion',
            empathy: 'Tú también mereces esa misma compasión que das a otros.'
          }
        ]
      }
    },
    {
      id: 'free_expression',
      title: 'Expresión Libre del Alma',
      subtitle: 'Sin estructura, sin reglas. Solo tú y tu verdad',
      icon: Coffee,
      color: 'indigo',
      prompts: {
        title: 'Lo que necesito sacar de mi corazón...',
        sections: [
          {
            label: 'Escribe sin filtros, sin censura, sin "debería"',
            placeholder: 'Este es tu espacio sagrado. Aquí todo es bienvenido: la rabia, la tristeza, la confusión, la alegría... Todo tiene lugar aquí.',
            key: 'free_expression',
            empathy: 'Tu voz interior merece ser escuchada sin juicio.',
            large: true
          }
        ]
      }
    }
  ];

  const analyzeContent = (content: string) => {
    const patterns = [];
    const lowerContent = content.toLowerCase();
    
    // Patrones de culpa maternal
    const guiltWords = ['culpa', 'mala madre', 'debería', 'tendría que', 'no soy suficiente', 'fracaso', 'fallo'];
    const guiltCount = guiltWords.filter(word => lowerContent.includes(word)).length;
    
    if (guiltCount >= 2) {
      patterns.push({
        type: 'guilt_pattern',
        message: 'Noto un patrón de autoexigencia muy alta en ti',
        suggestion: 'Recuerda: la madre perfecta no existe, pero tú eres la madre perfecta para tus hijos.',
        color: 'rose',
        affirmation: 'Soy suficientemente buena tal como soy.'
      });
    }
    
    // Patrones de sobrecarga
    const overwhelmWords = ['demasiado', 'no puedo', 'saturada', 'agobiada', 'abrumada', 'colapso'];
    const overwhelmCount = overwhelmWords.filter(word => lowerContent.includes(word)).length;
    
    if (overwhelmCount >= 2) {
      patterns.push({
        type: 'overwhelm_pattern',
        message: 'Veo señales claras de sobrecarga emocional y mental',
        suggestion: 'Es momento de priorizar y soltar algunas cargas. No tienes que hacerlo todo.',
        color: 'amber',
        affirmation: 'Tengo derecho a establecer límites y pedir ayuda.'
      });
    }
    
    // Patrones de autocuidado
    const selfCareWords = ['agotada', 'cansada', 'sin tiempo', 'no descanso', 'sacrifico'];
    const selfCareCount = selfCareWords.filter(word => lowerContent.includes(word)).length;
    
    if (selfCareCount >= 2) {
      patterns.push({
        type: 'selfcare_need',
        message: 'Tu bienestar físico y emocional está pidiendo atención',
        suggestion: 'Cuidarte no es opcional, es esencial. Tu familia necesita que estés bien.',
        color: 'purple',
        affirmation: 'Cuidarme a mí misma es un regalo para toda mi familia.'
      });
    }
    
    // Patrones positivos
    const positiveWords = ['orgullosa', 'logré', 'conecté', 'disfruté', 'agradecida'];
    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
    
    if (positiveCount >= 2) {
      patterns.push({
        type: 'positive_pattern',
        message: '¡Qué hermoso reconocer estos momentos de plenitud!',
        suggestion: 'Guarda estos sentimientos en tu corazón para los días más difíciles.',
        color: 'green',
        affirmation: 'Merezco celebrar mis logros y momentos de felicidad.'
      });
    }
    
    return patterns;
  };

  const handleContentChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    if (value.length > 30) {
      const patterns = analyzeContent(value);
      setDetectedPatterns(patterns);
    }
  };

  const selectedEmotion = emotions.find(e => e.id === formData.emotion);
  const selectedTemplateData = diaryTemplates.find(t => t.id === selectedTemplate);

  const handleSave = () => {
    const currentTime = new Date();
    const finalData = {
      ...formData,
      timestamp: currentTime,
      template: selectedTemplate,
      patterns: detectedPatterns
    };
    
    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-8 border border-rose-100">
        
        {/* Header empático */}
        <div className="relative p-8 bg-gradient-to-r from-rose-50 to-orange-50 rounded-t-3xl border-b border-rose-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-rose-100 to-orange-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu Espacio Sagrado</h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Aquí puedes ser completamente auténtica. No hay juicios, solo amor y comprensión.
            </p>
          </div>
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto">
          
          {/* Selección de template */}
          {!selectedTemplate && (
            <div className="p-8">
              <div className="text-center mb-8">
                <Users className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  ¿Qué vive en tu corazón hoy?
                </h3>
                <p className="text-gray-600">
                  Elige el espacio que más resuene con lo que necesitas expresar
                </p>
              </div>
              
              <div className="grid gap-4">
                {diaryTemplates.map(template => {
                  const TemplateIcon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`text-left p-6 rounded-2xl border-2 border-gray-200 hover:border-${template.color}-300 transition-all group hover:shadow-lg transform hover:scale-[1.01]`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-4 bg-${template.color}-100 rounded-xl group-hover:bg-${template.color}-200 transition-all`}>
                          <TemplateIcon className={`w-7 h-7 text-${template.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 mb-1 text-lg">
                            {template.title}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {template.subtitle}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Formulario del template */}
          {selectedTemplate && selectedTemplateData && (
            <div className="p-8 space-y-8">
              
              {/* Header del template */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-${selectedTemplateData.color}-100 rounded-full mb-4`}>
                  <selectedTemplateData.icon className={`w-7 h-7 text-${selectedTemplateData.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedTemplateData.title}
                </h3>
                <p className="text-gray-600 mb-4">{selectedTemplateData.subtitle}</p>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Elegir otro espacio
                </button>
              </div>
              
              {/* Selección de emoción mejorada */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
                  ¿Cómo se siente tu corazón ahora mismo?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {emotions.map(emotion => {
                    const EmotionIcon = emotion.icon;
                    const isSelected = formData.emotion === emotion.id;
                    return (
                      <button
                        key={emotion.id}
                        onClick={() => setFormData(prev => ({ ...prev, emotion: emotion.id }))}
                        className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                          isSelected
                            ? `border-${emotion.color.split('-')[1]}-400 ${emotion.bg} shadow-lg`
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <EmotionIcon className={`w-8 h-8 mx-auto mb-2 ${
                          isSelected ? emotion.color : 'text-gray-400'
                        }`} />
                        <p className={`font-semibold text-sm ${
                          isSelected ? emotion.color : 'text-gray-600'
                        }`}>
                          {emotion.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
                
                {selectedEmotion && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-blue-800 text-sm font-medium text-center italic">
                      💙 {selectedEmotion.message}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Título personalizado */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  Dale un título a tu reflexión
                </label>
                <input
                  type="text"
                  value={formData.title || selectedTemplateData.prompts.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-lg"
                  placeholder={selectedTemplateData.prompts.title}
                />
              </div>
              
              {/* Secciones del template con empatía */}
              {selectedTemplateData.prompts.sections.map((section: any, index: number) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <div className={`w-8 h-8 bg-${selectedTemplateData.color}-100 rounded-full flex items-center justify-center`}>
                        <span className={`text-sm font-bold text-${selectedTemplateData.color}-600`}>
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-lg font-bold text-gray-800 mb-2">
                        {section.label}
                      </label>
                      {section.empathy && (
                        <p className="text-sm text-gray-600 italic mb-3 pl-4 border-l-2 border-gray-200">
                          {section.empathy}
                        </p>
                      )}
                      <textarea
                        value={formData[section.key] || ''}
                        onChange={(e) => handleContentChange(section.key, e.target.value)}
                        placeholder={section.placeholder}
                        rows={section.large ? 10 : 5}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Métricas emocionales */}
              <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Energía física (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.energyLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gradient-to-r from-red-200 to-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Agotada</span>
                    <span className="font-bold text-lg">{formData.energyLevel}</span>
                    <span>Energizada</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Carga mental (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.cargaMental}
                    onChange={(e) => setFormData(prev => ({ ...prev, cargaMental: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gradient-to-r from-green-200 to-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Ligera</span>
                    <span className="font-bold text-lg">{formData.cargaMental}</span>
                    <span>Abrumadora</span>
                  </div>
                </div>
              </div>
              
              {/* Insights automáticos con afirmaciones */}
              {detectedPatterns.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center">
                    <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
                    Reflexiones para tu corazón
                  </h4>
                  {detectedPatterns.map((pattern: any, index: number) => (
                    <div key={index} className={`p-6 bg-${pattern.color}-50 border-l-4 border-${pattern.color}-400 rounded-xl`}>
                      <div className="space-y-3">
                        <p className="font-semibold text-gray-800">
                          {pattern.message}
                        </p>
                        <p className="text-gray-600 text-sm">
                          💡 {pattern.suggestion}
                        </p>
                        <div className="bg-white/80 rounded-lg p-3 border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 italic">
                            ✨ Afirmación para ti: "{pattern.affirmation}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer con mensaje amoroso */}
        {selectedTemplate && (
          <div className="p-8 bg-gradient-to-r from-rose-50 to-orange-50 rounded-b-3xl border-t border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "Cada palabra que escribes aquí es un acto de amor hacia ti misma. 
                  Gracias por darte este tiempo tan necesario." 💕
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={!formData.emotion}
                className="ml-6 flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-rose-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <Save className="w-5 h-5" />
                <span>Honrar mi reflexión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionalJournal;