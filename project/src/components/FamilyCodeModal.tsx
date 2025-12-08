import { useState } from 'react';

interface FamilyCodeModalProps {
  familyCode: string;
  onClose: () => void;
}

export default function FamilyCodeModal({ familyCode, onClose }: FamilyCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(familyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/80 animate-scale-in">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Código de tu hogar
          </h2>
          <p className="text-gray-600">
            Comparte este código para que otros se unan
          </p>
        </div>

        <div className="bg-white/70 rounded-2xl p-6 mb-6 text-center border border-gray-200">
          <p className="text-5xl font-mono font-bold text-orange-500 tracking-wider">
            {familyCode}
          </p>
        </div>

        <button
          onClick={copyCode}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold mb-4 shadow-lg hover:shadow-xl transition-all"
        >
          {copied ? '✓ Copiado' : 'Copiar código'}
        </button>

        <button
          onClick={onClose}
          className="w-full bg-white/70 py-4 rounded-xl font-semibold text-gray-600 hover:text-gray-800 transition-colors border border-gray-200"
        >
          Cerrar
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          También lo encontrarás en el header tocando el código
        </p>
      </div>
    </div>
  );
}
