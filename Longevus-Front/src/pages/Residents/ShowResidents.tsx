import Header from "../../components/Header";
import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Table from '../../components/TableBasic';
import type { columnDefinition } from '../../components/TableBasic';
import { Link } from 'react-router-dom';

interface IPerson{
    id: number,
    identification: string,
    name: string,
    age: number,
    room: number,
}

const userData: IPerson[] = [
  { id: 1, name: 'Maribel',identification: '3423242', age: 78, room:1},
  { id: 1, name: 'Carlos',identification: '62423534', age: 76, room:1},
  { id: 1, name: 'Jose',identification: '3423242', age: 89, room:2},
  { id: 1, name: 'Sandra',identification: '3423242', age: 98, room:4}
  // ... más usuarios
];

const Residents = () => {

    const personColumns: columnDefinition<IPerson>[] = [
        { header: '#', accessor: 'id', Cell: (person, index) => { return (index + 1) } },
        { header: 'Identificacion', accessor: 'identification' },
        { header: 'Nombre', accessor: 'name' },
        { header: 'Edad', accessor: 'age' },
        { header: 'Edad', accessor: 'age' },
        { header: 'Habitación', accessor: 'room' },
        {
            header: 'Acciones', accessor: (person) => person,
            Cell: (person) => (
                <>
                    <a className='btn btn-info me-2' onClick={() => console.log("Mostrar" + person.id)}>
                        <i className='bi bi-eye' />
                    </a>
                    <a className='btn btn-warning me-2' onClick={() => console.log("Editar" + person.name)}>
                        <i className='bi bi-pencil-square' />
                    </a>

                    <a className='btn btn-danger me-2' onClick={() => console.log("Eliminar" + person.id)}>
                        <i className="bi bi-trash" />
                    </a>

                </>
            )

        }
    ];

    return(
    <>
    <HeaderA/>
    <div className='container'>
            <div className='row'>
                <div className='card mt-5 mb-5'>
                    <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                        <h4>Lista de residentes</h4>
                        <Link className='btn btn-success' to='/agregar'>Agregar</Link>
                    </div>
                    <div className='card-body'>
                        <label>Buscar</label>
                        <input type="text" placeholder="Buscar..." id="userSearch"/>
                        <button className="btn btn-secondary" id="btnSearch"><i className='bi bi-search'/></button>
                        <Table<IPerson> data={userData} columns={personColumns} selectedRows={new Set()} onToggleRow={()=>{}} onSelectAll={()=>{}}/>
                    </div>
                </div>
                
            </div>
            
        </div>
        <Footer/>
    </>
        
        
        
   )
};

export default Residents;