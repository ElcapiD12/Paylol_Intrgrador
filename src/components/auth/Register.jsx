import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../shared/Input';
import Card from '../shared/Card';
import Alert from '../shared/Alert';
import Select from '../shared/Select';
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
    { value: 'sistemas', label: 'Ingeniería en Desarrollo de Software' },
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

  // 🔧 Nuevo handleChange que soporta Input y Select
  const handleChange = (eOrOption) => {
    // Caso Input normal
    if (eOrOption?.target) {
      const { name, value } = eOrOption.target;
      setFormData({ ...formData, [name]: value });
      if (errores[name]) {
        setErrores({ ...errores, [name]: '' });
      }
    } else {
      // Caso Select (objeto {value, label})
      const { value } = eOrOption;
      if (carreras.some(opt => opt.value === value)) {
        setFormData({ ...formData, carrera: value });
        if (errores.carrera) setErrores({ ...errores, carrera: '' });
      } else if (semestres.some(opt => opt.value === value)) {
        setFormData({ ...formData, cuatrimestre: value });
        if (errores.cuatrimestre) setErrores({ ...errores, cuatrimestre: '' });
      }
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
      console.log("Creando usuario en Firebase Auth...");
      const resultadoAuth = await registrarUsuario(formData.email, formData.password);
      
      if (!resultadoAuth.success) {
        setMensaje({ tipo: 'error', texto: resultadoAuth.error });
        setLoading(false);
        return;
      }

      console.log("Usuario creado en Auth. UID:", resultadoAuth.user.uid);
      console.log("Guardando documento en Firestore: usuarios/" + resultadoAuth.user.uid);
      
      const resultadoUser = await crearUsuario(resultadoAuth.user.uid, {
        nombre: formData.nombre,
        matricula: formData.matricula,
        carrera: formData.carrera,
        cuatrimestre: parseInt(formData.cuatrimestre),
        email: formData.email,
        rol: "alumno"
      });

      if (resultadoUser.success) {
        console.log("Documento creado exitosamente en Firestore");
        
        login({
          uid: resultadoAuth.user.uid,
          email: formData.email,
          nombre: formData.nombre,
          matricula: formData.matricula,
          carrera: formData.carrera,
          cuatrimestre: parseInt(formData.cuatrimestre),
          rol: "alumno"
        });
        
        setMensaje({ tipo: 'success', texto: '¡Registro exitoso! Redirigiendo...' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        console.error("Error al guardar en Firestore:", resultadoUser.error);
        setMensaje({ tipo: 'error', texto: 'Error al guardar datos del usuario' });
      }
    } catch (error) {
      console.error("Error inesperado en registro:", error);
      setMensaje({ tipo: 'error', texto: 'Error inesperado. Intenta nuevamente' });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center original-bg p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl original-card shadow-2xl animate-fadeIn px-8 py-10 rounded-xl my-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl original-title mb-1">Crear Cuenta</h2>
          <p className="text-lg original-subtitle mt-2">
            <span className="font-normal">PAY-LOL</span>
          </p>
        </div>

        {mensaje.texto && (
          <Alert type={mensaje.tipo} message={mensaje.texto} className="mb-4" />
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label={<span className="text-white">Nombre Completo *</span>} 
              name="nombre" 
              type="text" 
              placeholder="Juan Pérez García"
              value={formData.nombre} 
              onChange={handleChange} 
              error={errores.nombre} 
              required 
              className="original-input" 
            />

            <Input 
              label={<span className="text-white">Matrícula *</span>} 
              name="matricula" 
              type="text" 
              placeholder="2024001"
              value={formData.matricula} 
              onChange={handleChange} 
              error={errores.matricula} 
              required 
              className="original-input" 
            />

            <Select 
            label={<span className="text-white">Carrera *</span>} 
            name="carrera" 
            options={carreras}
            value={formData.carrera} 
            onChange={handleChange} 
            error={errores.carrera} 
            required 
            className="bg-gray-700 text-white border-gray-500 rounded-lg"
          />

          <Select 
            label={<span className="text-white">Cuatrimestre *</span>} 
            name="cuatrimestre" 
            options={semestres}
            value={formData.cuatrimestre} 
            onChange={handleChange} 
            error={errores.cuatrimestre} 
            required 
            className="bg-gray-700 text-white border-gray-500 rounded-lg"
          />


            <Input 
              label={<span className="text-white">Correo Electrónico *</span>} 
              name="email" 
              type="email" 
              placeholder="tu@utma.edu.mx"
              value={formData.email} 
              onChange={handleChange} 
              error={errores.email} 
              required 
              className="md:col-span-2 original-input" 
            />

            <Input 
              label={<span className="text-white">Contraseña *</span>} 
              name="password" 
              type="password" 
              placeholder="••••••••"
              value={formData.password} 
              onChange={handleChange} 
              error={errores.password}
              helperText={<span className="text-gray-400 text-xs">Mínimo 6 caracteres</span>} 
              required 
              className="original-input" 
            />

            <Input 
              label={<span className="text-white">Confirmar Contraseña *</span>} 
              name="confirmarPassword" 
              type="password" 
              placeholder="••••••••"
              value={formData.confirmarPassword} 
              onChange={handleChange} 
              error={errores.confirmarPassword} 
              required 
              className="original-input" 
            />
          </div>

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