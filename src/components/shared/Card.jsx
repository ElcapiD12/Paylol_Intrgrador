import React from "react";
import clsx from "clsx";

export function Card({ title, children, className = "", shadow = "md" }) {
  return (
    <div
      className={clsx(
        `bg-white shadow-${shadow} rounded-2xl p-6 transition-transform duration-300 
         hover:scale-[1.02] hover:shadow-xl border border-gray-100`,
        className
      )}
    >
      {title && (
        <h3 className="text-xl font-semibold mb-3 text-gray-700 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
