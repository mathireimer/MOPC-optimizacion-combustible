import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { mockVehicles, mockChoferes } from '../data/mockData';
import { Plus, Fuel } from 'lucide-react';

const RegistrarCarga = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vehiculoId: '',
    choferId: '',
    litrosCargados: '',
    kilometrosIniciales: '',
    kilometrosFinales: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    estacionServicio: '',
    precio: '',
    observaciones: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      const requiredFields = ['vehiculoId', 'choferId', 'litrosCargados', 'kilometrosIniciales', 'kilometrosFinales', 'estacionServicio', 'precio'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Campos requeridos",
          description: "Por favor complete todos los campos obligatorios",
          variant: "destructive",
        });
        return;
      }

      // Validate kilometers
      const kmIniciales = parseFloat(formData.kilometrosIniciales);
      const kmFinales = parseFloat(formData.kilometrosFinales);
      
      if (kmFinales <= kmIniciales) {
        toast({
          title: "Error en kilómetros",
          description: "Los kilómetros finales deben ser mayores a los iniciales",
          variant: "destructive",
        });
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this would be an API call to POST /cargas
      console.log('Registering fuel load:', {
        ...formData,
        usuario: user?.username,
        createdAt: new Date().toISOString()
      });

      toast({
        title: "Carga registrada exitosamente",
        description: `Se registraron ${formData.litrosCargados} litros para el vehículo seleccionado`,
        variant: "default",
      });

      // Reset form
      setFormData({
        vehiculoId: '',
        choferId: '',
        litrosCargados: '',
        kilometrosIniciales: '',
        kilometrosFinales: '',
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().slice(0, 5),
        estacionServicio: '',
        precio: '',
        observaciones: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar la carga de combustible",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistance = () => {
    if (formData.kilometrosIniciales && formData.kilometrosFinales) {
      const distance = parseFloat(formData.kilometrosFinales) - parseFloat(formData.kilometrosIniciales);
      return distance > 0 ? distance : 0;
    }
    return 0;
  };

  const calculateConsumption = () => {
    const distance = calculateDistance();
    const liters = parseFloat(formData.litrosCargados);
    if (distance > 0 && liters > 0) {
      return (liters / distance * 100).toFixed(2);
    }
    return '0.00';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Registrar Carga de Combustible</h1>
          <p className="text-muted-foreground">Complete todos los campos para registrar una nueva carga</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-primary" />
                Datos de la Carga
              </CardTitle>
              <CardDescription>
                Ingrese la información completa de la carga de combustible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehiculo">Vehículo *</Label>
                    <Select value={formData.vehiculoId} onValueChange={(value) => handleInputChange('vehiculoId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVehicles.filter(v => v.activo).map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.patente} - {vehicle.marca} {vehicle.modelo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chofer">Chofer *</Label>
                    <Select value={formData.choferId} onValueChange={(value) => handleInputChange('choferId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un chofer" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockChoferes.filter(c => c.activo).map((chofer) => (
                          <SelectItem key={chofer.id} value={chofer.id}>
                            {chofer.nombre} {chofer.apellido} - CI: {chofer.ci}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="litros">Litros Cargados *</Label>
                    <Input
                      id="litros"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={formData.litrosCargados}
                      onChange={(e) => handleInputChange('litrosCargados', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha *</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => handleInputChange('fecha', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hora">Hora *</Label>
                    <Input
                      id="hora"
                      type="time"
                      value={formData.hora}
                      onChange={(e) => handleInputChange('hora', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kmIniciales">Kilómetros Iniciales *</Label>
                    <Input
                      id="kmIniciales"
                      type="number"
                      placeholder="0"
                      value={formData.kilometrosIniciales}
                      onChange={(e) => handleInputChange('kilometrosIniciales', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kmFinales">Kilómetros Finales *</Label>
                    <Input
                      id="kmFinales"
                      type="number"
                      placeholder="0"
                      value={formData.kilometrosFinales}
                      onChange={(e) => handleInputChange('kilometrosFinales', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estacion">Estación de Servicio *</Label>
                    <Input
                      id="estacion"
                      type="text"
                      placeholder="Ej: Shell Ruta 2"
                      value={formData.estacionServicio}
                      onChange={(e) => handleInputChange('estacionServicio', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio Total (₲) *</Label>
                    <Input
                      id="precio"
                      type="number"
                      placeholder="0"
                      value={formData.precio}
                      onChange={(e) => handleInputChange('precio', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Información adicional (opcional)"
                    value={formData.observaciones}
                    onChange={(e) => handleInputChange('observaciones', e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="gradient"
                  disabled={isLoading}
                >
                  {isLoading ? "Registrando..." : "Registrar Carga"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Resumen de la Carga</CardTitle>
              <CardDescription>Cálculos automáticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Distancia recorrida:</span>
                <span className="font-medium">{calculateDistance()} km</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Consumo estimado:</span>
                <span className="font-medium">{calculateConsumption()} L/100km</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Precio por litro:</span>
                <span className="font-medium">
                  {formData.litrosCargados && formData.precio 
                    ? `₲ ${(parseFloat(formData.precio) / parseFloat(formData.litrosCargados || '1')).toFixed(0)}`
                    : '₲ 0'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Usuario:</span>
                <span className="font-medium">{user?.nombre}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-sm">Información</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Todos los campos marcados con (*) son obligatorios</p>
              <p>• Los kilómetros finales deben ser mayores a los iniciales</p>
              <p>• El registro quedará asociado a su usuario</p>
              <p>• Los datos se pueden editar posteriormente por administradores</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegistrarCarga;