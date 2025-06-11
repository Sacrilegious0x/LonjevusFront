import AddActivtyForm from "../../components/ActivityForm";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { type Activity, createActivity } from "../../services/ActivityService";
import { useNavigate } from "react-router-dom";
import { succesAlert, errorAlert } from "../../js/alerts";

const AddActivity: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateActivity = (data: Activity) => {
        createActivity(data)
            .then(() => {
                succesAlert('Agregada', 'La actividad ha sido agregada con éxito');
                navigate("/actividades/mostrar");
            })
            .catch((error) => {
                errorAlert('Error al crear la actividad')
                console.error("Error al crear la actividad", error);
            });
    }

    return (
        <>
            <Header />
            <div className="container">
                <div className="row">
                    <div className="div_ResidentForm card mt-5 mb-5 border-primary">
                        <h1 className="fw-bold text-uppercase">Agregar Actividad</h1>
                        <AddActivtyForm onSubmit={handleCreateActivity} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default AddActivity;