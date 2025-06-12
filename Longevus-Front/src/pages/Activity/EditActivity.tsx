import React, { useEffect, useState } from 'react';
import EditActivityForm from '../../components/ActivityForm';
import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { getActivityById, type Activity, updateActivity } from '../../services/ActivityService';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { succesAlert, errorAlert } from "../../js/alerts";

const EditResidentPage: React.FC = () => {

    const { id } = useParams();
    const [activityData, setActivityData] = useState<Activity | null>(null);
    const navigate = useNavigate();

    console.log("ID RECIBIDO", id)

    useEffect(() => {
        if (id) {
            getActivityById(Number(id))
                .then(res => setActivityData(res))
                .catch(err => console.error("Error al obtener la actividad", err));
        }
    }, [id]);

    const handleUpdateResident = (data: Activity) => {
        updateActivity(data)
            .then(res => {
                console.log("Activdad recibido:", res);
                setActivityData(res);
                succesAlert('Editada', 'La actividad ha sido actualizada con éxito');
                navigate("/actividades/mostrar");
            })
            .catch(err =>{ 
                console.error("Error al actualizar el actividad", err);
                errorAlert('Error al editar la actividad');
            });
    };

    return (
        <>
            {/* <HeaderA /> */}
            <div className="container">
                <div className="row">
                    <div className="div_ResidentForm card mt-5 mb-5 border-primary">
                        <h1 className="fw-bold text-uppercase">Editar Actividad</h1>
                        {activityData ? (
                            <EditActivityForm initialData={activityData} onSubmit={handleUpdateResident} />
                        ) : (
                            <p>Cargando datos de la actividad...</p>
                        )}
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default EditResidentPage;
