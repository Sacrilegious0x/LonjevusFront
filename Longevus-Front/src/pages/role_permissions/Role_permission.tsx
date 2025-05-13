
import React, { useState } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import type { columnDefinition } from '../../components/TableBasic'
import Table from '../../components/TableBasic';

interface IRole{
  id: number
  name: string
  description: string
  isActive: boolean
}

const rolesData: IRole[] = [
  { id: 1, name: 'Administrador', description: 'Acceso a todo el sistema', isActive: true },
  { id: 2, name: 'Cuidador', description: 'Se mantiene al tanto de los residentes', isActive: true },
]

const RolesList = () =>{

  const rolesColumns: columnDefinition<IRole>[]=[

    {header: '#', accessor: 'id', Cell:(_role, index)=>{return(index+1)}},
    {header: 'Nombre', accessor: 'name'},
    {header: 'Descripcion', accessor: 'description'},
    {header: 'Permisos', accessor: (role) => role,   
        Cell: (supplier) =>(
            <>
            <a className='btn btn-warning me-2' onClick={()=>console.log("Editar"+supplier.name)}>
                <i className='bi bi-pencil-square'/>
            </a>
            </>
        ) 
    }

  ];

  return (
    <>
    <Header/>
    <div className="container">
      {/* Título y botón Nuevo */}
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
      <Footer/>
    </>
  )
}

export default RolesList;
