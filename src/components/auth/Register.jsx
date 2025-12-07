import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ELIMINADA: import { Button } from '../shared/Button'; // Usaremos <button> nativo
import  Input  from '../shared/Input';
import  Card  from '../shared/Card';
import  Alert  from '../shared/Alert';
import  Select  from '../shared/Select';
import { useAuth } from '../../context/AuthContext';
import { registrarUsuario } from '../../services/authService';
import { crearUsuario } from '../../services/userService';
import { validarRegistro } from '../../utils/validators';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    matricula: '',
    carrera: '',
    cuatrimestre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });

  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const carreras = [
    { value: '', label: 'Selecciona una carrera' },
    { value: 'sistemas', label: 'Ingeniería en Desarrollo de Sofware' },
    { value: 'industrial', label: 'Ingeniería Industrial' },
    { value: 'mecatronica', label: 'Ingeniería Mecatrónica' },
    { value: 'arquitectura', label: 'Electromovilidad' },
    { value: 'administracion', label: 'Administración de Empresas' }
  ];

  const semestres = [
    { value: '', label: 'Selecciona cuatrimestre' },
    { value: '1', label: '1er Cuatrimestre' },
    { value: '2', label: '2do Cuatrimestre' },
    { value: '3', label: '3er Cuatrimestre' },
    { value: '4', label: '4to Cuatrimestre' },
    { value: '5', label: '5to Cuatrimestre' },
    { value: '6', label: '6to Cuatrimestre' },
    { value: '7', label: '7mo Cuatrimestre' },
    { value: '8', label: '8vo Cuatrimestre' },
    { value: '9', label: '9no Cuatrimestre' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errores[e.target.name]) {
      setErrores({ ...errores, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresValidacion = validarRegistro(formData);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;

    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const resultadoAuth = await registrarUsuario(formData.email, formData.password);
      if (!resultadoAuth.success) {
        setMensaje({ tipo: 'error', texto: resultadoAuth.error });
        setLoading(false);
        return;
      }

      const resultadoUser = await crearUsuario(formData.email, {
        nombre: formData.nombre,
        matricula: formData.matricula,
        carrera: formData.carrera,
        cuatrimestre: parseInt(formData.cuatrimestre),
        email: formData.email
      });

      if (resultadoUser.success) {
        login(resultadoAuth.user);
        setMensaje({ tipo: 'success', texto: '¡Registro exitoso! Redirigiendo...' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMensaje({ tipo: 'error', texto: 'Error al guardar datos del usuario' });
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error inesperado. Intenta nuevamente' });
    }

    setLoading(false);
  };

  return (
    // CAMBIO 1: Aplicar las clases del Dark Mode Institucional (original-bg)
    <div className="fixed inset-0 flex items-center justify-center original-bg p-4 overflow-y-auto">
      {/* CAMBIO 2: Aplicar las clases del Dark Mode Institucional (original-card) */}
      <Card className="w-full max-w-2xl original-card shadow-2xl animate-fadeIn px-8 py-10 rounded-xl my-8">
        <div className="text-center mb-6">
          {/* CAMBIO 3: Usar la clase del título oscuro */}
          <h2 className="text-3xl original-title mb-1">Crear Cuenta</h2>
          {/* CAMBIO 4: Usar el estilo del subtítulo (gris claro) */}
          <p className="text-lg original-subtitle mt-2">
            <span className="font-normal">PAY-LOL</span>
          </p>
        </div>

        {mensaje.texto && (
          <Alert type={mensaje.tipo} message={mensaje.texto} className="mb-4" />
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* CAMBIO 5: Agregar text-white al label y original-input a los campos */}
            <Input label={<span className="text-white">Nombre Completo *</span>} name="nombre" type="text" placeholder="Juan Pérez García"
              value={formData.nombre} onChange={handleChange} error={errores.nombre} required 
              className="original-input" />

            <Input label={<span className="text-white">Matrícula *</span>} name="matricula" type="text" placeholder="2024001"
              value={formData.matricula} onChange={handleChange} error={errores.matricula} required 
              className="original-input" />

            {/* NOTA: Asegúrate de que el componente Select aplique correctamente las clases de input */}
            <Select label={<span className="text-white">Carrera *</span>} name="carrera" options={carreras}
              value={formData.carrera} onChange={handleChange} error={errores.carrera} required 
              className="original-input" />

            <Select label={<span className="text-white">Cuatrimestre *</span>} name="cuatrimestre" options={semestres}
              value={formData.cuatrimestre} onChange={handleChange} error={errores.cuatrimestre} required 
              className="original-input" />

            <Input label={<span className="text-white">Correo Electrónico *</span>} name="email" type="email" placeholder="tu@utma.edu.mx"
              value={formData.email} onChange={handleChange} error={errores.email} required className="md:col-span-2 original-input" />

            <Input label={<span className="text-white">Contraseña *</span>} name="password" type="password" placeholder="••••••••"
              value={formData.password} onChange={handleChange} error={errores.password} 
              helperText={<span className="text-gray-400 text-xs">Mínimo 6 caracteres</span>} required 
              className="original-input" />

            <Input label={<span className="text-white">Confirmar Contraseña *</span>} name="confirmarPassword" type="password" placeholder="••••••••"
              value={formData.confirmarPassword} onChange={handleChange} error={errores.confirmarPassword} required 
              className="original-input" />
          </div>

          {/* CAMBIO 6: Reemplazar <Button> por <button> nativo y usar la clase del botón principal */}
          <button
            type="submit"
            className="w-full font-semibold btn-original-primary text-white py-3 px-4 rounded-md transition duration-300 mt-6" 
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm original-subtitle">
            ¿Ya tienes cuenta?{' '}
            {/* CAMBIO 7: Usar la clase del enlace (Registrate aquí) */}
            <button 
              onClick={() => navigate('/')}
              className="font-medium text-sm btn-original-link-text"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Register;