export function EmptyState({ 
  icon = '📭',
  title = 'No hay datos',
  message = 'No se encontró información para mostrar',
  action,
  actionText,
}) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      {action && actionText && (
        <Button onClick={action}>{actionText}</Button>
      )}
    </div>
  );
}
