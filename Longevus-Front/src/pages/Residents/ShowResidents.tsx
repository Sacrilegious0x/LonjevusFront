import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Table from '../../components/TableBasic';
import type { columnDefinition } from '../../components/TableBasic';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getResidents, deleteResident } from "../../services/ResidentService";
import type { Resident } from "../../services/ResidentService";

const Residents = () => {

    const navigate = useNavigate();
    const [residentData, setResidentData] = useState<Resident[]>([]);

    useEffect(() => {
        getResidents().then((data) => {
            console.log(data);
            setResidentData(data);
        }).catch((error) => {
            console.error('Error al obtener residentes', error)
        })
    }, []);


    const handleDeleteResident = (resident: Resident) => {
        if (window.confirm(`¿Estás seguro de eliminar al residente ${resident.name}?`)) {
            deleteResident(resident.id)
            .then(() => {
                setResidentData(prev => prev.filter(r => r.id !== resident.id));
            })
            .catch(error => {
                console.error("Error al eliminar el residente", error);
            });
        }
    }

    const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
        {/* axios.get<Resident[]>(`http://localhost:8080/findResidentByNameorIdentification?value=${searchInput}`)
            .then((response) => {
                setResidentData(response.data);
            })
            .catch((error) => {
                console.error("Error al buscar residentes", error);
            });*/}
    };

    const personColumns: columnDefinition<Resident>[] = [
        { header: '#', accessor: 'id', Cell: (resident, index) => { return (index + 1) } },
        { header: 'Identificacion', accessor: 'identification' },
        { header: 'Nombre', accessor: 'name' },
        { header: 'Edad', accessor: 'age' },
        { header: 'Habitación', accessor: 'numberRoom' },
        {
            header: 'Acciones', accessor: (person) => person,
            Cell: (resident) => (
                <>
                    <a className='btn btn-info me-2' onClick={() => navigate(`/residente/perfil/${resident.id}`)}>
                        <i className='bi bi-eye' />
                    </a>
                    <a className='btn btn-warning me-2' onClick={() => navigate(`/residente/editar/${resident.id}`)}>
                        <i className='bi bi-pencil-square' />
                    </a>

                    <a className='btn btn-danger me-2' onClick={() => handleDeleteResident(resident)}>
                        <i className="bi bi-trash" />
                    </a>

                </>
            )

        }
    ];

    return (
        <>
            <HeaderA />
            <div className='container'>
                <div className='row'>
                    <div className='card mt-5 mb-5'>
                        <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                            <h4>Lista de residentes</h4>
                            <Link className='btn btn-success' to='/residente/agregar'><i className='bi bi-person-plus-fill'/></Link>
                        </div>
                        <div className='card-body'>
                            <label>Buscar</label>
                            <input type="text" placeholder="Buscar..." id="userSearch" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                            <button className="btn btn-secondary" id="btnSearch"><i className='bi bi-search' onClick={handleSearch} /></button>
                            <Table<Resident> data={residentData} columns={personColumns} selectedRows={new Set()} onToggleRow={() => { }} onSelectAll={() => { }} />
                        </div>
                    </div>

                </div>

            </div>
            <Footer />
        </>



    )
};

export default Residents;