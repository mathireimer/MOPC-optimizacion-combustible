import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Fuel, Truck, Users, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { mockCargas, mockVehicles, mockChoferes, generateMockChartData } from '../data/mockData';
import { DashboardMetrics } from '../types';

const Dashboard = () => {
  // Calculate metrics from mock data
  const calculateMetrics = (): DashboardMetrics => {
    const totalLitros = mockCargas.reduce((sum, carga) => sum + carga.litrosCargados, 0);
    const totalCargas = mockCargas.length;
    const totalVehiculos = mockVehicles.filter(v => v.activo).length;
    const gastoTotal = mockCargas.reduce((sum, carga) => sum + carga.precio, 0);
    
    // Calculate average consumption
    const totalKilometers = mockCargas.reduce((sum, carga) => 
      sum + (carga.kilometrosFinales - carga.kilometrosIniciales), 0
    );
    const consumoPromedio = totalKilometers > 0 ? totalLitros / totalKilometers * 100 : 0;
    const eficienciaPromedio = totalLitros > 0 ? totalKilometers / totalLitros : 0;

    return {
      totalLitros,
      totalVehiculos,
      totalCargas,
      consumoPromedio,
      gastoTotal,
      eficienciaPromedio
    };
  };

  const metrics = calculateMetrics();
  const chartData = generateMockChartData();

  const vehicleTypeData = [
    { name: 'Camiones', value: 2, color: '#0EA5E9' },
    { name: 'Maquinaria', value: 1, color: '#DC2626' },
  ];

  const metricCards = [
    {
      title: 'Total Litros Cargados',
      value: `${metrics.totalLitros.toLocaleString('es-PY')} L`,
      description: 'Este mes',
      icon: Fuel,
      color: 'text-primary'
    },
    {
      title: 'Vehículos Activos',
      value: metrics.totalVehiculos.toString(),
      description: 'En funcionamiento',
      icon: Truck,
      color: 'text-success'
    },
    {
      title: 'Total de Cargas',
      value: metrics.totalCargas.toString(),
      description: 'Registros este mes',
      icon: TrendingUp,
      color: 'text-warning'
    },
    {
      title: 'Gasto Total',
      value: `₲ ${metrics.gastoTotal.toLocaleString('es-PY')}`,
      description: 'En combustible',
      icon: DollarSign,
      color: 'text-secondary'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Resumen del control de combustible</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumption Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Consumo Mensual</CardTitle>
            <CardDescription>Litros cargados por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="litros" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Types */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Distribución de Vehículos</CardTitle>
            <CardDescription>Por tipo de vehículo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Consumo Promedio</CardTitle>
            <CardDescription>Litros por 100 km</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {metrics.consumoPromedio.toFixed(1)} L/100km
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Eficiencia Promedio</CardTitle>
            <CardDescription>Kilómetros por litro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {metrics.eficienciaPromedio.toFixed(1)} km/L
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-warning/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Alertas
            </CardTitle>
            <CardDescription>Situaciones que requieren atención</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">✓</span> Todos los vehículos operativos
              </div>
              <div className="text-sm">
                <span className="font-medium">✓</span> Consumo dentro de rangos normales
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Últimas Cargas Registradas</CardTitle>
          <CardDescription>Actividad reciente del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCargas.slice(0, 3).map((carga) => {
              const vehicle = mockVehicles.find(v => v.id === carga.vehiculoId);
              const chofer = mockChoferes.find(c => c.id === carga.choferId);
              return (
                <div key={carga.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Fuel className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {vehicle?.patente} - {carga.litrosCargados}L
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {chofer?.nombre} {chofer?.apellido} • {carga.fecha} {carga.hora}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₲ {carga.precio.toLocaleString('es-PY')}</p>
                    <p className="text-sm text-muted-foreground">{carga.estacionServicio}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;