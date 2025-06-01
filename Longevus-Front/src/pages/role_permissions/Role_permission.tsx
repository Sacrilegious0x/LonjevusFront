
import React, { useState,useEffect } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/HeaderAdmin'
import type { columnDefinition } from '../../components/TableBasic'
import Table from '../../components/TableBasic';
import { getAllPermissions, getAllPermissionsById, getAllRoles, updatePermissions } from '../services/RolePermissionsService';

interface IRole{
  id: number
  name: string
  description: string
  isActive: boolean
}

interface IPermissionModule {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const RolesList = () => {
  const [rolesData, setRolesData] = useState<IRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [currentRole, setCurrentRole] = useState<IRole | null>(null);
  const [permissions, setPermissions] = useState<IPermissionModule[]>([]);
  const [loadingPerms, setLoadingPerms] = useState(false);

  // 1. Cargar roles al montar
  useEffect(() => {
    setLoadingRoles(true);
    getAllRoles() //OJO! QUE LA IDEA ES QUE SE MANDE EL ID DE LA PERSONA QUE ESTA VIENDO LOS PERMISOS
      .then(setRolesData)
      .catch(err => console.error(err))
      .finally(() => setLoadingRoles(false));
  }, []);

  // 2. Columnas de la tabla
  const rolesColumns: columnDefinition<IRole>[] = [
    { header: '#', accessor: 'id', Cell: (_r, idx) => idx + 1 },
    { header: 'Nombre', accessor: 'name' },
    { header: 'Descripción', accessor: 'description' },
    {
      header: 'Permisos',
      accessor: role => role,
      Cell: role => (
        <button
          className="btn btn-warning"
          onClick={() => handleOpenModal(role)}
        >
          <i className="bi bi-key-fill"></i>
        </button>
      )
    }
  ];

    // 3. Abrir modal y cargar permisos del rol
const handleOpenModal = (role: IRole) => {
  setCurrentRole(role);
  setLoadingPerms(true);

  getAllPermissionsById(role.id)
    .then(apiPerms => {
      // mapeo de canX → X
      const mapped = apiPerms.map(p => ({
        module: p.module,
        canView:   !!p.canView,
        canCreate: !!p.canCreate,
        canUpdate: !!p.canUpdate,
        canDelete: !!p.canDelete,
      }));
      setPermissions(mapped);
      setShowModal(true);
    })
    .catch(console.error)
    .finally(() => setLoadingPerms(false));
};


  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentRole(null);
    setPermissions([]);
  };

   const handleToggle = (index: number, field: keyof Omit<IPermissionModule,'module'>) => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

    // 4. Guardar permisos (aquí usarías tu función savePermissions)
  const handleSave = () => {
    if (!currentRole) return;

  try {
     updatePermissions(currentRole.id, permissions);
    // opcional: toast.success('Permisos actualizados');
  } catch (e) {
     console.log(e);
  } finally {
    handleCloseModal();
  }

  };



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
              {loadingRoles
                ? <p>Cargando roles...</p>
                : <Table<IRole> data={rolesData} columns={rolesColumns} selectedRows={new Set()} onToggleRow={() => {}} onSelectAll={() => {}}/>
              }
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

                {permissions.length === 0
                
                ?<p>Cargando Permisos...</p>:(
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
                          <input type="checkbox" checked={!!perm.canView} onChange={() => handleToggle(idx, 'canView')} />
                        </td>
                        <td>
                          <input type="checkbox" checked={!!perm.canCreate} onChange={() => handleToggle(idx, 'canCreate')} />
                        </td>
                        <td>
                          <input type="checkbox" checked={!!perm.canUpdate} onChange={() => handleToggle(idx, 'canUpdate')} />
                        </td>
                        <td>
                          <input type="checkbox" checked={!!perm.canDelete} onChange={() => handleToggle(idx, 'canDelete')} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )
               } 
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
