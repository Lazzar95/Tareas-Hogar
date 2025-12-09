import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function useServiceWorkerUpdate() {
  const [showUpdate, setShowUpdate] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('SW Registered:', registration);
      
      // Verificar actualizaciones cada 60 segundos
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60000);
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowUpdate(true);
    }
  }, [needRefresh]);

  const update = async () => {
    await updateServiceWorker(true);
    setShowUpdate(false);
    setNeedRefresh(false);
  };

  const dismiss = () => {
    setShowUpdate(false);
    setNeedRefresh(false);
  };

  return {
    showUpdate,
    update,
    dismiss,
  };
}
