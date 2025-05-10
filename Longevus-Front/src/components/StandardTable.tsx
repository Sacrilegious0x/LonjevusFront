import React from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface Props<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (id: number) => void;
}

function StandardTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
}: Props<T>) {
  const hasActions = onEdit || onDelete;

  return (
    <table className="table table-striped table-bordered text-center align-middle">
      <thead className="table-dark">
        <tr>
          {columns.map((col) => (
            <th key={col.header}>{col.header}</th>
          ))}
          {hasActions && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col.header}>
                {col.render
                  ? col.render(item)
                  : (item[col.accessor] as React.ReactNode)}
              </td>
            ))}
            {hasActions && (
              <td>
                <div className="d-flex justify-content-center gap-2">
                  {onEdit && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => onEdit(item)}
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(item.id)}
                    >
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StandardTable;
