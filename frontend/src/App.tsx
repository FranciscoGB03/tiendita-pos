import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Tiendita POS - Frontend
        </h1>
        <p className="text-gray-700">
          React + Vite + TypeScript + Tailwind CSS funcionando correctamente.
        </p>
        <button className="mt-6 px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors" onClick={() => alert('¡Botón de prueba funcionando!')}>
          Botón de Prueba (Tailwind OK)
        </button>
      </div>
    </div>
  )
}

export default App
