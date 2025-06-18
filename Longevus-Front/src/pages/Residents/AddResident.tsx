import AddResidentForm from "../../components/ResidentForm";
import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import type { ResidentData } from "../../services/ResidentService";
import { useNavigate } from "react-router-dom";
import { createResident } from "../../services/ResidentService";
import { succesAlert, errorAlert } from "../../js/alerts";
import { Link } from "react-router-dom";
import { checkStatusRoom } from "../../services/RoomService";

const AddResident: React.FC = () => {

    const navigate = useNavigate();

    const handleCreateResident = (data:ResidentData) => {
        createResident(data).then(() => {
            succesAlert('Creado', 'El residente ha sido creado');
            checkStatusRoom(data.numberRoom).then(() => {
                }).catch((err) => {
                console.error("Error al verificar la habitación", err);
                errorAlert("Error al verificar habitación");});
                navigate("/residente/mostrar");
        })
        .catch((error) => {
            console.error("Error al crear el residente", error);
            errorAlert('Error al crear residente');
        });
    }

    return (
        <>
            {/* <HeaderA /> */}
            <div className="container">
                <div className="row">
                    <div className="div_ResidentForm card mt-5 mb-5 border-primary">
                            <h1 className="fw-bold text-uppercase">Agregar Residente</h1>
                            {/* <Link className='btn btn-secondary float-end' to="/residente/mostrar"><i className="bi bi-reply" /> Volver</Link> */}
                        </div>
                        <AddResidentForm onSubmit={handleCreateResident} />

                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default AddResident;