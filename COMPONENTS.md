
---

## 📄 `COMPONENTES.md` – Guía de uso de componentes compartidos

```markdown
# 🧩 COMPONENTES – Reutilizables en PAYLOL

Esta guía explica cómo utilizar los componentes compartidos ubicados en `src/components/shared`. Todos están diseñados para mantener una estética coherente, accesible y reutilizable.

---

## 📁 Componentes disponibles

| Componente     | Propósito principal                                |
|----------------|-----------------------------------------------------|
| `Alert.jsx`    | Mostrar mensajes de estado (éxito, error, info)     |
| `Badge.jsx`    | Mostrar etiquetas de estado visual (Pagado, etc.)   |
| `Button.jsx`   | Botón reutilizable con variantes visuales           |
| `Card.jsx`     | Contenedor visual con título y contenido            |
| `EmptyState.jsx` | Mensaje visual cuando no hay datos disponibles   |
| `Input.jsx`    | Campo de texto con validación y estilos             |
| `Loader.jsx`   | Indicador de carga animado                          |
| `Modal.jsx`    | Ventana emergente con contenido personalizado       |
| `Select.jsx`   | Menú desplegable estilizado                         |
| `Table.jsx`    | Tabla dinámica con columnas y datos                 |



## 🧪 Ejemplos de uso

### 🔘 `Button`
```jsx
<Button text="Guardar" onClick={handleSave} variant="solid" />


💬 Alert
jsx
<Alert type="success" title="Guardado" message="Cambios guardados." />
🏷️ Badge
jsx
<Badge estado="Pagado" icon="✔" />
💳 Card
jsx
<Card title="Resumen de pago">Contenido aquí</Card>
📭 EmptyState
jsx
<EmptyState message="No hay datos" icon="📄" />
📝 Input
jsx
<Input label="Nombre" required placeholder="Escribe tu nombre" />
🔽 Select
jsx
<Select label="Mes" options={[{ label: "Enero", value: "01" }]} />
🔄 Loader
jsx
<Loader size="md" text="Cargando..." />
🪟 Modal
jsx
<Modal isOpen={true} onClose={handleClose} title="Confirmar" />
📊 Table
jsx
<Table
  columns={[{ header: "Nombre", accessor: "nombre" }]}
  data={[{ nombre: "Juan Pérez" }]}
  onRowClick={(row) => console.log(row)}
/>


🧠 Buenas prácticas
✅ Usa estos componentes antes de crear uno nuevo.

🎨 Personaliza con clases Tailwind si es necesario.

♿ Todos los componentes están pensados para ser accesibles.

📦 Si modificas un componente, documenta el cambio aquí.