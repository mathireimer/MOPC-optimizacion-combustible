import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { mockCargas, mockVehicles, mockChoferes } from '../data/mockData';
import { CargaCombustible } from '../types';
import { Search, Filter, Download, Edit, Eye, Calendar, Fuel } from 'lucide-react';

const HistorialCargas = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarga, setSelectedCarga] = useState<CargaCombustible | null>(null);

  // Filter data based on user role
  const filteredCargas = mockCargas.filter(carga => {
    if (user?.role === 'chofer') {
      // Choferes only see their own records
      const chofer = mockChoferes.find(c => c.nombre === user.nombre.split(' ')[0]);
      return carga.choferId === chofer?.id;
    }
    return true; // Admins see all records
  });

  // Apply search filter
  const searchedCargas = filteredCargas.filter(carga => {
    const vehicle = mockVehicles.find(v => v.id === carga.vehiculoId);
    const chofer = mockChoferes.find(c => c.id === carga.choferId);
    
    return (
      vehicle?.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chofer?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chofer?.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carga.estacionServicio.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getVehicleInfo = (vehiculoId: string) => {
    return mockVehicles.find(v => v.id === vehiculoId);
  };

  const getChoferInfo = (choferId: string) => {
    return mockChoferes.find(c => c.id === choferId);
  };

  const calculateConsumption = (carga: CargaCombustible) => {
    const distance = carga.kilometrosFinales - carga.kilometrosIniciales;
    if (distance > 0) {
      return (carga.litrosCargados / distance * 100).toFixed(2);
    }
    return '0.00';
  };

  const getVehicleTypeBadge = (tipo: string) => {
    const colors = {
      camion: 'bg-primary/10 text-primary',
      maquinaria: 'bg-secondary/10 text-secondary',
      auto: 'bg-success/10 text-success',
      moto: 'bg-warning/10 text-warning'
    };
    return colors[tipo as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Historial de Cargas</h1>
            <p className="text-muted-foreground">
              {user?.role === 'admin' ? 'Todas las cargas registradas' : 'Sus cargas registradas'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por patente, chofer, estación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline" className="px-3 py-2">
              {searchedCargas.length} registro{searchedCargas.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="w-5 h-5 text-primary" />
            Registros de Carga
          </CardTitle>
          <CardDescription>
            Historial completo de cargas de combustible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Chofer</TableHead>
                  <TableHead>Litros</TableHead>
                  <TableHead>Kilómetros</TableHead>
                  <TableHead>Consumo</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estación</TableHead>
                  {user?.role === 'admin' && <TableHead>Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchedCargas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={user?.role === 'admin' ? 9 : 8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Fuel className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No se encontraron registros</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  searchedCargas.map((carga) => {
                    const vehicle = getVehicleInfo(carga.vehiculoId);
                    const chofer = getChoferInfo(carga.choferId);
                    return (
                      <TableRow key={carga.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{carga.fecha}</p>
                            <p className="text-sm text-muted-foreground">{carga.hora}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{vehicle?.patente}</p>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getVehicleTypeBadge(vehicle?.tipo || '')}`}
                              >
                                {vehicle?.tipo}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {vehicle?.marca} {vehicle?.modelo}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{chofer?.nombre} {chofer?.apellido}</p>
                            <p className="text-sm text-muted-foreground">CI: {chofer?.ci}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-bold text-primary">{carga.litrosCargados}L</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">{carga.kilometrosIniciales.toLocaleString()} km</p>
                            <p className="text-sm">{carga.kilometrosFinales.toLocaleString()} km</p>
                            <p className="text-xs text-muted-foreground">
                              Δ {(carga.kilometrosFinales - carga.kilometrosIniciales).toLocaleString()} km
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-medium">{calculateConsumption(carga)}</p>
                            <p className="text-xs text-muted-foreground">L/100km</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-right">
                            <p className="font-bold">₲ {carga.precio.toLocaleString('es-PY')}</p>
                            <p className="text-xs text-muted-foreground">
                              ₲ {(carga.precio / carga.litrosCargados).toFixed(0)}/L
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{carga.estacionServicio}</p>
                        </TableCell>
                        {user?.role === 'admin' && (
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Total de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{searchedCargas.length}</div>
            <p className="text-sm text-muted-foreground">
              {user?.role === 'admin' ? 'En todo el sistema' : 'Sus registros'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Total Litros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {searchedCargas.reduce((sum, carga) => sum + carga.litrosCargados, 0).toLocaleString()}L
            </div>
            <p className="text-sm text-muted-foreground">Combustible cargado</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Gasto Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">
              ₲ {searchedCargas.reduce((sum, carga) => sum + carga.precio, 0).toLocaleString('es-PY')}
            </div>
            <p className="text-sm text-muted-foreground">En combustible</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistorialCargas;