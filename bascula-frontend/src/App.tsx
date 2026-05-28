import React, { useState } from 'react';
import ScaleSimulator from './components/ScaleSimulator';
import ReportsDashboard from './components/reports/ReportsDashboard';

const App: React.FC = () => {
  // refreshTrigger actúa como un estado global ligero para avisar
  // al componente derecho que el izquierdo insertó un dato y ocupa refrescar.
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRegistroExitoso = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* NAVBAR SUPERIOR */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/src/assets/image.png" alt="Logo Impresos Múltiples" className="h-10 object-contain" />
          
          <div className="border-l-2 border-gray-200 pl-4">
            <h1 className="text-xl font-bold tracking-tight text-[#002855]">IM <span className="font-light">Sistemas</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Simulador de Control de Pesaje</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            CONECTADO A SQL SERVER
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: SIMULADOR DE HARDWARE (Ocupa 2/3) */}
        <div className="lg:col-span-2 relative h-[750px]">
          <ScaleSimulator onRegistroExitoso={handleRegistroExitoso} />
        </div>

        {/* COLUMNA DERECHA: REPORTES DINÁMICOS Y DB (Ocupa 1/3) */}
        <div className="lg:col-span-1">
          <ReportsDashboard refreshTrigger={refreshTrigger} />
        </div>
        
      </div>
    </div>
  );
};

export default App;