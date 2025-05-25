
import React, { useState } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/HeaderAdmin'
import type { columnDefinition } from '../../components/TableBasic'
import Table from '../../components/TableBasic';

interface IRole{
  id: number
  name: string
  description: string
  isActive: boolean
}

interface IPermissionModule {
  module: string;
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

//quemados
const rolesData: IRole[] = [
  { id: 1, name: 'Administrador', description: 'Acceso a todo el sistema', isActive: true },
  { id: 2, name: 'Cuidador', description: 'Se mantiene al tanto de los residentes', isActive: true },
]

// quemados
const allModules: IPermissionModule[] = [
  { module: 'Usuarios', view: false, create: false, update: false, delete: false },
  { module: 'Proveedores', view: false, create: false, update: false, delete: false },
  { module: 'Roles', view: false, create: false, update: false, delete: false },
  
];

const RolesList = () =>{

  const [showModal, setShowModal] = useState(false);
  const [currentRole, setCurrentRole] = useState<IRole | null>(null);
  const [permissions, setPermissions] = useState<IPermissionModule[]>([]);

  const handleOpenModal = (role: IRole) => {
    setCurrentRole(role);
    // cargar de API
    setPermissions(allModules.map(m => ({ ...m })));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentRole(null);
  };

  const handleToggle = (index: number, field: keyof Omit<IPermissionModule, 'module'>) => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

  const handleSave = () => {
    //  enviar permisos actualizados a la API...
    console.log('Guardando permisos para', currentRole, permissions);
    handleCloseModal();
  };


  const rolesColumns: columnDefinition<IRole>[]=[
    {header: '#', accessor: 'id', Cell:(_role, index)=>{return(index+1)}},
    {header: 'Nombre', accessor: 'name'},
    {header: 'Descripcion', accessor: 'description'},
    {header: 'Permisos', accessor: (role) => role,   
        Cell: (role) =>(
            <>
            <a className='btn btn-warning me-2' onClick={()=>handleOpenModal(role)}>
                <i className="bi bi-key-fill"></i>
            </a>
            </>
        ) 
    }

  ];

  return (
    <>
    <Header/>
    <div className="container">
        <div className='row'>
          <div className='card mt-5 mb-5'>
            <div className="card-title d-flex justify-content-between align-items-center mt-3">
              <h2 className="flex-grow-1 mt-2">
                <i className="bi bi-person-badge me-2"></i>
                Roles Usuario Hogar de Ancianos
              </h2>
              <button className="btn btn-success">
                <i className="bi bi-plus-lg me-1"></i> Nuevo
              </button>
            </div>
            <div className="card-body">
                <Table<IRole>data={rolesData} columns={rolesColumns} selectedRows={new  Set()} onToggleRow={()=>{}} onSelectAll={()=>{}}/>
            </div>
          </div>
        </div>
      </div>
       {showModal && (

        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Permisos para: <strong>{currentRole?.name}</strong></h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Modulo</th>
                      <th>VER</th>
                      <th>INSERTAR</th>
                      <th>ACTUALIZAR</th>
                      <th>ELIMINAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm, idx) => (
                      <tr key={perm.module}>
                        <td>{perm.module}</td>
                        <td>
                          <input type="checkbox" checked={perm.view} onChange={() => handleToggle(idx, 'view')} />
                        </td>
                        <td>
                          <input type="checkbox" checked={perm.create} onChange={() => handleToggle(idx, 'create')} />
                        </td>
                        <td>
                          <input type="checkbox" checked={perm.update} onChange={() => handleToggle(idx, 'update')} />
                        </td>
                        <td>
                          <input type="checkbox" checked={perm.delete} onChange={() => handleToggle(idx, 'delete')} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar</button>
              </div>
            </div>
          </div>
          
        </div>
      )}
      <Footer/>
    </>
  )
}

export default RolesList;
