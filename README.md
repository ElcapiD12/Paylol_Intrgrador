# 💳 PAYLOL – Sistema de Pagos Escolares

**PAYLOL** es una aplicación web desarrollada para gestionar pagos escolares de forma eficiente, segura y visualmente clara. Está construida con React, Tailwind CSS y Firebase, y sigue buenas prácticas de diseño modular, accesibilidad y componentes reutilizables.

---

## 🚀 Tecnologías principales

- **React 19** – Librería principal para construir interfaces de usuario.
- **Vite** – Herramienta de desarrollo rápida y moderna.
- **Tailwind CSS** – Framework de estilos utilitarios.
- **Firebase** – Autenticación y base de datos en tiempo real.
- **React Router DOM** – Navegación entre páginas.
- **React Icons** – Íconos SVG reutilizables.
- **Clsx** – Composición de clases condicionales.

---

## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/paylol.git
   cd paylol
Instala las dependencias:

bash
npm install
Inicia el servidor de desarrollo:

bash
npm run dev


📁 Estructura del proyecto
Código
src/
├── assets/              # Imágenes, fuentes, estilos
│   └── styles/theme.css # Tokens visuales globales
├── components/          # Componentes reutilizables
│   └── servicios-escolares/shared/ # Botón, Modal, Alert, etc.
├── context/             # Contextos globales (Auth, etc.)
├── data/                # Datos estáticos o simulados
├── layouts/             # Estructuras de página
├── pages/               # Vistas principales
├── services/            # Funciones de API y Firebase
├── utils/               # Funciones auxiliares
├── App.jsx              # Componente raíz
├── main.jsx             # Punto de entrada
├── index.css            # Estilos base + Tailwind



📚 Documentación técnica

COMPONENTES.md: Uso detallado de los componentes compartidos.

theme.css: Archivo con variables CSS para colores, bordes, sombras y tipografía.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Paylolme
