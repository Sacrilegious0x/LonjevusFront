import AddResidentForm from "../../components/ResidentForm";
import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { Link } from 'react-router-dom';
import type { ResidentData } from "../../components/ResidentForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddResident: React.FC = () => {

    const navigate = useNavigate();

    const handleCreateResident = (data:ResidentData) => {
        const formData = new FormData();
        formData.append("identification", data.identification);
        formData.append("name", data.name);
        formData.append("birthdate", data.birthdate);
        formData.append("healthStatus", data.healthStatus);
        formData.append("numberRoom", data.numberRoom.toString());
        if (data.photo && data.photo instanceof File) {
            formData.append("photo", data.photo);
        }

        axios.post("http://localhost:8080/addResident", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then(() => {
            alert("Residente creado");
            navigate("/residente/mostrar")
        })
        .catch((error) => {
            console.error("Error al crear el residente", error);
        })
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