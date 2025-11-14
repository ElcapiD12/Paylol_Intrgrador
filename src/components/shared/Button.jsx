<<<<<<< HEAD
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick, 
  disabled = false,
  className = '',
  type = 'button',
  ...props 
}) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };
=======
import React from "react";
import clsx from "clsx";
>>>>>>> 6bc151f9904fa51efc93817bde6d3f0daa0efb64

export function Button({
  text,
  onClick,
  color = "blue",
  variant = "solid",
  disabled = false,
  type = "button",
  className = "",
}) {
  const baseStyles = "font-semibold px-4 py-2 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    solid: `bg-${color}-600 hover:bg-${color}-700 text-white`,
    outline: `border border-${color}-600 text-${color}-600 hover:bg-${color}-50`,
    ghost: `text-${color}-600 hover:bg-${color}-100`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseStyles, variants[variant], disabled && "opacity-50 cursor-not-allowed", className)}
    >
      {text}
    </button>
  );
}
