import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileSpreadsheet, 
  FileText, 
  Scale, 
  RefreshCw, 
  Database,
  History,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Registro {
  id: number;
  valor: string;
  fecha: string;
  hora: string;
}

const App: React.FC = () => {
  const [pesoActual, setPesoActual] = useState<string>("0.00");
  const [historial, setHistorial] = useState<Registro[]>([]);
  const [conectado, setConectado] = useState<boolean>(false);

  const API_URL = "https://localhost:7009/api/peso";

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get<{ pesoActual: string }>(API_URL);
        setPesoActual(response.data.pesoActual);
        setConectado(true);
      } catch (err) {
        setConectado(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const guardarRegistro = () => {
    const nuevo: Registro = {
      id: Date.now(),
      valor: pesoActual,
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
    };
    setHistorial([nuevo, ...historial]);
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(historial);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pesajes");
    XLSX.writeFile(wb, `Reporte_Pesaje_${new Date().toLocaleDateString()}.xlsx`);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("IMPRESOS MÚLTIPLES - REPORTE DE PESAJE", 14, 22);
    doc.setFontSize(11);
    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 30);
    
    autoTable(doc, {
      startY: 35,
      head: [['Fecha', 'Hora', 'Peso (KG)']],
      body: historial.map(r => [r.fecha, r.hora, `${r.valor} KG`]),
      headStyles: { fillColor: [0, 40, 85] } 
    });
    
    doc.save("Reporte_Pesaje.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* NAVBAR SUPERIOR CON LOGO */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          {/* Aquí cargamos tu logo. Asegúrate de tener logo.png en la carpeta public */}
          <img src="/src/assets/image.png" alt="Logo Impresos Múltiples" className="h-10 object-contain" />
          
          <div className="border-l-2 border-gray-200 pl-4">
            <h1 className="text-xl font-bold tracking-tight text-[#002855]">IM <span className="font-light">Sistemas</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Control de Pesaje Industrial</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${conectado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <div className={`w-2 h-2 rounded-full ${conectado ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {conectado ? 'SISTEMA ONLINE' : 'BÁSCULA DESCONECTADA'}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: PESO EN VIVO */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Scale size={150} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Lectura en Tiempo Real</span>
                <RefreshCw className={`text-gray-300 ${conectado ? 'animate-spin' : ''}`} size={20} />
              </div>
              
              <div className="flex flex-col items-center py-6">
                <motion.span 
                  key={pesoActual}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="text-9xl font-black text-[#002855] tabular-nums"
                >
                  {pesoActual}
                </motion.span>
                <span className="text-3xl font-bold text-gray-400 mt-2">KILOGRAMOS</span>
              </div>

              <button 
                onClick={guardarRegistro}
                disabled={!conectado}
                className="w-full mt-8 bg-[#002855] hover:bg-[#003d82] disabled:bg-gray-200 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <Database size={24} />
                REGISTRAR EN BASE DE DATOS
              </button>
            </div>
          </motion.div>

          <div className="flex gap-4">
            <button 
              onClick={exportarExcel}
              className="flex-1 bg-white border border-gray-200 hover:border-green-500 hover:text-green-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <FileSpreadsheet size={20} /> Exportar Excel
            </button>
            <button 
              onClick={exportarPDF}
              className="flex-1 bg-white border border-gray-200 hover:border-red-500 hover:text-red-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <FileText size={20} /> Generar PDF
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
            <div className="p-6 border-b border-gray-50 flex items-center gap-2">
              <History size={20} className="text-[#002855]" />
              <h2 className="font-bold text-gray-700">Últimos Registros</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {historial.map((reg) => (
                  <motion.div
                    key={reg.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xs text-gray-400 font-bold">{reg.fecha}</p>
                      <p className="text-sm font-medium text-gray-600">{reg.hora}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-[#002855]">{reg.valor}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">KG</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {historial.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                  <AlertCircle size={40} strokeWidth={1} />
                  <p className="text-sm italic">Sin registros previos</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;