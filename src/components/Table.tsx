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
    <div className="overflow-x-auto rounded-2xl border border-neutral-100 bg-white/70 shadow-soft">
      <table className="min-w-full divide-y divide-neutral-100">
        <thead className="bg-neutral-50/80">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-neutral-500 ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 bg-white/80">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer bg-white/80 transition hover:bg-primary-50/60' : ''}
            >
              {columns.map((column, idx) => (
                <td
                  key={idx}
                  className={`whitespace-nowrap px-6 py-4 text-sm text-neutral-700 ${column.className || ''}`}
                >
                  {typeof column.accessor === 'function' ? column.accessor(row) : String(row[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

