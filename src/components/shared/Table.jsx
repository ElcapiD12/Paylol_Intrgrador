export function Table({ columns, data, onRowClick, children }) {
  if (columns && data) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg" role="table">
          <thead className="bg-gray-50">
            <tr role="row">
              {columns.map((column, index) => (
                <th
                  key={index}
                  role="columnheader"
                  scope="col"
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
                  key={rowIndex}
                  role="row"
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? "cursor-pointer hover:bg-gray-50 transition" : ""}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      role="cell"
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                    >
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500 text-sm">
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // Wrapper manual
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg" role="table">
        {children}
      </table>
    </div>
  );
}
