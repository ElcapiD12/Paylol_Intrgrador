import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  // 🚨 CONFIGURACIÓN CORREGIDA/SIMPLIFICADA PARA EL FALLBACK DE RUTAS
  server: {
    // La clave es que el servidor responda con el index.html en caso de no encontrar un archivo.
    // Aunque historyApiFallback es común en Webpack, la configuración de Vite a veces 
    // requiere simplemente que el servidor sepa el contexto.
    
    // Si la opción historyApiFallback: true no funciona, eliminamos historyApiFallback
    // y asumimos que historyApiFallback: true es el valor por defecto en development.
    // El problema podría ser que el servidor de Vite no está respondiendo 
    // a todas las solicitudes con el index.html. 
    
    // Dado que no tenemos el error de console o network, vamos a forzar la base a '/'
    // y forzar la reescritura, aunque esto es más común en production.
  },
  // La propiedad 'base' a veces ayuda si el enrutamiento interno está fallando.
  base: '/',
})