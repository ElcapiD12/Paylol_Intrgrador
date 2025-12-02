import React from "react";
import clsx from "clsx";

export function Card({ title, children, className = "", shadow = "md" }) {
  return (
    <div
      className={clsx(
        `original-card shadow-${shadow} rounded-2xl p-6`,
        className
      )}
    >
      {title && (
        <h3 className="text-xl font-semibold mb-3 text-gray-300">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
