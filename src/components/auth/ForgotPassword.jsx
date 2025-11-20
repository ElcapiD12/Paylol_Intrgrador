import { useState } from 'react';
import { Input } from '../shared/Input';
import { Card } from '../shared/Card';
import { Alert } from '../shared/Alert';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMensaje({
        tipo: 'success',
        texto: 'Se ha enviado un correo para restablecer tu contraseña'
      });

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: 'Error al enviar correo. Verifica que el email sea correcto'
      });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center original-bg">
      <Card className="w-full max-w-md original-card shadow-xl rounded-xl px-8 py-10 animate-fadeIn">
        <div className="text-center mb-6">
          <h2 className="text-3xl original-title">Recuperar Contraseña</h2>
          <p className="original-subtitle mt-2 text-sm">
            Te enviaremos un correo para restablecer tu contraseña
          </p>
        </div>

        {mensaje.texto && (
          <Alert
            type={mensaje.tipo}
            message={mensaje.texto}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={<span className="text-white">Correo Electrónico *</span>}
            type="email"
            placeholder="tu@utma.edu.mx"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="original-input"
          />

          {/* Botón principal (Enviar Correo) */}
          <button
            type="submit"
            className="w-full font-semibold btn-original-primary text-white py-3 px-4 rounded-md transition duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Correo'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="btn-original-link-text text-sm"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </Card>
    </div>
  );
}

export default ForgotPassword;