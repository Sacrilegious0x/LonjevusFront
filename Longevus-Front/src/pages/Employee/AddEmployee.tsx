import EmployeeForm from '../../components/EmployeeForm';
import type { EmployeeFormData } from '../../components/EmployeeForm';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/HeaderAdmin';
import { useState } from 'react';
import { createCaregiver } from '../../services/CaregiverService';

const AddEmployee = () =>{
  const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormSubmit = async (formData: EmployeeFormData) => {
        console.log("Datos para crear nuevo empleado:", formData);
        setIsLoading(true);
        setError(null);

        try {
            // Call the createCaregiver service function
            // Ensure createCaregiver is adapted to send FormData as discussed
            const response = await createCaregiver(formData); 
            
            console.log("Empleado creado exitosamente:", response); // Or response.data if your service returns it nested
            
            // Navigate to a success page or the list of employees
            // You might want to show a success message before navigating
            alert("Empleado agregado exitosamente!"); // Simple alert, consider a more elegant notification
            navigate('/mostrar'); // Or any other route e.g., '/employees/list'

        } catch (err: any) {
            console.error("Error al crear el empleado:", err);
            setError(err.response?.data?.message || err.message || "Ocurrió un error desconocido al crear el empleado.");
            // Optionally, display the error message to the user in the UI
            alert(`Error: ${error}`); // Simple alert for error
        } finally {
            setIsLoading(false);
        }
    };
    
    // Función para manejar la cancelación (Volver)
    const handleCancel = () => {
        console.log("Operación de añadir cancelada");
        navigate('/mostrar');
    };

    return(
        <>
            <Header/>
            <div className="container mt-4"> {/* Added a container for better layout */}
                <h2>Agregar Nuevo Empleado</h2>
                {/* Display loading state */}
                {isLoading && (
                    <div className="alert alert-info" role="alert">
                        Guardando empleado...
                    </div>
                )}

                {/* Display error message if any */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Display error message if any */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}
            <EmployeeForm       
            onSubmit={handleFormSubmit} 
            onCancel={handleCancel}
            showShiftSelector={true}
            showDaySelector={true}
            showHourSelector={true}
            showOfficeContactField={false}/>
            </div>
            
        </>
        
    )
}

export default AddEmployee