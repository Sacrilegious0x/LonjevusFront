
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import type {columnDefinition} from '../../components/TableBasic';
import { Link } from 'react-router-dom';
import Table from '../../components/TableBasic';
import axios from "axios";
import { useState, useEffect } from "react";

interface ISupplier{
    id: number,
    name: string,
    phoneNumber: string,
    email: string,
    address: string,
    photo: string,
    isActive: boolean
}

const SuppliersList = () =>{

  const [supplierData, setSupplierData] = useState<ISupplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredSuppliers = supplierData.filter(supplier => {
  const term = searchTerm.toLowerCase();
  return (
    supplier.name.toLowerCase().includes(term) ||
    supplier.phoneNumber.toLowerCase().includes(term) ||
    supplier.email.toLowerCase().includes(term) ||
    supplier.address.toLowerCase().includes(term)
  );
});

   const supplierColumns: columnDefinition<ISupplier>[] =[
    {header: '#', accessor: 'id', Cell:(_supplier, index)=>{return(index+1)}},
    {header: 'Nombre', accessor: 'name'},
    {header: 'Teléfono', accessor: 'phoneNumber'},
    {header: 'Correo', accessor: 'email'},
    {header: 'Dirección', accessor: 'address'},
    {header: 'Foto', accessor: 'photo',
      Cell: (_item) =>(<img
      src={`http://localhost:8080/${_item.photo}`}
      alt="Foto proveedor"
      style={{ width: 50, height: 50, objectFit: 'cover' }}
      />)
    },
    {header: 'Acciones', accessor: (supplier) => supplier,   
        Cell: (supplier) =>(
            <>
            <Link className="btn btn-warning me-2" to={`/proveedores/editar/${supplier.id}`}><i className='bi bi-pencil-square' /></Link>
            <a className='btn btn-danger me-2' onClick={()=>handleDelete(supplier.id)}>
                <i className="bi bi-trash"/>
            </a>  
            </>
        ) 
    }
   ];

    useEffect(() => {
    axios
      .get("http://localhost:8080/suppliers/list")
      .then((res) => {
        console.log("Datos recibidos:", res.data);
        setSupplierData(res.data.suppliers);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar la lista de proveedores");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-5">Cargando proveedores…</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mt-5 text-danger">{error}</div>
        <Footer />
      </>
    );
  }


  const handleDelete = async (id: number) => {
  const confirmDelete = window.confirm("¿Seguro que deseas eliminar este proveedor?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:8080/suppliers/delete`, {
      params: { id }
    });

    setSupplierData((prev) => prev.filter((p) => p.id !== id));
    alert("Proveedor eliminado correctamente");
  } catch (err) {
    console.error(err);
    alert("Ocurrió un error al eliminar el proveedor");
  }
};

return (

    
  <>  
    <Header/>
      <div className="container ">
        <div className='row'>
            <div className='card mt-5 mb-5'>
                <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                        <h4 className="m-2">Lista de proveedores</h4>
                        <Link className='btn btn-success' to='/proveedores/agregar'>Agregar</Link>
                </div>  
                <div className='card-body'>
                        <input className="mb-3" type="text" placeholder="Buscar..." id="supplierSearch" value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
                        <button className="btn btn-secondary" id="btnSearch"><i className='bi bi-search'/></button>
                        <Table<ISupplier> data={filteredSuppliers} columns={supplierColumns} selectedRows={new Set()} onToggleRow={()=>{}} onSelectAll={()=>{}}/>
                </div>
            </div>
        </div>
      </div>
    <Footer/>
  </>  
    
    )
  }

  export default SuppliersList;
  