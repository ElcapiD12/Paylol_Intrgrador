import { useState } from 'react';
import Input from '../shared/Input';
import Card from '../shared/Card';
import Alert from '../shared/Alert';
import { validarLogin } from '../../utils/validators';
import { loginUsuario } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_DEFAULT_ROUTE } from '../../utils/constants';

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

    const erroresValidacion = validarLogin(email, password);
    setErrores(erroresValidacion);

    if (Object.keys(erroresValidacion).length > 0) return;

    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const resultado = await loginUsuario(email, password);

      if (resultado.success) {
        // ✅ Llamar login para actualizar el contexto inmediatamente
        login(resultado.user);
        
        setMensaje({ tipo: 'success', texto: '¡Inicio de sesión exitoso!' });

        setTimeout(() => {
          const rol = resultado.user.rol || "alumno";
          const ruta = ROLE_DEFAULT_ROUTE[rol] || "/dashboard";
          navigate(ruta);
        }, 1000);
      } else {
        setMensaje({ tipo: 'error', texto: resultado.error });
      }
    } catch (error) {
      console.error("Error en login:", error);
      setMensaje({ tipo: 'error', texto: 'Error inesperado al iniciar sesión' });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center original-bg">
      <Card className="w-full max-w-sm original-card px-8 py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl original-title mb-1">Iniciar Sesión</h2>
          <p className="text-lg original-subtitle">
            <span className="font-normal">PAY-LOL</span>
          </p>
        </div>

        {mensaje.texto && (
          <Alert
            type={mensaje.tipo}
            message={mensaje.texto}
            onClose={() => setMensaje({ tipo: '', texto: '' })}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={<span className="text-white">Correo Electrónico *</span>} 
            type="email"
            placeholder="tu@utma.edu.mx" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errores.email}
            required
            className="original-input"
          />

          <Input
            label={<span className="text-white">Contraseña *</span>} 
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errores.password}
            helperText={<span className="text-gray-400 text-xs">Mínimo 6 caracteres</span>} 
            required
            className="original-input"
          />

          <button
            type="submit"
            className="w-full font-semibold btn-original-primary text-white py-3 px-4 rounded-md transition duration-300" 
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'} 
          </button>
        </form>

        <div className="mt-5 text-center flex items-center justify-center">
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-sm btn-original-secondary bg-transparent hover:bg-transparent" 
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div className="mt-8 text-center flex justify-center items-center">
          <p className="text-gray-400 mr-2 text-sm">
            ¿No tienes cuenta?
          </p>
          <button
            onClick={() => navigate('/register')}
            className="font-medium text-sm btn-original-link-text"
          >
            Regístrate aquí
          </button>
        </div>
      </Card>
    </div>
  );
}

export default Login;