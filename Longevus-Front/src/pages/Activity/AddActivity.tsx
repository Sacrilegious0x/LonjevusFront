import AddActivtyForm from "../../components/ActivityForm";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { type Activity, createActivity } from "../../services/ActivityService";
import { useNavigate } from "react-router-dom";

const AddActivity: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateActivity = (data: Activity) => {
        createActivity(data)
            .then(() => {
                alert("Actividad creada");
                navigate("/actividades/mostrar");
            })
            .catch((error) => {
                console.error("Error al crear el residente", error);
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