// src/components/admin/PagosAdmin.jsx
import React, { useState, useEffect } from 'react';
import { 
  obtenerConfiguracion, 
  actualizarConfiguracion,
  obtenerPrecioPorCuatrimestre,
  generarFechaVencimiento
} from '../../services/configuracionService';
import { 
  obtenerAlumnos, 
  buscarAlumnos, 
  filtrarAlumnos,
  obtenerCarreras 
} from '../../services/usuariosService';
import { 
  crearPago, 
  verificarPagoDuplicado,
  obtenerTodosPagos,
  obtenerEstadisticasPagos,
  obtenerHistorialAlumno
} from '../../services/pagosService';

function PagosAdmin() {
  // ========== ESTADO ==========
  
  // Configuración de precios
  const [config, setConfig] = useState({
    mensualidad_1_5: 5000,
    inscripcion_1_5: 1200,
    mensualidad_6: 6000,
    inscripcion_6: 1500,
    mensualidad_7_10: 7000,
    inscripcion_7_10: 1800,
    recargo: 50,
    diaCorte: 15
  });
  
  // Alumnos
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);
  const [carreras, setCarreras] = useState([]);
  
  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [carreraFiltro, setCarreraFiltro] = useState('todas');
  const [cuatrimestreFiltro, setCuatrimestreFiltro] = useState('todos');
  
  // Pagos
  const [pagosAsignados, setPagosAsignados] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  
  // UI
  const [vistaActual, setVistaActual] = useState('configuracion'); // 'configuracion', 'asignar', 'historial', 'estadisticas'
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [pagoAConfirmar, setPagoAConfirmar] = useState(null);
  const [alumnoSeleccionadoHistorial, setAlumnoSeleccionadoHistorial] = useState(null);
  const [historialAlumno, setHistorialAlumno] = useState([]);
  
  // Mes y año para asignar pagos
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
  
  // ========== EFECTOS ==========
  
  useEffect(() => {
    cargarDatosIniciales();
  }, []);
  
  useEffect(() => {
    aplicarFiltros();
  }, [busqueda, carreraFiltro, cuatrimestreFiltro, alumnos]);
  
  // ========== FUNCIONES DE CARGA ==========
  
  const cargarDatosIniciales = async () => {
    setCargando(true);
    try {
      console.log('Iniciando carga de datos...');
      
      // Cargar configuración
      const configResult = await obtenerConfiguracion();
      console.log('Configuración:', configResult);
      if (configResult.success) {
        setConfig(configResult.data);
      }
      
      // Cargar alumnos
      console.log('Cargando alumnos...');
      const alumnosResult = await obtenerAlumnos();
      console.log('Resultado alumnos:', alumnosResult);
      console.log('Total alumnos:', alumnosResult.data?.length);
      
      if (alumnosResult.success) {
        setAlumnos(alumnosResult.data);
        setAlumnosFiltrados(alumnosResult.data);
      } else {
        console.error('Error al cargar alumnos:', alumnosResult.error);
        alert('Error al cargar alumnos: ' + alumnosResult.error);
      }
      
      // Cargar carreras
      const carrerasResult = await obtenerCarreras();
      console.log('Carreras:', carrerasResult);
      if (carrerasResult.success) {
        setCarreras(carrerasResult.data);
      }
      
      // Cargar estadísticas
      await cargarEstadisticas();
      
      // Cargar pagos asignados
      await cargarPagosAsignados();
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos: ' + error.message);
    } finally {
      setCargando(false);
    }
  };
  
  const cargarEstadisticas = async () => {
    const result = await obtenerEstadisticasPagos();
    if (result.success) {
      setEstadisticas(result.data);
    }
  };
  
  const cargarPagosAsignados = async () => {
    const result = await obtenerTodosPagos();
    if (result.success) {
      setPagosAsignados(result.data);
    }
  };
  
  // ========== FILTROS ==========
  
  const aplicarFiltros = async () => {
    const result = await filtrarAlumnos({
      busqueda,
      carrera: carreraFiltro,
      cuatrimestre: cuatrimestreFiltro
    });
    
    if (result.success) {
      setAlumnosFiltrados(result.data);
    }
  };
  
  // ========== CONFIGURACIÓN ==========
  
  const guardarConfiguracion = async () => {
    setProcesando(true);
    try {
      const result = await actualizarConfiguracion(config, 'admin');
      
      if (result.success) {
        alert('Configuración guardada exitosamente');
      } else {
        alert('Error al guardar configuración');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar configuración');
    } finally {
      setProcesando(false);
    }
  };
  
  // ========== ASIGNACIÓN DE PAGOS ==========
  
  const asignarPago = async (tipoPago) => {
    if (alumnosSeleccionados.length === 0) {
      alert("Por favor, selecciona al menos un alumno.");
      return;
    }
    
    // Validar que no haya duplicados
    setProcesando(true);
    const alumnosValidos = [];
    const alumnosConDuplicados = [];
    
    try {
      console.log(' Iniciando asignación de pago:', tipoPago);
      console.log('Alumnos seleccionados:', alumnosSeleccionados);
      
      for (const alumnoId of alumnosSeleccionados) {
        const alumno = alumnos.find(a => a.id === alumnoId);
        console.log(' Procesando alumno:', alumno?.nombre, 'Cuatrimestre:', alumno?.cuatrimestre);
        
        if (!alumno) {
          console.error('Alumno no encontrado:', alumnoId);
          continue;
        }
        
        // Obtener precio según cuatrimestre
        const cuatrimestre = alumno.cuatrimestre || 1;
        const tipoPrecio = tipoPago === 'Mensualidad' ? 'mensualidad' : 'inscripcion';
        
        console.log('Obteniendo precio para cuatrimestre:', cuatrimestre, 'tipo:', tipoPrecio);
        
        const precioResult = await obtenerPrecioPorCuatrimestre(
          cuatrimestre,
          tipoPrecio
        );
        
        console.log('Resultado precio:', precioResult);
        
        if (!precioResult.success) {
          console.error('Error al obtener precio:', precioResult.error);
          alert(`Error al obtener precio para ${alumno.nombre}: ${precioResult.error}`);
          continue;
        }
        
        // Verificar duplicados
        const mes = `${meses[mesSeleccionado]} ${anioSeleccionado}`;
        console.log('Verificando duplicados para mes:', mes);
        
        const duplicadoResult = await verificarPagoDuplicado(
          alumnoId,
          tipoPago === 'Mensualidad' ? 'colegiatura' : 'inscripcion',
          mes
        );
        
        console.log('Resultado duplicado:', duplicadoResult);
        
        if (duplicadoResult.tieneDuplicado) {
          alumnosConDuplicados.push(alumno.nombre);
        } else {
          alumnosValidos.push({
            alumno,
            precio: precioResult.precio
          });
        }
      }
      
      console.log('Alumnos válidos:', alumnosValidos.length);
      console.log('Alumnos con duplicados:', alumnosConDuplicados.length);
      
      if (alumnosConDuplicados.length > 0) {
        const confirmacion = window.confirm(
          `Los siguientes alumnos ya tienen este pago pendiente:\n\n${alumnosConDuplicados.join('\n')}\n\n¿Deseas continuar con los demás?`
        );
        
        if (!confirmacion && alumnosValidos.length === 0) {
          setProcesando(false);
          return;
        }
      }
      
      if (alumnosValidos.length === 0) {
        alert('No hay alumnos válidos para asignar el pago.');
        setProcesando(false);
        return;
      }
      
      // Calcular total
      const total = alumnosValidos.reduce((sum, item) => sum + item.precio, 0);
      
      const nuevoPago = {
        concepto: tipoPago,
        tipo: tipoPago === 'Mensualidad' ? 'colegiatura' : 'inscripcion',
        mes: `${meses[mesSeleccionado]} ${anioSeleccionado}`,
        alumnosValidos,
        total,
        fecha: new Date().toLocaleDateString('es-MX')
      };
      
      setPagoAConfirmar(nuevoPago);
      setMostrarConfirmacion(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la asignación');
    } finally {
      setProcesando(false);
    }
  };
  
  const confirmarAsignacion = async () => {
    setProcesando(true);
    
    try {
      // Generar fecha de vencimiento
      const fechaVencResult = await generarFechaVencimiento(
        mesSeleccionado + 1,
        anioSeleccionado
      );
      
      if (!fechaVencResult.success) {
        throw new Error('No se pudo generar fecha de vencimiento');
      }
      
      const promesas = pagoAConfirmar.alumnosValidos.map(async ({ alumno, precio }) => {
        const pagoData = {
          userId: alumno.id,
          alumnoNombre: alumno.nombre,
          alumnoMatricula: alumno.matricula || 'S/M',
          alumnoCarrera: alumno.carrera || 'Sin carrera',
          alumnoCuatrimestre: alumno.cuatrimestre || 1,
          concepto: `${pagoAConfirmar.concepto} ${pagoAConfirmar.mes}`,
          tipo: pagoAConfirmar.tipo,
          monto: precio.toString(),
          fechaVencimiento: fechaVencResult.fecha,
          estado: 'pendiente',
          asignadoPor: 'admin',
          fechaAsignacion: new Date().toISOString()
        };
        
        return await crearPago(pagoData);
      });
      
      const resultados = await Promise.all(promesas);
      const exitosos = resultados.filter(r => r.success).length;
      
      if (exitosos === pagoAConfirmar.alumnosValidos.length) {
        alert(
          `${pagoAConfirmar.concepto} asignada exitosamente\n\n` +
          `Alumnos: ${exitosos}\n` +
          `Total: $${pagoAConfirmar.total.toLocaleString()} MXN\n` +
          `Vencimiento: ${fechaVencResult.fecha}\n\n` +
          `Los pagos están disponibles en las cuentas de los alumnos.`
        );
        
        // Recargar datos
        await cargarPagosAsignados();
        await cargarEstadisticas();
        setAlumnosSeleccionados([]);
      } else {
        alert(`Solo ${exitosos} de ${pagoAConfirmar.alumnosValidos.length} pagos se asignaron.`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al asignar pagos.');
    } finally {
      setProcesando(false);
      setMostrarConfirmacion(false);
      setPagoAConfirmar(null);
    }
  };
  
  // ========== HISTORIAL ==========
  
  const verHistorialAlumno = async (alumno) => {
    setAlumnoSeleccionadoHistorial(alumno);
    const result = await obtenerHistorialAlumno(alumno.id);
    if (result.success) {
      setHistorialAlumno(result.data);
    }
  };
  
  // ========== SELECCIÓN ==========
  
  const toggleAlumno = (alumnoId) => {
    if (alumnosSeleccionados.includes(alumnoId)) {
      setAlumnosSeleccionados(alumnosSeleccionados.filter(id => id !== alumnoId));
    } else {
      setAlumnosSeleccionados([...alumnosSeleccionados, alumnoId]);
    }
  };
  
  const toggleTodos = () => {
    if (alumnosSeleccionados.length === alumnosFiltrados.length) {
      setAlumnosSeleccionados([]);
    } else {
      setAlumnosSeleccionados(alumnosFiltrados.map(a => a.id));
    }
  };
  
  // ========== RENDER ==========
  
  if (cargando) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-semibold">Cargando datos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">🏢</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración de Pagos</h1>
          <p className="text-gray-600">Gestiona precios, asigna pagos y consulta historial</p>
        </div>
      </div>
      
      {/* Navegación */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setVistaActual('configuracion')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            vistaActual === 'configuracion'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ⚙️ Configuración
        </button>
        <button
          onClick={() => setVistaActual('asignar')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            vistaActual === 'asignar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Asignar Pagos
        </button>
        <button
          onClick={() => setVistaActual('historial')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            vistaActual === 'historial'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📋 Historial
        </button>
        <button
          onClick={() => setVistaActual('estadisticas')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            vistaActual === 'estadisticas'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Estadísticas
        </button>
      </div>
      
      {/* Vista de Configuración */}
      {vistaActual === 'configuracion' && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">⚙️ Configuración de Precios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cuatrimestres 1-5 */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-blue-600">Cuatrimestres 1-5</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mensualidad</label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l">$</span>
                    <input
                      type="number"
                      value={config.mensualidad_1_5}
                      onChange={(e) => setConfig({...config, mensualidad_1_5: Number(e.target.value)})}
                      className="flex-1 p-2 border rounded-r"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Inscripción</label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l">$</span>
                    <input
                      type="number"
                      value={config.inscripcion_1_5}
                      onChange={(e) => setConfig({...config, inscripcion_1_5: Number(e.target.value)})}
                      className="flex-1 p-2 border rounded-r"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cuatrimestre 6 (TSU) */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-green-600">Cuatrimestre 6 (TSU)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mensualidad</label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l">$</span>
                    <input
                      type="number"
                      value={config.mensualidad_6}
                      onChange={(e) => setConfig({...config, mensualidad_6: Number(e.target.value)})}
                      className="flex-1 p-2 border rounded-r"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Inscripción</label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l">$</span>
                    <input
                      type="number"
                      value={config.inscripcion_6}
                      onChange={(e) => setConfig({...config, inscripcion_6: Number(e.target.value)})}
                      className="flex-1 p-2 border rounded-r"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cuatrimestres 7-10 (Ingeniería) */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-purple-600">Cuatrimestres 7-10 (Ingeniería)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mensualidad</label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l">$</span>
                    <input
                      type="number"
                      value={config.mensualidad_7_10}
                      onChange={(e) => setConfig({...config, mensualidad_7_10: Number(e.target.value)})}
                      className="flex-1 p-2 border rounded-r"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Inscripción</label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l">$</span>
                    <input
                      type="number"
                      value={config.inscripcion_7_10}
                      onChange={(e) => setConfig({...config, inscripcion_7_10: Number(e.target.value)})}
                      className="flex-1 p-2 border rounded-r"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Configuración adicional */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-orange-600">Configuración Adicional</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Recargo por pago tardío</label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l">$</span>
                    <input
                      type="number"
                      value={config.recargo}
                      onChange={(e) => setConfig({...config, recargo: Number(e.target.value)})}
                      className="flex-1 p-2 border rounded-r"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Día de corte mensual</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={config.diaCorte}
                    onChange={(e) => setConfig({...config, diaCorte: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Día del mes en que vencen los pagos</p>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={guardarConfiguracion}
            disabled={procesando}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {procesando ? '⏳ Guardando...' : '💾 Guardar Configuración'}
          </button>
        </div>
      )}
      
      {/* Vista de Asignar Pagos */}
      {vistaActual === 'asignar' && (
        <div>
          {/* Filtros y búsqueda */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Buscar y Filtrar Alumnos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Buscar por nombre, matrícula o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              
              <select
                value={carreraFiltro}
                onChange={(e) => setCarreraFiltro(e.target.value)}
                className="p-3 border rounded-lg"
              >
                <option value="todas">Todas las carreras</option>
                {carreras.map(carrera => (
                  <option key={carrera} value={carrera}>{carrera}</option>
                ))}
              </select>
              
              <select
                value={cuatrimestreFiltro}
                onChange={(e) => setCuatrimestreFiltro(e.target.value)}
                className="p-3 border rounded-lg"
              >
                <option value="todos">Todos los cuatrimestres</option>
                {[1,2,3,4,5,6,7,8,9,10].map(c => (
                  <option key={c} value={c}>Cuatrimestre {c}</option>
                ))}
              </select>
            </div>
            
            <p className="text-sm text-gray-600 mt-3">
              Mostrando {alumnosFiltrados.length} de {alumnos.length} alumnos
            </p>
          </div>
          
          {/* Selección de período */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Seleccionar Período</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mes</label>
                <select
                  value={mesSeleccionado}
                  onChange={(e) => setMesSeleccionado(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                >
                  {meses.map((mes, index) => (
                    <option key={index} value={index}>{mes}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Año</label>
                <select
                  value={anioSeleccionado}
                  onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                >
                  {[2024, 2025, 2026, 2027].map(anio => (
                    <option key={anio} value={anio}>{anio}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Lista de alumnos */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Seleccionar Alumnos</h2>
              <button
                onClick={toggleTodos}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {alumnosSeleccionados.length === alumnosFiltrados.length
                  ? 'Deseleccionar todos'
                  : 'Seleccionar todos'}
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              {alumnosFiltrados.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No se encontraron alumnos con los filtros aplicados
                </div>
              ) : (
                alumnosFiltrados.map(alumno => (
                  <div
                    key={alumno.id}
                    className="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={alumnosSeleccionados.includes(alumno.id)}
                      onChange={() => toggleAlumno(alumno.id)}
                      className="mr-3 h-5 w-5"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{alumno.nombre}</div>
                      <div className="text-sm text-gray-500">
                        {alumno.matricula || 'S/M'} • {alumno.carrera || 'Sin carrera'} • Cuatri {alumno.cuatrimestre || 1}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="font-medium">
                {alumnosSeleccionados.length} alumno(s) seleccionado(s)
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                onClick={() => asignarPago('Mensualidad')}
                disabled={alumnosSeleccionados.length === 0 || procesando}
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                Asignar Mensualidad
              </button>
              
              <button
                onClick={() => asignarPago('Inscripción')}
                disabled={alumnosSeleccionados.length === 0 || procesando}
                className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                📝 Asignar Inscripción
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Vista de Historial */}
      {vistaActual === 'historial' && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">📋 Historial de Pagos</h2>
          
          {!alumnoSeleccionadoHistorial ? (
            <div>
              <p className="text-gray-600 mb-4">Selecciona un alumno para ver su historial completo</p>
              
              <div className="max-h-96 overflow-y-auto border rounded-lg">
                {alumnos.map(alumno => (
                  <div
                    key={alumno.id}
                    className="flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer"
                    onClick={() => verHistorialAlumno(alumno)}
                  >
                    <div>
                      <div className="font-medium">{alumno.nombre}</div>
                      <div className="text-sm text-gray-500">
                        {alumno.matricula || 'S/M'} • {alumno.email}
                      </div>
                    </div>
                    <span className="text-blue-600">Ver historial →</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setAlumnoSeleccionadoHistorial(null)}
                className="mb-4 text-blue-600 hover:text-blue-800"
              >
                ← Volver a lista de alumnos
              </button>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-lg">{alumnoSeleccionadoHistorial.nombre}</h3>
                <p className="text-sm text-gray-600">
                  {alumnoSeleccionadoHistorial.matricula || 'S/M'} • {alumnoSeleccionadoHistorial.email}
                </p>
                <p className="text-sm text-gray-600">
                  {alumnoSeleccionadoHistorial.carrera || 'Sin carrera'} • Cuatrimestre {alumnoSeleccionadoHistorial.cuatrimestre || 1}
                </p>
              </div>
              
              {historialAlumno.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📭</div>
                  <p className="text-gray-600">No hay pagos registrados para este alumno</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left">Concepto</th>
                        <th className="p-3 text-left">Monto</th>
                        <th className="p-3 text-left">Asignado</th>
                        <th className="p-3 text-left">Vencimiento</th>
                        <th className="p-3 text-left">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historialAlumno.map(pago => (
                        <tr key={pago.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{pago.concepto}</td>
                          <td className="p-3 font-bold text-blue-700">${pago.monto}</td>
                          <td className="p-3 text-sm text-gray-600">
                            {new Date(pago.fechaAsignacion).toLocaleDateString('es-MX')}
                          </td>
                          <td className="p-3 text-sm">
                            {pago.fechaVencimiento}
                          </td>
                          <td className="p-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              pago.estado === 'pagado'
                                ? 'bg-green-100 text-green-800'
                                : pago.estado === 'vencido'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {pago.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Vista de Estadísticas */}
      {vistaActual === 'estadisticas' && estadisticas && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-sm text-gray-600 mb-2">Total de Pagos</div>
              <div className="text-3xl font-bold text-blue-600">{estadisticas.total}</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-sm text-gray-600 mb-2">Pendientes</div>
              <div className="text-3xl font-bold text-yellow-600">{estadisticas.pendientes}</div>
              <div className="text-sm text-gray-500 mt-1">${estadisticas.montoPendiente.toLocaleString()}</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-sm text-gray-600 mb-2">Pagados</div>
              <div className="text-3xl font-bold text-green-600">{estadisticas.pagados}</div>
              <div className="text-sm text-gray-500 mt-1">${estadisticas.montoPagado.toLocaleString()}</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-sm text-gray-600 mb-2">Vencidos</div>
              <div className="text-3xl font-bold text-red-600">{estadisticas.vencidos}</div>
              <div className="text-sm text-gray-500 mt-1">${estadisticas.montoVencido.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">📋 Todos los Pagos Asignados</h2>
            
            {pagosAsignados.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-600">No hay pagos asignados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Alumno</th>
                      <th className="p-3 text-left">Concepto</th>
                      <th className="p-3 text-left">Monto</th>
                      <th className="p-3 text-left">Asignado</th>
                      <th className="p-3 text-left">Vencimiento</th>
                      <th className="p-3 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagosAsignados.map(pago => (
                      <tr key={pago.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium">{pago.alumnoNombre}</div>
                          <div className="text-sm text-gray-500">{pago.alumnoMatricula}</div>
                        </td>
                        <td className="p-3">{pago.concepto}</td>
                        <td className="p-3 font-bold text-blue-700">${pago.monto}</td>
                        <td className="p-3 text-sm text-gray-600">
                          {new Date(pago.fechaAsignacion).toLocaleDateString('es-MX')}
                        </td>
                        <td className="p-3 text-sm">{pago.fechaVencimiento}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            pago.estado === 'pagado'
                              ? 'bg-green-100 text-green-800'
                              : pago.estado === 'vencido'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {pago.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Modal de Confirmación */}
      {mostrarConfirmacion && pagoAConfirmar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Confirmar Asignación</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-medium">Vas a asignar:</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">
                  {pagoAConfirmar.concepto} {pagoAConfirmar.mes}
                </p>
                <p className="text-gray-600 mt-2">
                  A {pagoAConfirmar.alumnosValidos.length} alumno(s)
                </p>
                <p className="font-bold text-lg mt-2">
                  Total: ${pagoAConfirmar.total.toLocaleString()} MXN
                </p>
              </div>
              
              <div className="mb-4 max-h-40 overflow-y-auto border rounded-lg p-3">
                <p className="font-medium text-sm mb-2">Alumnos:</p>
                {pagoAConfirmar.alumnosValidos.map(({ alumno, precio }) => (
                  <div key={alumno.id} className="text-sm py-1 border-b last:border-b-0">
                    <span className="font-medium">{alumno.nombre}</span>
                    <span className="text-gray-500 ml-2">- ${precio.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setMostrarConfirmacion(false);
                    setPagoAConfirmar(null);
                  }}
                  disabled={procesando}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarAsignacion}
                  disabled={procesando}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {procesando ? '⏳ Procesando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PagosAdmin;