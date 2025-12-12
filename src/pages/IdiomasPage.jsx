// src/pages/IdiomasPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistroLibros from '../components/idiomas/RegistroLibros';
import ExamenesOxford from '../components/idiomas/ExamenesOxford';
import Resultados from '../components/idiomas/Resultados';

export default function IdiomasPage() {
  const [activeTab, setActiveTab] = useState('libros');
  const navigate = useNavigate();

  const tabs = [
    { id: 'libros', label: 'Libros', icon: '📚' },
    { id: 'examenes', label: 'Exámenes', icon: '📝' },
    { id: 'resultados', label: 'Resultados', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Centro de Idiomas
            </h1>
            <p className="text-gray-600 mt-1">
              Compra libros y registra tus exámenes de certificación
            </p>
          </div>

          {/* ✅ Botón para ir a Vista Admin */}
          <button
            onClick={() => navigate('/dashboard/admin-idiomas')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Vista Admin
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {activeTab === 'libros' && <RegistroLibros />}
          {activeTab === 'examenes' && <ExamenesOxford />}
          {activeTab === 'resultados' && <Resultados />}
        </div>
      </div>
    </div>
  );
}
