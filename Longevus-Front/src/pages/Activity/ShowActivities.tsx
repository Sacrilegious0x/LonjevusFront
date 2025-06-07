import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Table from '../../components/TableBasic';
import type { columnDefinition } from '../../components/TableBasic';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getActivitiesByDate, type Activity } from "../../services/ActivityService";

const Activities = (date: string) => {
    const navigate = useNavigate();
    const [activitiesData, setActivitiesData] = useState<Activity[]>([]);
    const [activitiesDate, setActivitiesDate] = useState<string>("");


    const handleBuscar = () => {
        if (!activitiesDate) return;

        getActivitiesByDate(activitiesDate)
            .then((data) => {
                console.log("Fecha seleccionada:", activitiesDate);
                setActivitiesData(data);
            })
            .catch((error) => {
                console.error("Error al cargar actividades", error);
            });
    };

    const activityColumns: columnDefinition<Activity>[] = [
        { header: '#', accessor: 'id', Cell: (activity, index) => { return (index + 1) } },
        { header: 'Nombre', accessor: 'name' },
        { header: 'Tipo', accessor: 'type' },
        { header: 'Inicio', accessor: 'startTime' },
        { header: 'Fin', accessor: 'endTime' },
        { header: 'Estado', accessor: 'status' },
        {
            header: 'Acciones', accessor: (activity) => activity,
            Cell: (activity) => (
                <>
                    <a className='btn btn-info me-2' /* onClick={() => navigate(`/residente/perfil/${resident.id}`)}*/>
                        <i className='bi bi-eye' />
                    </a>
                    <a className='btn btn-warning me-2' /*onClick={() => navigate(`/residente/editar/${resident.id}`)}*/>
                        <i className='bi bi-pencil-square' />
                    </a>

                    <a className='btn btn-danger me-2'/* onClick={() => handleDeleteResident(resident)}*/>
                        <i className="bi bi-trash" />
                    </a>

                </>
            )

        }
    ];

    return (
        <>
            <Header />

            <center id="getDate" className="mt-4">
                <label className="me-2">Seleccione la fecha</label>
                <input
                    type="date"
                    value={activitiesDate}
                    onChange={(e) => setActivitiesDate(e.target.value)}
                    className="me-2"
                />
                <button className="btn btn-primary" onClick={handleBuscar}>Buscar</button>
            </center>

            <div className='container'>
                <div className='row'>
                    <div className='card mt-5 mb-5'>
                        <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                            <h4>Lista de actividades</h4>
                            <Link className='btn btn-success' to='/residente/agregar'><i className='bi bi-person-plus-fill' /></Link>
                        </div>
                        <div className='card-body'>
                            {activitiesData.length === 0 ? (
                                <p className="text-center text-muted">No hay actividades para la fecha seleccionada.</p>
                            ) : (
                                <Table<Activity>
                                    data={activitiesData}
                                    columns={activityColumns}
                                    selectedRows={new Set()}
                                    onToggleRow={() => { }}
                                    onSelectAll={() => { }}
                                />
                            )}
                        </div>
                    </div>

                </div>

            </div>
            <Footer />
        </>
    )
}

export default Activities;