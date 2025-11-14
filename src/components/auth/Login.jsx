import { useState } from 'react';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Card } from '../shared/Card';
import { Alert } from '../shared/Alert';
import { validarLogin } from '../../utils/validators';
import { loginUsuario } from '../../services/authService';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const navigate = useNavigate(); 
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos
    const erroresValidacion = validarLogin(email, password);
    setErrores(erroresValidacion);
    
    if (Object.keys(erroresValidacion).length > 0) {
      return;
    }
    
    // Login con Firebase
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });
    
    const resultado = await loginUsuario(email, password);
    
    setLoading(false);
    
    if (resultado.success) {
      login(resultado.user);
      setMensaje({ tipo: 'success', texto: '¡Inicio de sesión exitoso!' });
      
      // Esperar 1 segundo y navegar al dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setMensaje({ tipo: 'error', texto: resultado.error });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-600 mt-2">Sistema de Pagos Universitarios</p>
        </div>

        {mensaje.texto && (
          <Alert 
            type={mensaje.tipo}
            message={mensaje.texto}
            onClose={() => setMensaje({ tipo: '', texto: '' })}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errores.email}
            required
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errores.password}
            helperText="Mínimo 6 caracteres"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Login;