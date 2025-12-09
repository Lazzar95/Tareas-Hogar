export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center relative overflow-hidden">
      {/* Blobs decorativos */}
      <div className="blob blob-mint w-72 h-72 -top-20 -left-20" />
      <div className="blob blob-lavender w-96 h-96 -bottom-32 -right-32" />
      
      <div className="text-center relative z-10 animate-fade-in">
        <div className="relative inline-block mb-6">
          <div className="text-8xl animate-float">🏠</div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/5 rounded-full blur-sm" />
        </div>
        
        {/* Spinner elegante */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-mint-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-lavender-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-coral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        
        <p className="text-gray-500 font-medium">Cargando tu hogar...</p>
      </div>
    </div>
  );
}
