# PAYLOL – Sistema de Pagos Escolares

**PAYLOL** es una aplicación web diseñada para la gestión de pagos escolares de forma eficiente, segura y clara. El proyecto está orientado a instituciones educativas que requieren control de pagos, visualización de información financiera y administración básica de usuarios.

La aplicación está construida con React, Tailwind CSS y Firebase, siguiendo buenas prácticas de arquitectura modular, reutilización de componentes y mantenibilidad del código.

---

## Tecnologías utilizadas

* **React 19** – Construcción de interfaces de usuario basadas en componentes.
* **Vite** – Entorno de desarrollo rápido y optimizado.
* **Tailwind CSS** – Sistema de estilos utilitarios.
* **Firebase** – Autenticación y base de datos.
* **React Router DOM** – Manejo de rutas y navegación.
* **Recharts** – Visualización de datos mediante gráficas.
* **jsPDF** – Generación de documentos PDF.
* **Lucide React** – Íconos SVG modernos.
* **React Icons** – Colección de íconos reutilizables.
* **Clsx** – Composición condicional de clases CSS.

---

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

* Node.js (versión 18 o superior recomendada)
* npm o yarn
* Git

---

## Instalación del proyecto

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/paylol.git
cd paylol
```

2. Instala las dependencias necesarias:

```bash
npm install jspdf
npm install recharts
npm install lucide-react
npm install react react-dom react-router-dom firebase clsx react-icons
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals @types/react @types/react-dom
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en el navegador en la URL indicada por Vite.

---

## Estructura del proyecto

```text
src/
├── assets/                   # Imágenes, fuentes y estilos
│   └── styles/theme.css      # Variables y tokens visuales globales
├── components/               # Componentes reutilizables
│   └── servicios-escolares/shared/  # Botón, Modal, Alert, etc.
├── context/                  # Contextos globales (autenticación, estado)
├── data/                     # Datos estáticos o simulados
├── layouts/                  # Estructuras base de las páginas
├── pages/                    # Vistas principales
├── services/                 # Servicios de Firebase y lógica de API
├── utils/                    # Funciones auxiliares
├── App.jsx                   # Componente raíz
├── main.jsx                  # Punto de entrada
├── index.css                 # Estilos base y configuración de Tailwind
```

---

## Flujo de trabajo con Git (Pull Request)

Si deseas contribuir al proyecto o realizar cambios mediante un pull request, sigue estos pasos:

1. Crea un fork del repositorio.
2. Clona tu fork en tu máquina local.
3. Antes de comenzar a trabajar, asegúrate de tener la última versión de la rama principal:

```bash
git checkout master
git pull origin master
```

4. Crea una nueva rama para tu cambio:

```bash
git checkout -b feature/nombre-del-cambio
```

5. Realiza los cambios necesarios asegurándote de mantener el estilo y estructura del proyecto.
6. Verifica que el proyecto compile y funcione correctamente:

```bash
npm run dev
```

7. Realiza un commit con un mensaje claro:

```bash
git commit -m "Descripción clara del cambio"
```

8. Sube la rama a tu fork:

```bash
git push origin feature/nombre-del-cambio
```

9. Abre un Pull Request hacia la rama principal del repositorio original.

---

## Actualizar tu rama local desde master

Si únicamente necesitas traer los últimos cambios del repositorio principal y estás trabajando directamente con la rama master:

```bash
git checkout master
git pull origin master
```

Si estás trabajando en otra rama y necesitas actualizarla con los cambios más recientes de master:

```bash
git fetch origin
git merge origin/master
```

Puedes verificar en qué rama te encuentras con:

```bash
git branch
```

Nota: en algunos repositorios la rama principal puede llamarse `main` en lugar de `master`. Verifícalo con:

```bash
git branch -r
```

## Documentación técnica

* **COMPONENTES.md**: Guía de uso y propiedades de los componentes compartidos.
* **theme.css**: Definición de colores, tipografía, bordes, sombras y tokens visuales.

---

## React + Vite

Este proyecto parte del template oficial de React con Vite, que proporciona configuración mínima con Hot Module Replacement y reglas básicas de ESLint.

Plugins oficiales disponibles:

* `@vitejs/plugin-react` (Babel u oxc)
* `@vitejs/plugin-react-swc`

El compilador de React no está habilitado por defecto debido a su impacto en el rendimiento de desarrollo y build. Para habilitarlo, consulta la documentación oficial de React.

---

## Notas finales

Este proyecto está enfocado en escalabilidad y claridad del código. Se recomienda mantener consistencia en nombres, estructura y estilos al agregar nuevas funcionalidades.
