import React from 'react';
import EmployeeForm from '../../components/EmployeeForm';
import type { EmployeeFormData } from '../../components/EmployeeForm';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () =>{
    const navigate = useNavigate();
    const handleFormSubmit = (formData: EmployeeFormData, employeeId?: string) => {
        console.log("Datos para crear nuevo empleado:", formData);
        // Aquí harías la llamada a tu API para crear el nuevo empleado
        // Ejemplo: api.createEmployee(formData);
        // Después, podrías redirigir al usuario a otra página
        // Ejemplo: navigate('/employees');
    };

    // Función para manejar la cancelación (Volver)
    const handleCancel = () => {
        console.log("Operación de añadir cancelada");
        navigate('/mostrar');
    };

    return(
        <>
            <EmployeeForm       
            onSubmit={handleFormSubmit} 
            onCancel={handleCancel}/>
            <Footer/>
        </>
        
    )
}

export default AddEmployee