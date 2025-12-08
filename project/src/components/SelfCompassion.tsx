import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sun, 
  Star, 
  CheckCircle, 
  RefreshCw, 
  Lightbulb, 
  Award, 
  Timer,
  Play,
  Pause,
  RotateCcw,
  Bookmark,
  Share2,
  Calendar,
  TrendingUp,
  X
} from 'lucide-react';

const CulpaAntidote = () => {
  const [currentAntidote, setCurrentAntidote] = useState(null);
  const [completedToday, setCompletedToday] = useState(false);
  const [streak, setStreak] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [currentStep, setCurrentStep] = useState(0);
  const [showWeeklyProgress, setShowWeeklyProgress] = useState(false);
  const [showCommunityShare, setShowCommunityShare] = useState(false);
  const [dailyProgress, setDailyProgress] = useState({
    mantra: false,
    breathing: false,
    reflection: false,
    affirmation: false
  });

  // Configuración mejorada de colores con mejor contraste
  const colorConfig = {
    rose: {
      header: 'from-rose-600 to-pink-700',
      background: 'bg-rose-50',
      button: 'from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800',
      text: 'text-rose-800',
      border: 'border-rose-200',
      progress: 'from-rose-500 to-pink-500'
    },
    amber: {
      header: 'from-amber-600 to-orange-700',
      background: 'bg-amber-50',
      button: 'from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800',
      text: 'text-amber-800',
      border: 'border-amber-200',
      progress: 'from-amber-500 to-orange-500'
    },
    purple: {
      header: 'from-purple-600 to-indigo-700',
      background: 'bg-purple-50',
      button: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
      text: 'text-purple-800',
      border: 'border-purple-200',
      progress: 'from-purple-500 to-indigo-500'
    },
    blue: {
      header: 'from-blue-600 to-indigo-700',
      background: 'bg-blue-50',
      button: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
      text: 'text-blue-800',
      border: 'border-blue-200',
      progress: 'from-blue-500 to-indigo-500'
    },
    green: {
      header: 'from-emerald-600 to-green-700',
      background: 'bg-emerald-50',
      button: 'from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      progress: 'from-emerald-500 to-green-500'
    }
  };

  // Antídotos con mejor configuración de colores
  const antidotes = [
    {
      id: 'perfecta_inexistente',
      title: 'La Madre Perfecta No Existe',
      category: 'autocompasion',
      duration: 180,
      difficulty: 'Principiante',
      color: 'rose',
      mantra: 'Soy una madre suficientemente buena, y eso es más que suficiente',
      microlearning: {
        concept: 'El concepto de "madre suficientemente buena" fue creado por el psicólogo Donald Winnicott. No necesitas ser perfecta, solo necesitas ser consistentemente amorosa.',
        tip: 'Cada vez que pienses "debería", cámbialo por "podría". Esto reduce la presión autoimpuesta.'
      },
      steps: [
        {
          type: 'mantra',
          title: 'Mantra de Autocompasión',
          instruction: 'Repite en voz alta o mentalmente:',
          content: '"No soy perfecta, soy humana. Mis hijos necesitan una madre real, no una perfecta."',
          duration: 30
        },
        {
          type: 'breathing',
          title: 'Respiración Liberadora',
          instruction: 'Inhala amor propio, exhala culpa:',
          content: '4 segundos inhalando "me perdono", 6 segundos exhalando "me acepto"',
          duration: 60
        },
        {
          type: 'reflection',
          title: 'Reflexión Compasiva',
          instruction: 'Pregúntate:',
          content: '¿Qué le dirías a tu mejor amiga si se sintiera como tú ahora? Dítelo a ti misma.',
          duration: 60
        },
        {
          type: 'affirmation',
          title: 'Afirmación Final',
          instruction: 'Termina con esta verdad:',
          content: '"Mis hijos me aman por quien soy, no por lo que hago perfectamente."',
          duration: 30
        }
      ]
    },
    {
      id: 'gritos_humanos',
      title: 'Los Gritos No Me Definen',
      category: 'reparacion',
      duration: 180,
      difficulty: 'Intermedio',
      color: 'amber',
      mantra: 'Un momento difícil no borra miles de momentos de amor',
      microlearning: {
        concept: 'Todos los padres pierden la paciencia. Lo importante no es la perfección, sino la reparación y el aprendizaje.',
        tip: 'Después de gritar, reconócelo, discúlpate si es necesario, y muestra cómo manejarás mejor la próxima vez.'
      },
      steps: [
        {
          type: 'mantra',
          title: 'Validación Inmediata',
          instruction: 'Reconoce tu humanidad:',
          content: '"Grité porque estoy agotada, no porque sea mala madre. Puedo reparar esto."',
          duration: 30
        },
        {
          type: 'breathing',
          title: 'Reset Emocional',
          instruction: 'Resetea tu sistema nervioso:',
          content: 'Inhala 4 seg, mantén 4 seg, exhala 8 seg. Repite 5 veces.',
          duration: 60
        },
        {
          type: 'reflection',
          title: 'Plan de Reparación',
          instruction: 'Si gritaste hoy, piensa:',
          content: '¿Cómo puedo reconectarme con mis hijos? Un abrazo, una disculpa, un momento especial.',
          duration: 60
        },
        {
          type: 'affirmation',
          title: 'Afirmación de Crecimiento',
          instruction: 'Cierra con esperanza:',
          content: '"Estoy aprendiendo a ser más paciente. Cada día mejoro un poco más."',
          duration: 30
        }
      ]
    },
    {
      id: 'tiempo_propio',
      title: 'Merezco Tiempo Para Mí',
      category: 'autocuidado',
      duration: 180,
      difficulty: 'Avanzado',
      color: 'purple',
      mantra: 'Cuidarme no es egoísmo, es necesidad',
      microlearning: {
        concept: 'Una madre agotada no puede dar lo mejor de sí. El autocuidado no es lujo, es mantenimiento básico.',
        tip: 'Programa 15 minutos diarios para ti como si fuera una cita médica importante. No es negociable.'
      },
      steps: [
        {
          type: 'mantra',
          title: 'Permiso de Autocuidado',
          instruction: 'Date permiso:',
          content: '"Tengo derecho a descansar, a tener tiempo propio, a no ser perfecta 24/7."',
          duration: 30
        },
        {
          type: 'breathing',
          title: 'Espacio Interno',
          instruction: 'Crea espacio mental:',
          content: 'Imagina un lugar tranquilo solo tuyo. Respira ahí por 1 minuto.',
          duration: 60
        },
        {
          type: 'reflection',
          title: 'Micromomentous de Autocuidado',
          instruction: 'Planifica hoy:',
          content: '¿Qué 3 cosas pequeñas puedes hacer solo para ti? Un té, 5 min de música, llamar a una amiga.',
          duration: 60
        },
        {
          type: 'affirmation',
          title: 'Verdad del Autocuidado',
          instruction: 'Interioriza esta verdad:',
          content: '"Cuando me cuido, puedo cuidar mejor a mi familia. Mi bienestar importa."',
          duration: 30
        }
      ]
    },
    {
      id: 'trabajo_maternidad',
      title: 'Trabajar No Es Abandono',
      category: 'equilibrio',
      duration: 180,
      difficulty: 'Intermedio',
      color: 'blue',
      mantra: 'Trabajo por amor, no por abandono',
      microlearning: {
        concept: 'Trabajar fuera de casa enseña independencia, perseverancia y cuidado familiar a tus hijos.',
        tip: 'La calidad del tiempo juntos importa más que la cantidad. 20 minutos presentes valen más que 2 horas distraídas.'
      },
      steps: [
        {
          type: 'mantra',
          title: 'Reencuadre del Trabajo',
          instruction: 'Cambia la perspectiva:',
          content: '"Trabajo para cuidar a mi familia, no para abandonarla. Soy ejemplo de dedicación."',
          duration: 30
        },
        {
          type: 'breathing',
          title: 'Conexión a Distancia',
          instruction: 'Envía amor mentalmente:',
          content: 'Piensa en cada hijo, envíales amor y protección con cada respiración.',
          duration: 60
        },
        {
          type: 'reflection',
          title: 'Momentos de Calidad',
          instruction: 'Planifica conexión:',
          content: '¿Qué momento especial puedes crear hoy con cada hijo? Aunque sea 10 minutos.',
          duration: 60
        },
        {
          type: 'affirmation',
          title: 'Orgullo Maternal',
          instruction: 'Celebra tu esfuerzo:',
          content: '"Soy una madre trabajadora que cuida de múltiples formas. Eso es amor en acción."',
          duration: 30
        }
      ]
    },
    {
      id: 'pantallas_respiro',
      title: 'Las Pantallas No Son El Diablo',
      category: 'supervivencia',
      duration: 180,
      difficulty: 'Principiante',
      color: 'green',
      mantra: 'Uso las herramientas que tengo disponibles',
      microlearning: {
        concept: 'Las pantallas pueden ser herramientas de supervivencia maternal. Un respiro no te convierte en mala madre.',
        tip: 'En lugar de "tiempo de pantalla", piénsalo como "tiempo de recarga maternal". Ambos lo necesitan.'
      },
      steps: [
        {
          type: 'mantra',
          title: 'Perdón por Supervivencia',
          instruction: 'Acepta tu realidad:',
          content: '"A veces necesito un respiro, y las pantallas me lo dan. Eso está bien."',
          duration: 30
        },
        {
          type: 'breathing',
          title: 'Liberación de Culpa',
          instruction: 'Exhala la culpa:',
          content: 'Inhala compasión, exhala juicio. Las madres perfectas no existen.',
          duration: 60
        },
        {
          type: 'reflection',
          title: 'Balance Realista',
          instruction: 'Encuentra equilibrio:',
          content: '¿Cómo puedes balancear pantallas con otros momentos de conexión?',
          duration: 60
        },
        {
          type: 'affirmation',
          title: 'Madre Real',
          instruction: 'Abraza tu realidad:',
          content: '"Soy una madre real en un mundo real. Hago lo mejor con lo que tengo."',
          duration: 30
        }
      ]
    }
  ];

  // Seleccionar antídoto del día basado en fecha
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const antidoteIndex = dayOfYear % antidotes.length;
    setCurrentAntidote(antidotes[antidoteIndex]);
    
    const completedDate = localStorage.getItem('lastAntidoteDate');
    const todayString = today.toDateString();
    setCompletedToday(completedDate === todayString);
  }, []);

  // Timer para ejercicio activo
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (currentStep < currentAntidote?.steps.length - 1) {
        nextStep();
      } else {
        completeAntidote();
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentStep]);

  const startAntidote = () => {
    setCurrentStep(0);
    setTimeLeft(currentAntidote.steps[0].duration);
    setIsActive(true);
    setDailyProgress(prev => ({ ...prev, [currentAntidote.steps[0].type]: true }));
  };

  const nextStep = () => {
    if (currentStep < currentAntidote.steps.length - 1) {
      const nextStepData = currentAntidote.steps[currentStep + 1];
      setCurrentStep(currentStep + 1);
      setTimeLeft(nextStepData.duration);
      setIsActive(true);
      setDailyProgress(prev => ({ ...prev, [nextStepData.type]: true }));
    }
  };

  const pauseResume = () => {
    setIsActive(!isActive);
  };

  const resetStep = () => {
    setTimeLeft(currentAntidote.steps[currentStep].duration);
    setIsActive(false);
  };

  const completeAntidote = () => {
    setCompletedToday(true);
    setIsActive(false);
    localStorage.setItem('lastAntidoteDate', new Date().toDateString());
    localStorage.setItem('antidoteStreak', (streak + 1).toString());
    setStreak(streak + 1);
    
    alert('¡🎉 Antídoto completado! Has dado un paso importante hacia la autocompasión maternal.');
  };

  const selectDifferentAntidote = (antidote) => {
    setCurrentAntidote(antidote);
    setCurrentStep(0);
    setIsActive(false);
    setTimeLeft(antidote.steps[0].duration);
  };

  const handleCommunityShare = () => {
    setShowCommunityShare(true);
  };

  const handleWeeklyProgress = () => {
    setShowWeeklyProgress(!showWeeklyProgress);
  };

  // Datos simulados de progreso semanal
  const weeklyData = [
    { day: 'Lun', completed: true, antidote: 'Madre Perfecta' },
    { day: 'Mar', completed: true, antidote: 'Gritos Humanos' },
    { day: 'Mié', completed: true, antidote: 'Tiempo Para Mí' },
    { day: 'Jue', completed: false, antidote: '-' },
    { day: 'Vie', completed: false, antidote: '-' },
    { day: 'Sáb', completed: false, antidote: '-' },
    { day: 'Dom', completed: false, antidote: '-' }
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentAntidote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-300 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Preparando tu antídoto diario...</p>
        </div>
      </div>
    );
  }

  const currentStepData = currentAntidote.steps[currentStep];
  const progress = ((currentStep + 1) / currentAntidote.steps.length) * 100;
  const colors = colorConfig[currentAntidote.color];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Header con streak */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.background} rounded-full mb-4 shadow-lg border-2 ${colors.border}`}>
            <Heart className={`w-8 h-8 ${colors.text}`} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Antídoto Diario de Culpa
          </h1>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{streak} días consecutivos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4 text-blue-500" />
              <span>~3 minutos</span>
            </div>
            {completedToday && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">¡Completado hoy!</span>
              </div>
            )}
          </div>
        </div>

        {/* Antídoto del día */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-100">
          
          {/* Header del antídoto con mejor contraste */}
          <div className={`bg-gradient-to-r ${colors.header} text-white p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white drop-shadow-sm">
                  {currentAntidote.title}
                </h2>
                <p className="text-lg text-white/95 italic drop-shadow-sm">
                  "{currentAntidote.mantra}"
                </p>
              </div>
              <div className="text-right">
                <div className="bg-white/25 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-2 border border-white/20">
                  <span className="text-white font-medium">{currentAntidote.category}</span>
                </div>
                <div className="text-sm text-white/90 font-medium">
                  {currentAntidote.difficulty}
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar mejorada */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Paso {currentStep + 1} de {currentAntidote.steps.length}
              </span>
              <span className="text-sm font-bold text-gray-700">
                {Math.round(progress)}% completado
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className={`bg-gradient-to-r ${colors.progress} h-3 rounded-full transition-all duration-500 shadow-sm`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Contenido del paso actual */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {currentStepData.title}
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {currentStepData.instruction}
              </p>
              
              {/* Timer circular mejorado */}
              <div className="relative inline-flex items-center justify-center mb-8">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={`${2 * Math.PI * 48 * (1 - (currentStepData.duration - timeLeft) / currentStepData.duration)}`}
                    className={`${colors.text.replace('text-', 'text-').replace('-800', '-600')} transition-all duration-1000 drop-shadow-sm`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              
              {/* Contenido del ejercicio con mejor diseño */}
              <div className={`${colors.background} rounded-2xl p-8 mb-8 border-2 ${colors.border} shadow-inner`}>
                <p className="text-xl leading-relaxed text-gray-800 italic font-medium">
                  "{currentStepData.content}"
                </p>
              </div>
            </div>

            {/* Controles mejorados */}
            <div className="flex justify-center space-x-4">
              {!isActive && currentStep === 0 && !completedToday && (
                <button
                  onClick={startAntidote}
                  className={`flex items-center space-x-3 bg-gradient-to-r ${colors.button} text-white px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-lg`}
                >
                  <Play className="w-6 h-6" />
                  <span>Comenzar Antídoto</span>
                </button>
              )}
              
              {(isActive || currentStep > 0) && !completedToday && (
                <>
                  <button
                    onClick={pauseResume}
                    className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg font-medium"
                  >
                    {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span>{isActive ? 'Pausar' : 'Continuar'}</span>
                  </button>
                  
                  <button
                    onClick={resetStep}
                    className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg font-medium"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reiniciar</span>
                  </button>
                  
                  {currentStep < currentAntidote.steps.length - 1 && (
                    <button
                      onClick={nextStep}
                      className={`flex items-center space-x-2 bg-gradient-to-r ${colors.button} text-white px-6 py-3 rounded-xl transition-all shadow-lg font-medium`}
                    >
                      <span>Siguiente</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Microlearning del día */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="bg-yellow-100 p-3 rounded-full border-2 border-yellow-200">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ¿Sabías que...?
              </h3>
              <p className="text-gray-700 mb-3 leading-relaxed">
                {currentAntidote.microlearning.concept}
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  <strong>Tip práctico:</strong> {currentAntidote.microlearning.tip}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress diario */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Tu Progreso de Autocompasión
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(dailyProgress).map(([key, completed]) => {
              const labels = {
                mantra: 'Mantra',
                breathing: 'Respiración',
                reflection: 'Reflexión',
                affirmation: 'Afirmación'
              };
              
              return (
                <div key={key} className={`text-center p-4 rounded-lg border-2 transition-all ${
                  completed ? 'bg-green-50 border-green-300 shadow-md' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-all ${
                    completed ? 'bg-green-500 shadow-lg' : 'bg-gray-300'
                  }`}>
                    <CheckCircle className={`w-6 h-6 ${completed ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <p className={`text-sm font-medium ${completed ? 'text-green-700' : 'text-gray-600'}`}>
                    {labels[key]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Otros antídotos disponibles */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Otros Antídotos Disponibles
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {antidotes.filter(a => a.id !== currentAntidote.id).map(antidote => {
              const antidoteColors = colorConfig[antidote.color];
              return (
                <button
                  key={antidote.id}
                  onClick={() => selectDifferentAntidote(antidote)}
                  className={`text-left p-4 rounded-xl border-2 border-gray-200 hover:${antidoteColors.border} hover:shadow-lg transition-all group`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-3 ${antidoteColors.background} rounded-lg group-hover:shadow-md transition-all border ${antidoteColors.border}`}>
                      <Heart className={`w-5 h-5 ${antidoteColors.text}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 mb-1">
                        {antidote.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 italic">
                        "{antidote.mantra}"
                      </p>
                      <p className="text-xs text-gray-500">
                        {antidote.category} • {antidote.difficulty}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mensaje motivacional con mejor visibilidad */}
        {completedToday && (
          <div className="mt-8 mb-20 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 border-2 border-green-300 shadow-lg">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                ¡Antídoto Completado! 🎉
              </h3>
              <p className="text-green-700 mb-8 leading-relaxed max-w-2xl mx-auto text-lg">
                Has practicado autocompasión maternal hoy. Esto no es solo autocuidado, 
                es un ejemplo poderoso para tus hijos de cómo tratarse con amor.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button 
                  onClick={handleCommunityShare}
                  className="flex items-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Compartir en Comunidad</span>
                </button>
                <button 
                  onClick={handleWeeklyProgress}
                  className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{showWeeklyProgress ? 'Ocultar' : 'Ver'} Progreso Semanal</span>
                </button>
              </div>

              {/* Progreso Semanal Expandible */}
              {showWeeklyProgress && (
                <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-inner animate-in slide-in-from-top-5 duration-300">
                  <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                    Tu Progreso Esta Semana
                  </h4>
                  
                  <div className="grid grid-cols-7 gap-3 mb-6">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="text-center">
                        <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-sm border-2 transition-all ${
                          day.completed 
                            ? 'bg-green-500 text-white border-green-600 shadow-lg' 
                            : index === 3 
                              ? 'bg-blue-100 text-blue-600 border-blue-300 ring-2 ring-blue-200' 
                              : 'bg-gray-100 text-gray-400 border-gray-200'
                        }`}>
                          {day.completed ? <CheckCircle className="w-6 h-6" /> : day.day.charAt(0)}
                        </div>
                        <p className="text-xs text-gray-600 font-medium">{day.day}</p>
                        {day.completed && (
                          <p className="text-xs text-green-600 mt-1 font-medium">✓</p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">3</div>
                      <p className="text-sm text-green-700 font-medium">Días Completados</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{streak}</div>
                      <p className="text-sm text-blue-700 font-medium">Racha Actual</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">9</div>
                      <p className="text-sm text-purple-700 font-medium">Min. de Autocompasión</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                    <p className="text-sm text-yellow-800 text-center font-medium">
                      ¡Vas genial! 🌟 Mantén esta rutina de autocompasión y verás cambios profundos en tu bienestar maternal.
                    </p>
                  </div>
                </div>
              )}

              {/* Modal de Compartir en Comunidad */}
              {showCommunityShare && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowCommunityShare(false)}>
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <Share2 className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Compartir en la Comunidad
                      </h3>
                      <p className="text-gray-600">
                        Inspira a otras madres compartiendo tu logro
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">¡Completé mi antídoto diario!</p>
                          <p className="text-sm text-gray-600">"{currentAntidote.title}"</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 italic">
                        "Practiqué autocompasión hoy con el mantra: {currentAntidote.mantra}"
                      </p>
                      <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                        <span>🔥 {streak} días consecutivos</span>
                        <span>💚 +1 día de autocompasión</span>
                      </div>
                    </div>

                    <textarea
                      placeholder="Comparte cómo te sientes o anima a otras madres... (opcional)"
                      className="w-full h-20 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-sm mb-6"
                    />

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowCommunityShare(false)}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          setShowCommunityShare(false);
                          alert('🎉 ¡Logro compartido en la comunidad! Has inspirado a otras madres.');
                        }}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all"
                      >
                        Compartir
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CulpaAntidote;