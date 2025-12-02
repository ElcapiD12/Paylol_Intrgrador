import { Link } from 'react-router-dom';

export default function ServiciosEscolares() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Servicios Escolares</h1>
        <p style={styles.subtitle}>
          Accede a trámites, constancias y seguimiento de solicitudes.
        </p>

        <div style={styles.grid}>
          {/* Solicitar constancia */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Solicitar Constancia</h3>
            <p style={styles.cardText}>
              Envía una solicitud de constancia con el tipo que necesites.
            </p>
            <button
              style={styles.button}
              onClick={() => (window.location.href = '/solicitud-constancia')}
            >
              Ir al formulario
            </button>
          </div>

          {/* Mis solicitudes */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Mis Solicitudes</h3>
            <p style={styles.cardText}>
              Consulta el estado de tus solicitudes de constancias.
            </p>
            <button
              style={styles.button}
              onClick={() => (window.location.href = '/mis-solicitudes')}
            >
              Ver solicitudes
            </button>
          </div>

          {/* Admin */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Administración</h3>
            <p style={styles.cardText}>
              Gestiona las solicitudes realizadas por los estudiantes.
            </p>
            <button
              style={styles.button}
              onClick={() => (window.location.href = '/admin-constancias')}
            >
              Administrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

//
// 🎨 Estilos nativos (sin tailwind)
//
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    padding: '40px 20px',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#111',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '17px',
    color: '#555',
    marginBottom: '30px',
  },
  grid: {
    display: 'grid',
    gap: '25px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  cardText: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '20px',
  },
  button: {
    width: '100%',
    padding: '10px 0',
    backgroundColor: '#0066ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
  },
};
