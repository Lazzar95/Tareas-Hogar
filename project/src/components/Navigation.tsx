import React, { useState, useEffect } from 'react';
import { Home, Brain, Heart, Users, Calendar, BookOpen, MessageCircle, User } from 'lucide-react';

// Simulamos useLocation y Link para el demo
const useLocation = () => ({ pathname: '/' });
const Link: React.FC<{ to: string; className?: string; children: React.ReactNode }> = ({ 
  to, 
  className = '', 
  children 
}) => (
  <button 
    className={className}
    onClick={() => {
      console.log('Navegando a:', to);
      window.history.pushState({}, '', to);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }}
  >
    {children}
  </button>
);

const Navigation: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Escuchar cambios de ruta
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/chat', icon: Heart, label: 'Mia Chat' },
    { path: '/carga-mental', icon: Brain, label: 'Carga' },
    { path: '/emergencia', icon: Heart, label: 'SOS' },
    { path: '/autocompasion', icon: Heart, label: 'Amor' },
    { path: '/corresponsabilidad', icon: Users, label: 'Familia' },
    { path: '/diario', icon: BookOpen, label: 'Diario' },
    { path: '/comunidad', icon: MessageCircle, label: 'Comunidad' },
    { path: '/perfil', icon: User, label: 'Perfil' },
  ];

  // Auto-hide navegación con scroll inteligente
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Verificar si está cerca del final de la página
      const isNearBottom = windowHeight + currentScrollY >= documentHeight - 100;
      setIsAtBottom(isNearBottom);
      
      // Auto-hide logic: ocultar al bajar, mostrar al subir
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 50 || isNearBottom) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Aplicar espaciado automático al contenido
  useEffect(() => {
    const updateSpacing = () => {
      // Buscar todos los posibles contenedores y aplicar padding-bottom
      const selectors = [
        'main', 
        '#root > div', 
        '[data-main-content]',
        '.min-h-screen',
        'body'
      ];
      
      let applied = false;
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element instanceof HTMLElement && !applied) {
            element.style.paddingBottom = '120px';
            applied = true;
          }
        });
        if (applied) break;
      }
      
      // Fallback: aplicar a body si no se encontró ningún contenedor
      if (!applied) {
        document.body.style.paddingBottom = '120px';
      }
    };

    updateSpacing();
    window.addEventListener('resize', updateSpacing);
    
    return () => {
      window.removeEventListener('resize', updateSpacing);
      // Limpiar todos los posibles elementos
      const selectors = [
        'main', 
        '#root > div', 
        '[data-main-content]',
        '.min-h-screen'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.paddingBottom = '';
          }
        });
      });
      document.body.style.paddingBottom = '';
    };
  }, []);

  // Forzar visibilidad en páginas críticas
  const criticalPaths = ['/emergencia', '/chat', '/'];
  const shouldAlwaysShow = criticalPaths.includes(currentPath);

  return (
    <>      
      {/* Navegación con z-index optimizado para evitar superposiciones */}
      <nav 
        className={`
          fixed bottom-0 left-0 right-0 z-50
          transition-all duration-300 ease-in-out
          ${(isVisible || shouldAlwaysShow) 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-full opacity-0'
          }
          ${isAtBottom ? 'bg-white/95 backdrop-blur-xl' : 'bg-white/85 backdrop-blur-lg'}
          shadow-2xl shadow-gray-900/10
        `}
        style={{
          background: isAtBottom 
            ? 'linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.85) 100%)'
            : 'linear-gradient(to top, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.65) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderTop: isAtBottom ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.2)'
        }}
      >
        {/* Indicador sutil de contenido arriba - solo cuando está visible */}
        {isVisible && !isAtBottom && (
          <div 
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 
                       w-16 h-1 rounded-full opacity-30 animate-pulse"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #d1d5db 50%, transparent 100%)'
            }}
          />
        )}

        {/* Efecto de glassmorphism sutil */}
        <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-white/20 to-white/5 pointer-events-none" />

        <div className="relative flex justify-around items-center max-w-lg mx-auto px-3 py-3">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = currentPath === path;
            const isEmergency = path === '/emergencia';
            const isChat = path === '/chat';
            
            return (
              <Link
                key={path}
                to={path}
                className={`
                  relative flex flex-col items-center p-3 rounded-2xl 
                  transition-all duration-300 ease-out
                  transform-gpu will-change-transform
                  ${isActive
                    ? isEmergency 
                      ? 'text-red-600 bg-gradient-to-b from-red-50 to-red-100/80 shadow-lg shadow-red-200/50 scale-110 -translate-y-1' 
                      : isChat
                      ? 'text-pink-600 bg-gradient-to-b from-pink-50 to-pink-100/80 shadow-lg shadow-pink-200/50 scale-105 -translate-y-0.5'
                      : 'text-rose-600 bg-gradient-to-b from-rose-50 to-rose-100/80 shadow-lg shadow-rose-200/50 scale-105 -translate-y-0.5'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/60 hover:scale-105 active:scale-95'
                  }
                  ${isEmergency && !isActive ? 'hover:text-red-500 hover:bg-red-50/50' : ''}
                  ${isChat && !isActive ? 'hover:text-pink-500 hover:bg-pink-50/50' : ''}
                  border-none bg-transparent cursor-pointer
                `}
              >
                {/* Indicador de página activa con animación */}
                {isActive && (
                  <>
                    <div className={`absolute -top-1 w-1.5 h-1.5 rounded-full animate-pulse
                      ${isEmergency ? 'bg-red-500 shadow-red-400/50' : 
                        isChat ? 'bg-pink-500 shadow-pink-400/50' : 
                        'bg-rose-500 shadow-rose-400/50'}
                      shadow-md
                    `} />
                    {/* Segundo indicador para efecto de profundidad */}
                    <div className={`absolute -top-1 w-1.5 h-1.5 rounded-full animate-ping opacity-50
                      ${isEmergency ? 'bg-red-400' : 
                        isChat ? 'bg-pink-400' : 
                        'bg-rose-400'}
                    `} />
                  </>
                )}
                
                {/* Container del icono con efectos mejorados */}
                <div className={`relative transition-all duration-300 ${
                  isEmergency && isActive ? 'animate-bounce' : ''
                }`}>
                  <Icon className={`w-5 h-5 mb-1.5 transition-all duration-300 ${
                    isActive ? 'drop-shadow-sm' : ''
                  }`} />
                  
                  {/* Pulsing dot para emergencia */}
                  {isEmergency && (
                    <div className="absolute -top-1 -right-1 flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75" />
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full absolute" />
                    </div>
                  )}
                  
                  {/* Pulsing heart para chat */}
                  {isChat && isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-400 animate-pulse opacity-50 absolute" />
                    </div>
                  )}
                </div>
                
                {/* Label con tipografía mejorada y efectos */}
                <span className={`
                  text-xs transition-all duration-300
                  ${isActive 
                    ? 'font-bold tracking-wide drop-shadow-sm' 
                    : 'font-medium tracking-normal'
                  }
                `}>
                  {label}
                </span>

                {/* Efecto de resplandor en hover para elementos activos */}
                {isActive && (
                  <div className={`absolute inset-0 rounded-2xl opacity-30 blur-sm -z-10
                    ${isEmergency ? 'bg-red-200' : 
                      isChat ? 'bg-pink-200' : 
                      'bg-rose-200'}
                  `} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Sombra inferior para efecto de elevación */}
        <div className="absolute -bottom-4 left-4 right-4 h-4 bg-gradient-to-t from-gray-900/5 to-transparent rounded-b-2xl blur-sm" />
      </nav>
    </>
  );
};

export default Navigation;