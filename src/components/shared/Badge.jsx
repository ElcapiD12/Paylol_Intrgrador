import React from "react";
import clsx from "clsx";

export function Badge({ text, color = "blue", className = "" }) {
  return (
    <span className={clsx(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`, className)}>
      {text}
    </span>
  );
}
