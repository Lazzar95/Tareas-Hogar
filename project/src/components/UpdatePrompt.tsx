interface UpdatePromptProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

export default function UpdatePrompt({ onUpdate, onDismiss }: UpdatePromptProps) {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="glass-card-strong max-w-md rounded-3xl p-4 shadow-xl border-2 border-mint-400/50">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-mint-500 to-mint-400 flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm">Nueva versión disponible</p>
            <p className="text-xs text-gray-600 mt-0.5">Actualiza para obtener las últimas mejoras</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onDismiss}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Luego
            </button>
            <button
              onClick={onUpdate}
              className="px-4 py-2 bg-gradient-to-r from-mint-500 to-mint-400 text-white font-semibold text-sm rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
