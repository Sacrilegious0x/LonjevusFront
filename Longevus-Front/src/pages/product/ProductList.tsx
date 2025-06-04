import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryFilter from "../../components/CategoryFilter";
import { Link, useNavigate } from 'react-router-dom';
import type { columnDefinition } from "../../components/TableBasic";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Table from '../../components/TableBasic';
import { deleteProduct, getProducts } from "../../services/ProductService";

interface IProduct {
  id:number,
  name: string,
  price: number,
  expirationDate: string,
  category: string,
  unit: string,
  supplier: string,
  photoURL: string,
  isActive:boolean
}

const dateES = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

const ProductsList=() => {

  const [productData,setProductData] = useState<IProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredProducts = productData.filter(product => {
  const term = searchTerm.toLowerCase();
  return (
    product.name.toLowerCase().includes(term) ||
    product.price.toString().toLowerCase().includes(term) ||
    product.supplier.toLowerCase().includes(term) ||
    product.unit.toLowerCase().includes(term)
  );

});

const productColumns: columnDefinition<IProduct>[]=[

    {header: '#', accessor: 'id', Cell:(_product, index)=>{return(index+1)}},
    {header: 'Nombre', accessor: 'name'},
    {header: 'Precio', accessor: 'price'},
    {header: 'Categoria', accessor: 'category'},
    {header: 'Fecha de Vencimiento',accessor: 'expirationDate',
    Cell: (product) => {
      return dateES(product.expirationDate);
    }
    },
    {header: 'Foto', accessor: 'photoURL',Cell: (_item) =>(<img
      src={`http://localhost:8080/${_item.photoURL}`}
      alt="Foto producto"
      style={{ width: 50, height: 50, objectFit: 'cover' }}
      />)
    },
    {header: 'Unidad',accessor:'unit'},
    {header: 'Proveedor', accessor:'supplier'},
      
    {header: 'Acciones', accessor: (product) => product,   
        Cell: (product) =>(
            <>
            <Link className="btn btn-warning me-2" to={`/productos/editar/${product.id}`}><i className='bi bi-pencil-square' /></Link>
            <a className='btn btn-danger me-2' onClick={()=>handleDelete(product.id)}>
                <i className="bi bi-trash"/>
            </a>  
            </>
        ) 
    }

];

useEffect(() => {
    loadProducts();
  }, []);

      const loadProducts = async () => {
      try {
        const products = await getProducts();
        
        setProductData(products);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido al cargar proveedores");
        setLoading(false);
      }
    };


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
        await deleteProduct(id);
        setProductData((prev) => prev.filter((p) => p.id !== id));
        alert("Proveedor eliminado correctamente");
      } catch (err) {
        alert(err instanceof Error ? err.message : "Error desconocido al eliminar proveedor");
      }
    };

  return (

     <>  
    <Header/>
      <div className="container ">
        <div className='row'>
            <div className='card mt-5 mb-5'>
                <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                        <h4 className="m-2">Lista de productos</h4>
                        <Link className='btn btn-success' to='/productos/agregar'>Agregar</Link>
                </div>  
                <div className='card-body'>
                        <input className="mb-3" type="text" placeholder="Buscar..." id="supplierSearch" value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
                        <button className="btn btn-secondary" id="btnSearch"><i className='bi bi-search'/></button>
                        <Table<IProduct> data={filteredProducts} columns={productColumns} selectedRows={new Set()} onToggleRow={()=>{}} onSelectAll={()=>{}}/>
                </div>
            </div>
        </div>
      </div>
    <Footer/>
  </>  

  );
};

export default ProductsList;
