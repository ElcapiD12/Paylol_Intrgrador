import React from "react";

export function Button({ text, onClick, color = "blue" }) {
  const base = `bg-${color}-600 hover:bg-${color}-700 text-white font-semibold px-4 py-2 rounded-lg`;
  return <button onClick={onClick} className={base}>{text}</button>;
}
