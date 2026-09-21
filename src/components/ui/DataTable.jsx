import React from 'react';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

/**
 * DataTable Component
 * 
 * Reusable table component with responsive layout, column mapping, empty/loading states.
 */
export function DataTable({ 
  columns = [], 
  data = [], 
  loading = false, 
  emptyTitle = 'No records found', 
  emptyDescription = 'There are no items matching the current filter.',
  onRowClick,
  className = '' 
}) {
  if (loading) {
    return <LoadingState message="Loading records..." />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={`data-table-container ${className}`}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={col.key || idx} 
                style={{ width: col.width, textAlign: col.align || 'left' }}
                className={col.className || ''}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={row.id || rowIndex} 
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'clickable-row' : ''}
            >
              {columns.map((col, colIndex) => {
                const value = row[col.key];
                return (
                  <td 
                    key={`${rowIndex}-${col.key || colIndex}`} 
                    style={{ textAlign: col.align || 'left' }}
                    className={col.cellClassName || ''}
                  >
                    {col.render ? col.render(value, row, rowIndex) : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
