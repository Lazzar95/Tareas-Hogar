import { useState } from 'react';

interface FamilyCodeModalProps {
  familyCode: string;
  onClose: () => void;
}

export default function FamilyCodeModal({ familyCode, onClose }: FamilyCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(familyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback para dispositivos sin clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = familyCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tareas Hogar',
          text: `¡Únete a mi hogar! Usa el código: ${familyCode}`,
          url: window.location.href
        });
      } catch {
        // Usuario canceló el share
      }
    } else {
      copyCode();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-card-strong p-8 max-w-sm w-full animate-scale-in relative overflow-hidden">
        {/* Blob decorativo */}
        <div className="blob blob-lavender w-48 h-48 -top-24 -right-24" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-lavender-400 to-lavender-500 flex items-center justify-center text-4xl shadow-glow-lavender mx-auto mb-6 animate-bounce-soft">
              🔗
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">
              Código de tu hogar
            </h2>
            <p className="text-gray-500 text-sm">
              Comparte este código para que otros se unan
            </p>
          </div>

          {/* Código destacado */}
          <div className="glass-card p-6 mb-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-lavender-50 to-mint-50 opacity-50" />
            <p className="relative text-4xl font-mono font-bold text-gradient tracking-[0.3em]">
              {familyCode}
            </p>
          </div>

          {/* Nota de ayuda */}
          <div className="bg-mint-50 border border-mint-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-600 text-center">
              <strong className="text-mint-700">💡 Tip:</strong> Copia y pega el código para evitar errores.
              <br />Los códigos solo usan letras y números (no símbolos).
            </p>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={shareCode}
              className="btn-lavender w-full"
            >
              {copied ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ¡Copiado!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Compartir código
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="btn-secondary w-full"
            >
              Cerrar
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            💡 El código está siempre visible en el header
          </p>
        </div>
      </div>
    </div>
  );
}
