import AddResidentForm from "../../components/ResidentForm";
import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import type { ResidentData } from "../../services/ResidentService";
import { useNavigate } from "react-router-dom";
import { createResident } from "../../services/ResidentService";

const AddResident: React.FC = () => {

    const navigate = useNavigate();

    const handleCreateResident = (data:ResidentData) => {
        createResident(data)
        .then(() => {
            alert("Residente creado");
            navigate("/residente/mostrar");
        })
        .catch((error) => {
            console.error("Error al crear el residente", error);
        });
    }

    return (
        <>
            <HeaderA />
            <div className="container">
                <div className="row">
                    <div className="div_ResidentForm card mt-5 mb-5 border-primary">
                        <h1 className="fw-bold text-uppercase">Agregar Residente</h1>
                        <AddResidentForm onSubmit={handleCreateResident} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AddResident;