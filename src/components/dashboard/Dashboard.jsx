import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { obtenerUsuario } from '../../services/userService';
import { obtenerPagos } from '../../services/pagosService';
import Header from './Header';
import PaymentCards from './PaymentCards';
import RecentPayments from './RecentPayments';
import PaymentChart from './PaymentChart';
import Notifications from './Notifications';
import PaymentHistory from './PaymentHistory';
import PaymentStats from './PaymentStats';

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        console.log('Usuario actual:', currentUser.email);
        
        const resultUsuario = await obtenerUsuario(currentUser.email);
        if (resultUsuario.success) {
          setUsuario(resultUsuario.data);
        }

        const resultPagos = await obtenerPagos(currentUser.email);
        console.log('Pagos obtenidos:', resultPagos);
        
        if (resultPagos.success) {
          setPagos(resultPagos.data);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Header nombreUsuario={usuario?.nombre || 'Usuario'} />
      
      <main className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <Notifications pagos={pagos} />
          <PaymentCards pagos={pagos} />
          <PaymentStats pagos={pagos} />
          
          <div className="mt-8">
            <PaymentChart pagos={pagos} />
          </div>

          <div className="mt-8">
            <RecentPayments pagos={pagos} />
          </div>

          <div className="mt-8">
            <PaymentHistory pagos={pagos} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;