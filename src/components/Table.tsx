import { ReactNode } from 'react';
import { Loading } from './Loading';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function Table<T extends { id: number | string }>({
  columns,
  data,
  loading,
  onRowClick,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  if (loading) {
    return <Loading />;
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border-2 border-primary-100 bg-white shadow-lg">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={`px-4 md:px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-700 ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'cursor-pointer transition hover:bg-primary-50' : ''}
              >
                {columns.map((column, idx) => (
                  <td
                    key={idx}
                    className={`px-4 md:px-6 py-4 text-sm text-slate-700 ${column.className || ''}`}
                  >
                    {typeof column.accessor === 'function' ? column.accessor(row) : String(row[column.accessor])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((row) => (
          <div
            key={row.id}
            onClick={() => onRowClick?.(row)}
            className={`card border-2 border-primary-100 ${onRowClick ? 'cursor-pointer hover:border-primary-300' : ''}`}
          >
            <div className="space-y-3">
              {columns.map((column, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 sm:w-1/3">
                    {column.header}
                  </span>
                  <span className="text-sm text-slate-900 sm:w-2/3 sm:text-right">
                    {typeof column.accessor === 'function' ? column.accessor(row) : String(row[column.accessor])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

