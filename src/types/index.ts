export interface User {
  id: string;
  username: string;
  role: 'admin' | 'chofer';
  nombre: string;
}

export interface Vehicle {
  id: string;
  patente: string;
  marca: string;
  modelo: string;
  tipo: 'camion' | 'maquinaria' | 'auto' | 'moto';
  capacidadTanque: number;
  activo: boolean;
}

export interface Chofer {
  id: string;
  nombre: string;
  apellido: string;
  ci: string;
  licencia: string;
  activo: boolean;
}

export interface CargaCombustible {
  id: string;
  vehiculoId: string;
  choferId: string;
  litrosCargados: number;
  kilometrosIniciales: number;
  kilometrosFinales: number;
  fecha: string;
  hora: string;
  estacionServicio: string;
  precio: number;
  observaciones?: string;
  usuario: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalLitros: number;
  totalVehiculos: number;
  totalCargas: number;
  consumoPromedio: number;
  gastoTotal: number;
  eficienciaPromedio: number;
}