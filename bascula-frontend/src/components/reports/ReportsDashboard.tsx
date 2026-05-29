import React, { useEffect, useState } from 'react';
import { History, AlertCircle, FileSpreadsheet, FileText, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { obtenerReportes, type RegistroPeso } from '../../services/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportsDashboardProps {
  refreshTrigger: number;
}

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ refreshTrigger }) => {
  const [registros, setRegistros] = useState<RegistroPeso[]>([]);
  const [desde, setDesde] = useState<string>('');
  const [hasta, setHasta] = useState<string>('');
  const [cargando, setCargando] = useState(false);

  const fetchRegistros = async () => {
    setCargando(true);
    try {
      const data = await obtenerReportes(desde, hasta);
      setRegistros(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchRegistros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleFiltrar = () => {
    fetchRegistros();
  };

  const exportarExcel = () => {
    if(registros.length === 0) return alert("No hay datos para exportar");
    const dataAExportar = registros.map(r => ({
      ID: r.id,
      'Fecha y Hora': new Date(r.fechaRegistro).toLocaleString(),
      'Kilos (KG)': r.pesoKg,
      'Libras (LB)': r.pesoLb,
      'Ingresado En': r.unidadOrigen.toUpperCase()
    }));
    const ws = XLSX.utils.json_to_sheet(dataAExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte_Báscula");
    XLSX.writeFile(wb, `Reporte_Bascula_${new Date().toLocaleDateString()}.xlsx`);
  };

  const exportarPDF = () => {
    if(registros.length === 0) return alert("No hay datos para exportar");
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("IMPRESOS MÚLTIPLES - REPORTE DE BÁSCULA", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 30);
    
    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Fecha y Hora', 'Kilos (KG)', 'Libras (LB)']],
      body: registros.map(r => [
        r.id.toString(), 
        new Date(r.fechaRegistro).toLocaleString(), 
        `${r.pesoKg} kg`, 
        `${r.pesoLb} lb`
      ]),
      headStyles: { fillColor: [0, 40, 85] } 
    });
    
    doc.save("Reporte_Bascula.pdf");
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[750px]">
      {/* Header y Filtros */}
      <div className="p-6 border-b border-gray-50 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={20} className="text-[#002855]" />
            <h2 className="font-bold text-gray-700">Historial DB</h2>
          </div>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{registros.length} registros</span>
        </div>
        
        {/* Filtros */}
        <div className="flex gap-2 text-sm items-end">
          <div className="flex-1">
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Desde</label>
            <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg outline-none focus:border-[#002855]" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Hasta</label>
            <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg outline-none focus:border-[#002855]" />
          </div>
          <button onClick={handleFiltrar} className="bg-[#002855] text-white p-2.5 rounded-lg hover:bg-[#003d82] transition-colors">
            <Search size={18} />
          </button>
        </div>

        {/* Exportaciones */}
        <div className="flex gap-2 pt-2">
          <button onClick={exportarExcel} className="flex-1 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button onClick={exportarPDF} className="flex-1 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
            <FileText size={16} /> PDF
          </button>
        </div>
      </div>

      {/* Lista de Registros */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
        {cargando ? (
          <div className="flex justify-center py-10"><span className="animate-pulse text-gray-400 font-bold">Consultando Servidor...</span></div>
        ) : (
          <AnimatePresence>
            {registros.map((reg) => (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-xs text-gray-400 font-bold">{new Date(reg.fechaRegistro).toLocaleDateString()}</p>
                  <p className="text-sm font-medium text-gray-600">{new Date(reg.fechaRegistro).toLocaleTimeString()}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-lg font-black text-[#002855]">{reg.pesoKg} <span className="text-[10px] text-gray-400">KG</span></p>
                  <p className="text-sm font-bold text-gray-400">{reg.pesoLb} <span className="text-[10px] text-gray-300">LB</span></p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!cargando && registros.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 min-h-[200px]">
            <AlertCircle size={40} strokeWidth={1} />
            <p className="text-sm italic">Base de datos vacía en este rango</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;
