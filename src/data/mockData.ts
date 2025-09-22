import { Vehicle, Chofer, CargaCombustible, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    nombre: 'Administrador MOPC'
  },
  {
    id: '2',
    username: 'chofer1',
    role: 'chofer',
    nombre: 'Juan Pérez'
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    patente: 'MOV-001',
    marca: 'Mercedes-Benz',
    modelo: 'Actros 2644',
    tipo: 'camion',
    capacidadTanque: 400,
    activo: true
  },
  {
    id: '2',
    patente: 'MOV-002',
    marca: 'Caterpillar',
    modelo: '320D',
    tipo: 'maquinaria',
    capacidadTanque: 250,
    activo: true
  },
  {
    id: '3',
    patente: 'MOV-003',
    marca: 'Toyota',
    modelo: 'Hilux',
    tipo: 'camion',
    capacidadTanque: 80,
    activo: true
  }
];

export const mockChoferes: Chofer[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    ci: '1234567-8',
    licencia: 'C',
    activo: true
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'González',
    ci: '2345678-9',
    licencia: 'B',
    activo: true
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'López',
    ci: '3456789-0',
    licencia: 'C',
    activo: true
  }
];

export const mockCargas: CargaCombustible[] = [
  {
    id: '1',
    vehiculoId: '1',
    choferId: '1',
    litrosCargados: 200,
    kilometrosIniciales: 45000,
    kilometrosFinales: 45500,
    fecha: '2024-01-15',
    hora: '08:30',
    estacionServicio: 'Shell Ruta 2',
    precio: 8200,
    observaciones: 'Carga completa',
    usuario: 'admin',
    createdAt: '2024-01-15T08:30:00Z'
  },
  {
    id: '2',
    vehiculoId: '2',
    choferId: '2',
    litrosCargados: 150,
    kilometrosIniciales: 12000,
    kilometrosFinales: 12300,
    fecha: '2024-01-15',
    hora: '14:15',
    estacionServicio: 'Petrobras Centro',
    precio: 7500,
    usuario: 'chofer1',
    createdAt: '2024-01-15T14:15:00Z'
  },
  {
    id: '3',
    vehiculoId: '3',
    choferId: '3',
    litrosCargados: 60,
    kilometrosIniciales: 78000,
    kilometrosFinales: 78350,
    fecha: '2024-01-16',
    hora: '09:45',
    estacionServicio: 'COPETROL Norte',
    precio: 8800,
    usuario: 'admin',
    createdAt: '2024-01-16T09:45:00Z'
  }
];

export const generateMockChartData = () => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    litros: Math.floor(Math.random() * 1000) + 500,
    gastos: Math.floor(Math.random() * 8000000) + 3500000
  }));
};