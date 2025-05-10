
import React, { useState } from 'react'

type Role = {
  id: number
  name: string
  description: string
  isActive: boolean
}

const mockRoles: Role[] = [
  { id: 1, name: 'Administrador', description: 'Acceso a todo el sistema', isActive: true },
  { id: 2, name: 'Cuidador', description: 'Se mantiene al tanto de los residentes', isActive: true },
]

export default function Role_Permissions() {
  const [roles] = useState(mockRoles)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState('')

  // Filtrar según búsqueda
  const filtered = roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  )

  // Paginación sencilla: solo primeros perPage registros
  const shown = filtered.slice(0, perPage)

  return (
    <div className="container-fluid p-4">
      {/* Título y botón Nuevo */}
      <div className="d-flex align-items-center mb-3">
        <h2 className="flex-grow-1 mb-0">
          <i className="bi bi-person-badge me-2"></i>
          Roles Usuario Hogar de Ancianos
        </h2>
        <button className="btn btn-success">
          <i className="bi bi-plus-lg me-1"></i> Nuevo
        </button>
      </div>



      {/* Tabla */}
      <div className="table-responsive border-success">
        <table className="table table-striped table-hover align-middle table-success ">
          <thead className="">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Status</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {shown.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.description}</td>
                <td>
                  {r.isActive
                    ? <span className="badge bg-success">Activo</span>
                    : <span className="badge bg-danger">Inactivo</span>
                  }
                </td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-secondary me-1">
                    <i className="bi bi-eye"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-primary me-1">
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4">No hay resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}