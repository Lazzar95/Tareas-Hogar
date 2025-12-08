export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-4 animate-pulse">🏠</div>
        <p className="text-gray-600 font-medium">Cargando...</p>
      </div>
    </div>
  );
}
