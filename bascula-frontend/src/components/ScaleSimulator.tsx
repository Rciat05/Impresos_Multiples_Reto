import React, { useState } from 'react';
import { Database, Scale } from 'lucide-react';
import UnitToggle from './UnitToggle';
import { registrarPeso, type ScaleInputDto } from '../services/api';

interface ScaleSimulatorProps {
  onRegistroExitoso: () => void;
}

const ScaleSimulator: React.FC<ScaleSimulatorProps> = ({ onRegistroExitoso }) => {
  const [peso, setPeso] = useState<string>('0.00');
  const [unidad, setUnidad] = useState<'kg' | 'lb'>('kg');
  const [cargando, setCargando] = useState(false);

  const handleGuardar = async () => {
    const valorNum = parseFloat(peso);
    if (!peso || isNaN(valorNum) || valorNum <= 0) {
      alert("Por favor, ingresa un peso válido mayor a 0.");
      return;
    }

    setCargando(true);
    try {
      const data: ScaleInputDto = {
        peso: valorNum,
        unidadOrigen: unidad
      };
      await registrarPeso(data);
      onRegistroExitoso();
      setPeso('0.00'); // Limpiar el simulador
    } catch (error) {
      alert("Error al guardar el registro en el servidor SQL.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 pb-36 relative overflow-hidden flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Scale size={150} />
      </div>

      <div className="relative z-10 w-full mb-8">
        <div className="flex justify-between items-start mb-8">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Simulador de Lectura</span>
        </div>
        
        {/* Toggle Integrado */}
        <UnitToggle unidad={unidad} onChange={setUnidad} />

        <div className="flex flex-col items-center py-12">
          {/* Input Manual Simulando el Hardware */}
          <input 
            type="number"
            className="w-full text-center text-8xl md:text-9xl font-black text-[#002855] bg-transparent outline-none border-b-4 border-transparent hover:border-gray-100 focus:border-[#002855] transition-colors tabular-nums pb-2"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          <span className="text-3xl font-bold text-gray-400 mt-4 transition-all">
            {unidad === 'kg' ? 'KILOGRAMOS' : 'LIBRAS'}
          </span>
        </div>
      </div>

      <div className="relative z-10 w-full">
        <button 
          onClick={handleGuardar}
          disabled={cargando}
          className="w-full bg-[#002855] hover:bg-[#003d82] disabled:bg-gray-400 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {cargando ? (
            <span className="animate-pulse">Guardando...</span>
          ) : (
            <>
              <Database size={24} /> Registrar peso
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ScaleSimulator;
