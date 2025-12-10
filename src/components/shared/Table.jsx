// src/components/shared/Table.jsx

import React from 'react';

export default function Table({ 
  columns, 
  data, 
  onRowClick, 
  keyAccessor = 'id',
  emptyMessage = 'No hay datos disponibles.',
  children 
}) {
  // Si se pasan columns y data, renderizar tabla automática
  if (columns && data) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row[keyAccessor] || rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? "cursor-pointer hover:bg-gray-50 transition" : ""}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-sm text-gray-800"
                    >
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // Si se pasa children, renderizar tabla manual
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        {children}
      </table>
    </div>
  );
}