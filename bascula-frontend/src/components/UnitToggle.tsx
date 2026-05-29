import React from 'react';
import { motion } from 'framer-motion';

interface UnitToggleProps {
  unidad: 'kg' | 'lb';
  onChange: (unidad: 'kg' | 'lb') => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unidad, onChange }) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-full w-64 mx-auto relative shadow-inner">
      {/* Botón visual para Kilos (kg) */}
      <div 
        className="flex-1 text-center py-2 relative z-10 cursor-pointer text-sm font-bold transition-colors duration-300 select-none"
        onClick={() => onChange('kg')}
        style={{ color: unidad === 'kg' ? '#ffffff' : '#9ca3af' }}
      >
        KILOGRS [KG]
      </div>
      
      {/* Botón visual para Libras (lb) */}
      <div 
        className="flex-1 text-center py-2 relative z-10 cursor-pointer text-sm font-bold transition-colors duration-300 select-none"
        onClick={() => onChange('lb')}
        style={{ color: unidad === 'lb' ? '#ffffff' : '#9ca3af' }}
      >
        LIBRAS [LB]
      </div>

      {/* Píldora animada flotante */}
      <motion.div
        className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-[#002855] rounded-full shadow-md z-0"
        animate={{ x: unidad === 'kg' ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    </div>
  );
};

export default UnitToggle;
