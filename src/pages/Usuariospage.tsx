import React, { useEffect, useState } from "react";
import { getUsuarios, crearUsuario } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/card";

interface Usuario {
  id?: number;
  nombre: string;
  email: string;
}

const UsuariosPage: React.FC = () => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar usuarios al montar
  useEffect(() => {
    getUsuarios()
      .then(setUsuarios)
      .catch((err) => console.error("Error cargando usuarios:", err));
  }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Debes iniciar sesión para crear usuarios.");
      return;
    }

    try {
      setLoading(true);
      const nuevo = await crearUsuario(nombre, email);
      setUsuarios([...usuarios, { nombre, email }]);
      setNombre("");
      setEmail("");
      alert("Usuario creado con éxito ✅");
    } catch (err) {
      console.error("Error creando usuario:", err);
      alert("Error al crear usuario ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {usuarios.length === 0 ? (
            <p>No hay usuarios registrados.</p>
          ) : (
            <ul className="list-disc pl-5">
              {usuarios.map((u, index) => (
                <li key={index}>
                  {u.nombre} - {u.email}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crear Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCrear} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Usuario"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsuariosPage;
