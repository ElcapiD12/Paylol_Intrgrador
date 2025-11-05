import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import EstadoCuenta from "./EstadoCuenta";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6">
          <h1 className="text-2xl font-bold mb-4">Bienvenido al Dashboard</h1>
          <EstadoCuenta />
        </main>
      </div>
    </div>
  );
}
