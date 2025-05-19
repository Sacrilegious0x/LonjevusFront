import React, { useEffect, useState } from 'react';
import EditResidentForm from "../../components/ResidentForm";
import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import type { ResidentData } from "../../components/ResidentForm";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditResidentPage: React.FC = () => {
    
    const {id} = useParams();
    const [residentData, setResidentData] = useState<ResidentData | null>(null);
    const navigate = useNavigate();

    console.log("ID RECIBIDO", id)

    useEffect(() => {
        if(id){
            axios.get<ResidentData>(`http://localhost:8080/findResident?id=${id}`)
            .then(response => setResidentData(response.data)) 
            .catch(error => console.error("Error al obtener el residente", error))
        }
    }, [id])

    const handleUpdateResident = (data: ResidentData) => {
        const formData = new FormData();
        formData.append("id", data.id.toString());
        formData.append("identification", data.identification);
        formData.append("name", data.name);
        formData.append("birthdate", data.birthdate);
        formData.append("healthStatus", data.healthStatus);
        formData.append("numberRoom", data.numberRoom.toString());
        if (data.photo && data.photo instanceof File) {
            formData.append("photo", data.photo);
        }

        axios.post("http://localhost:8080/updateResident", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            alert("Residente editado");
            navigate("/residente/mostrar")
            console.log("Residente recibido:", response.data);
            setResidentData(response.data);

        })
        .catch((error) => {
            console.error("Error al crear el residente", error);
        })
    };

    return (
        <>
            <HeaderA />
            <div className="container">
                <div className="row">
                    <div className="div_ResidentForm card mt-5 mb-5 border-primary">
                        <h1 className="fw-bold text-uppercase">Editar Residente</h1>
                         {residentData ? (
                            <EditResidentForm initialData={residentData} onSubmit={handleUpdateResident} />
                        ) : (
                            <p>Cargando datos del residente...</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EditResidentPage;
