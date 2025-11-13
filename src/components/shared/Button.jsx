import React from "react";
import clsx from "clsx";

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
