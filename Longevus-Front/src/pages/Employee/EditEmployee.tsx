import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Ejemplo con React Router
import EmployeeForm from '../../components/EmployeeForm'; // Asegúrate de que la ruta sea correcta
import type { EmployeeFormData, EmployeeInitialData } from '../../components/EmployeeForm'; // Importa los tipos
import Footer from '../../components/Footer';


// Simulación de una función para obtener datos del empleado por ID
const fetchEmployeeById = async (id: string): Promise<EmployeeInitialData | null> => {
    console.log(`Workspaceing employee with ID: ${id}`);
    // Aquí harías la llamada a tu API para obtener los datos del empleado
    // const response = await fetch(`/api/employees/${id}`);
    // const data = await response.json();
    // return data as EmployeeInitialData;

    // Simulación de datos
    const dummyData: EmployeeInitialData = {
        id: id,
        name: "Juan Perez",
        identification: "123456789",
        email: "juan.perez@example.com",
        photoURL: "", 
        salary: 50000,
        selectedDays: ["K", "M", "V"],
        workSchedule: [
            { id: 'shift-1', entryTime: "08:00", exitTime: "12:00" },
            { id: 'shift-2', entryTime: "13:00", exitTime: "17:00" },
        ],
        selectedShifts: ["M", "T"]
    };
    return new Promise(resolve => setTimeout(() => resolve(dummyData), 500)); // Simula retardo de red
};

const EditEmployee =()=>{
    const { id } = useParams<{ id: string }>(); // Obtiene el ID de la URL
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState<EmployeeInitialData | null>(null);
     const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchEmployeeById(id)
                .then(data => {
                    if (data) {
                        setEmployeeData(data);
                    } else {
                        setError("Empleado no encontrado");
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error loading employee:", err);
                    setError("Error al cargar los datos del empleado.");
                    setLoading(false);
                });
        } else {
            setError("ID de empleado no proporcionado en la URL.");
            setLoading(false);
        }
    }, [id]); // Recarga si el ID de la URL cambia

const handleFormSubmit = (formData: EmployeeFormData, id?: string) => {
        if (!id) {
             console.error("Error: Intentando actualizar sin ID de empleado.");
             return;
        }
        console.log(`Datos para actualizar empleado con ID ${id}:`, formData);
        // Aquí harías la llamada a tu API para actualizar el empleado
        // Ten en cuenta que si photo es null, no enviaste un nuevo archivo.
        // Si password es "", no enviaste una nueva contraseña.
        // api.updateEmployee(id, formData);
        // Después, podrías redirigir al usuario a otra página
        // Ejemplo: navigate('/employees');
    };
    const handleCancel = () => {
        console.log("Operación de edición cancelada");
        navigate('/mostrar'); // Redirige a la lista de empleados
    };
    if (loading) {
        return <div className="container mt-5">Cargando...</div>;
    }

    if (error) {
        return <div className="container mt-5 text-danger">Error: {error}</div>;
    }

    if (!employeeData) {
        return <div className="container mt-5">No se encontraron datos para editar.</div>;
    }


    return (
        <>
             
            <EmployeeForm
                initialData={employeeData} // Pasamos los datos cargados
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
            />
          
             <Footer /> 
        </>
    );

}

export default EditEmployee