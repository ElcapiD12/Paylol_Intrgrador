import React from 'react';
import ExtraordinariosList from './components/jefaturas/ExtraordinariosList.jsx';
import CalendarioExamenes from './components/jefaturas/CalendarioExamenes.jsx';
import Autorizaciones from './components/jefaturas/Autorizaciones.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Sistema de Exámenes Extraordinarios
        </h1>
      </header>

      <main className="space-y-12">
        {/* Lista de extraordinarios */}
        <section>
          <ExtraordinariosList />
        </section>

        {/* Calendario de exámenes */}
        <section>
          <CalendarioExamenes />
        </section>

        {/* Autorizaciones */}
        <section>
          <Autorizaciones />
        </section>
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        © 2025 Sistema de Jefaturas
      </footer>
    </div>
  );
}

export default App;
