import React, { useState } from 'react';
import { Heart, Users, Clock, AlertTriangle, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    numChildren: '',
    childrenAges: [],
    workSituation: '',
    partnerSupport: 1,
    mainGuiltTriggers: [],
    peakAnxietyTimes: [],
    exhaustionLevel: 5,
    selfCareTime: '',
    supportNetwork: '',
    mainConcerns: []
  });

  const steps = [
    {
      title: "Cuéntanos sobre tu hermosa familia",
      subtitle: "Cada familia es única y especial. Queremos conocer la tuya para acompañarte mejor",
      icon: Users,
      component: Step1
    },
    {
      title: "Tu realidad diaria",
      subtitle: "Sabemos que ser madre es el trabajo más demandante del mundo. Cuéntanos cómo es tu día a día",
      icon: Clock,
      component: Step2
    },
    {
      title: "Esos momentos difíciles",
      subtitle: "Todas las madres pasamos por momentos de carga emocional. No estás sola en esto",
      icon: AlertTriangle,
      component: Step3
    },
    {
      title: "Tu red de apoyo",
      subtitle: "Reconocemos tu fortaleza y queremos entender cómo podemos apoyarte mejor",
      icon: Heart,
      component: Step4
    }
  ];

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log('Datos del onboarding maternal:', formData);
    onComplete();
  };

  // STEP 1: Información familiar
  function Step1() {
    return (
      <div className="space-y-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full mb-3">
            <Sparkles className="w-6 h-6 text-rose-600" />
          </div>
          <p className="text-gray-600 text-sm italic">
            "Ser madre es amar algo más que a tu propia vida"
          </p>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            ¿Cuántos hijos iluminan tu vida?
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[1,2,3,4].map(num => (
              <button
                key={num}
                onClick={() => updateFormData('numChildren', num)}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  formData.numChildren === num
                    ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-lg'
                    : 'border-gray-200 hover:border-rose-300 hover:shadow-md'
                }`}
              >
                <span className="text-xl font-bold">{num === 4 ? '4+' : num}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            ¿En qué etapas de la vida están tus pequeños? 
            <span className="block text-sm font-normal text-gray-500 mt-1">
              Cada edad trae sus propios desafíos y alegrías
            </span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['0-2 años', '3-5 años', '6-12 años', '13-17 años', '18+ años'].map(age => (
              <button
                key={age}
                onClick={() => {
                  const current = formData.childrenAges || [];
                  const updated = current.includes(age)
                    ? current.filter((a: string) => a !== age)
                    : [...current, age];
                  updateFormData('childrenAges', updated);
                }}
                className={`p-4 rounded-xl border-2 text-center transition-all transform hover:scale-105 ${
                  formData.childrenAges?.includes(age)
                    ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-lg'
                    : 'border-gray-200 hover:border-rose-300 hover:shadow-md'
                }`}
              >
                <span className="font-medium">{age}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Situación laboral y carga
  function Step2() {
    return (
      <div className="space-y-8">
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm italic">
            "Reconocemos cada esfuerzo que haces por tu familia"
          </p>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            ¿Cómo combinas tu vida profesional con la maternidad?
            <span className="block text-sm font-normal text-gray-500 mt-1">
              Sabemos que es todo un malabarismo
            </span>
          </label>
          <div className="space-y-3">
            {[
              'Trabajo tiempo completo fuera de casa',
              'Trabajo tiempo parcial',
              'Trabajo desde casa',
              'Ama de casa tiempo completo',
              'Estudiante',
              'Buscando trabajo'
            ].map(option => (
              <button
                key={option}
                onClick={() => updateFormData('workSituation', option)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                  formData.workSituation === option
                    ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-lg'
                    : 'border-gray-200 hover:border-rose-300 hover:shadow-md'
                }`}
              >
                <span className="font-medium">{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            En tu corazón, ¿qué tan agotada te sientes?
            <span className="block text-sm font-normal text-gray-500 mt-1">
              Es normal sentirse cansada. Eres humana, no una súper heroína
            </span>
          </label>
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500 font-medium">Descansada</span>
              <span className="text-sm text-gray-500 font-medium">Completamente agotada</span>
            </div>
            <div className="flex justify-center space-x-2">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateFormData('exhaustionLevel', i + 1)}
                  className={`w-10 h-10 rounded-full border-2 text-sm font-bold transition-all transform hover:scale-110 ${
                    formData.exhaustionLevel === i + 1
                      ? 'border-rose-400 bg-rose-400 text-white shadow-lg'
                      : 'border-gray-300 hover:border-rose-300 bg-white hover:shadow-md'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="text-center mt-3">
              <span className="text-sm text-gray-600">
                Tu nivel actual: <strong>{formData.exhaustionLevel}/10</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: Momentos de mayor carga y culpa
  function Step3() {
    return (
      <div className="space-y-8">
        <div className="text-center mb-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-blue-800 text-sm font-medium">
            💙 La culpa maternal es normal. Significa que te importa profundamente ser buena madre.
            No estás sola en estos sentimientos.
          </p>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            ¿En qué momentos sientes más culpa como madre?
            <span className="block text-sm font-normal text-gray-500 mt-1">
              Todas las madres experimentamos estos sentimientos. Compartir nos ayuda a sanar
            </span>
          </label>
          <div className="space-y-3">
            {[
              'Cuando pierdo la paciencia y grito',
              'Al dejarlos con otros para trabajar',
              'Por no jugar suficiente con ellos',
              'Cuando uso pantallas para tener un respiro',
              'Al sentirme agotada y sin energía',
              'Por no ser la madre "perfecta" de redes sociales',
              'Cuando necesito tiempo para mí misma'
            ].map(trigger => (
              <button
                key={trigger}
                onClick={() => {
                  const current = formData.mainGuiltTriggers || [];
                  const updated = current.includes(trigger)
                    ? current.filter((t: string) => t !== trigger)
                    : [...current, trigger];
                  updateFormData('mainGuiltTriggers', updated);
                }}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all transform hover:scale-[1.01] ${
                  formData.mainGuiltTriggers?.includes(trigger)
                    ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-lg'
                    : 'border-gray-200 hover:border-rose-300 hover:shadow-md'
                }`}
              >
                <span className="font-medium">{trigger}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            ¿En qué momentos del día sientes más ansiedad?
            <span className="block text-sm font-normal text-gray-500 mt-1">
              Identificar estos patrones nos ayuda a prepararnos mejor
            </span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Temprano en la mañana (5-7 AM)',
              'Durante la mañana (7 AM-12 PM)',
              'En la tarde (12-6 PM)',
              'Al atardecer (6-9 PM)',
              'Antes de dormir (9-11 PM)',
              'Durante la madrugada'
            ].map(time => (
              <button
                key={time}
                onClick={() => {
                  const current = formData.peakAnxietyTimes || [];
                  const updated = current.includes(time)
                    ? current.filter((t: string) => t !== time)
                    : [...current, time];
                  updateFormData('peakAnxietyTimes', updated);
                }}
                className={`p-4 rounded-xl border-2 text-center transition-all transform hover:scale-105 ${
                  formData.peakAnxietyTimes?.includes(time)
                    ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-lg'
                    : 'border-gray-200 hover:border-rose-300 hover:shadow-md'
                }`}
              >
                <span className="font-medium text-sm">{time}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // STEP 4: Red de apoyo y corresponsabilidad
  function Step4() {
    return (
      <div className="space-y-8">
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm italic">
            "Una madre fuerte sabe pedir ayuda cuando la necesita"
          </p>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            ¿Cómo describes el apoyo de tu pareja en las responsabilidades familiares?
            <span className="block text-sm font-normal text-gray-500 mt-1">
              Tu percepción es válida y importante
            </span>
          </label>
          <div className="space-y-3">
            {[
              { value: 1, label: 'Casi todo recae en mí' },
              { value: 2, label: 'Ayuda ocasionalmente cuando se lo pido' },
              { value: 3, label: 'Compartimos algunas tareas regularmente' },
              { value: 4, label: 'Tenemos una división bastante equitativa' },
              { value: 5, label: 'No tengo pareja actualmente' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => updateFormData('partnerSupport', option.value)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all transform hover:scale-[1.01] ${
                  formData.partnerSupport === option.value
                    ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-lg'
                    : 'border-gray-200 hover:border-rose-300 hover:shadow-md'
                }`}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            ¿Qué te quita el sueño como madre?
            <span className="block text-sm font-normal text-gray-500 mt-1">
              Estas preocupaciones demuestran cuánto amas a tu familia
            </span>
          </label>
          <div className="space-y-3">
            {[
              'No estar haciendo lo suficiente por mis hijos',
              'Equilibrar trabajo y maternidad',
              'Falta de tiempo para cuidarme a mí misma',
              'Desarrollo emocional y bienestar de mis hijos',
              'Situación económica familiar',
              'Mi propia salud mental y emocional',
              'La relación con mi pareja'
            ].map(concern => (
              <button
                key={concern}
                onClick={() => {
                  const current = formData.mainConcerns || [];
                  const updated = current.includes(concern)
                    ? current.filter((c: string) => c !== concern)
                    : [...current, concern];
                  updateFormData('mainConcerns', updated);
                }}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all transform hover:scale-[1.01] ${
                  formData.mainConcerns?.includes(concern)
                    ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-lg'
                    : 'border-gray-200 hover:border-rose-300 hover:shadow-md'
                }`}
              >
                <span className="font-medium">{concern}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;
  const StepIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4 shadow-lg">
            <StepIcon className="w-8 h-8 text-rose-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
            {steps[currentStep].subtitle}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500 font-medium">Paso {currentStep + 1} de {steps.length}</span>
            <span className="text-sm text-gray-500 font-medium">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-rose-400 to-orange-400 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-rose-100">
          <CurrentStepComponent />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all font-medium ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-white/80 hover:shadow-md transform hover:scale-105'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Anterior</span>
          </button>

          <button
            onClick={nextStep}
            className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-8 py-3 rounded-xl hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
          >
            <span>{currentStep === steps.length - 1 ? '¡Comenzar mi camino!' : 'Continuar'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Motivational message */}
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-purple-100/80 to-pink-100/80 rounded-xl border border-purple-200">
          <div className="mb-2">
            <Heart className="w-6 h-6 text-rose-500 mx-auto" />
          </div>
          <p className="text-sm text-gray-700 italic leading-relaxed">
            "Recuerda: No hay una forma 'perfecta' de ser madre. Solo existe tu forma única y amorosa, 
            que es exactamente lo que tus hijos necesitan. Eres más fuerte de lo que crees." 💕
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;