export function Loader({ size = 'md', text = '', color = 'blue' }) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <div
        className={`animate-spin rounded-full border-4 border-${color}-200 border-t-${color}-600 ${sizes[size]}`}
        aria-hidden="true"
      ></div>
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );
}
