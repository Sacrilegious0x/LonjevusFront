
import { href } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import type {columnDefinition} from '../../components/TableBasic';
import { Link } from 'react-router-dom';
import Table from '../../components/TableBasic';

interface ISupplier{
    id: number,
    name: string,
    phoneNumber: string,
    email: string,
    address: string,
    photo: string,
    isActive: number
}

const supplierData: ISupplier[] = [
  {id: 1, name: 'Tilin',phoneNumber:'86784783' ,email: 'alice@example.com', address:'Ticaban 200 mts norte de la iglesia',photo:'urlexample',isActive:1},
  {id: 2, name: 'Varela',phoneNumber:'86784783' ,email: 'blabla@example.com', address:'Ticaban 200 mts norte de la iglesia',photo:'urlexample',isActive:1}
];


const SuppliersList = () =>{

   const supplierColumns: columnDefinition<ISupplier>[] =[
    {header: '#', accessor: 'id', Cell:(_supplier, index)=>{return(index+1)}},
    {header: 'Nombre', accessor: 'name'},
    {header: 'Teléfono', accessor: 'phoneNumber'},
    {header: 'Correo', accessor: 'email'},
    {header: 'Dirección', accessor: 'address'},
    {header: 'Foto', accessor: 'photo'},
    {header: 'Acciones', accessor: (supplier) => supplier,   
        Cell: (supplier) =>(
            <>
            <Link className="btn btn-warning me-2" to='/proveedores/editar'><i className='bi bi-pencil-square'/></Link>
            <a className='btn btn-danger me-2' onClick={()=>console.log("Eliminar"+supplier.id)}>
                <i className="bi bi-trash"/>
            </a>  
            </>
        ) 
    }
   ];

return (

    
  <>  
    <Header/>
      <div className="container ">
        <div className='row'>
            <div className='card mt-5 mb-5'>
                <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                        <h4 className="m-2">Lista de proveedores</h4>
                        <Link className='btn btn-success' to='/proveedores/guardar'>Agregar</Link>
                </div>  
                <div className='card-body'>
                        <input className="mb-3" type="text" placeholder="Buscar..." id="supplierSearch"/>
                        <button className="btn btn-secondary" id="btnSearch"><i className='bi bi-search'/></button>
                        <Table<ISupplier> data={supplierData} columns={supplierColumns} selectedRows={new Set()} onToggleRow={()=>{}} onSelectAll={()=>{}}/>
                </div>
            </div>
        </div>
      </div>
    <Footer/>
  </>  
    
    )
  }

  export default SuppliersList;
  