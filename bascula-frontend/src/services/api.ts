import axios from 'axios';

const API_BASE_URL = 'http://localhost:5176/api/bascula';

export interface ScaleInputDto {
  peso: number;
  unidadOrigen: 'kg' | 'lb';
}

export interface RegistroPeso {
  id: number;
  pesoKg: number;
  pesoLb: number;
  unidadOrigen: string;
  fechaRegistro: string;
}

// Función para enviar la simulación del peso al Backend
export const registrarPeso = async (data: ScaleInputDto): Promise<RegistroPeso | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/registrar`, data);
    return response.data.data;
  } catch (error) {
    console.error('Error al registrar el peso:', error);
    throw error;
  }
};

// Función para obtener el historial/reportes
export const obtenerReportes = async (desde?: string, hasta?: string): Promise<RegistroPeso[]> => {
  try {
    let url = `${API_BASE_URL}/reportes?`;
    if (desde) url += `desde=${desde}&`;
    if (hasta) url += `hasta=${hasta}&`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    throw error;
  }
};
