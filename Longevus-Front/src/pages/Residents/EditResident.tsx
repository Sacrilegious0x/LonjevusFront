import React from 'react';
import EditResidentForm from "../../components/ResidentForm";
import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { ResidentData } from "../../components/ResidentForm";

const EditResidentPage: React.FC = () => {
    const mockResident: ResidentData = {
        identification: '12345',
        name: 'Ana Martínez',
        age: 78,
        healthStatus: 'regular',
        numberRoom: 12,
        photo: null,
        isActive: true,
    };

    const handleUpdateResident = (data: ResidentData) => {
        console.log('Actualizar residente con:', data);
        // Aquí podrías llamar a una API para guardar cambios
    };

    return (
        <>
            <HeaderA />
            <div className="container">
                <div className="row">
                    <div className="div_ResidentForm card mt-5 mb-5 border-primary">
                        <h1 className="fw-bold text-uppercase">Editar Residente</h1>
                        <EditResidentForm initialData={mockResident} onSubmit={handleUpdateResident} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EditResidentPage;
