<<<<<<< HEAD
export default function Card({  
  children, 
  title, 
  subtitle,
  className = '',
  padding = 'normal',
  ...props 
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
  };
=======
import React from "react";
import clsx from "clsx";
>>>>>>> 6bc151f9904fa51efc93817bde6d3f0daa0efb64

export function Card({ title, children, className = "", shadow = "md" }) {
  return (
    <div className={clsx(`bg-white shadow-${shadow} rounded-2xl p-6`, className)}>
      {title && <h3 className="text-xl font-semibold mb-3 text-gray-700">{title}</h3>}
      {children}
    </div>
  );
}
