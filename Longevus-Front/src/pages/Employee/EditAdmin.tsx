import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Ejemplo con React Router
import EmployeeForm from '../../components/EmployeeForm'; // Asegúrate de que la ruta sea correcta
import type { EmployeeFormData, EmployeeInitialData } from '../../components/EmployeeForm'; // Importa los tipos
import { getAdminById, updateAdmin } from '../../services/AdminService';



const EditAdmin =()=>{
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState<EmployeeInitialData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            // Usamos getAdminById del servicio en lugar de la función simulada
            getAdminById(id)
                .then(data => {
                    if (data) {
                        // Transformar datos del backend al formato que espera EmployeeForm
                        const initialData: EmployeeInitialData = {
                            id: id,
                            name: data.name,
                            identification: data.identification,
                            email: data.email,
                            photoURL: data.photoUrl || "",
                            salary: data.salary,
                            selectedDays: data.schedule?.days ? data.schedule.days.split(',') : [],
                            workSchedule: [
                                {
                                    id: data.schedule?.id,
                                    entryTime: data.schedule?.entryTime1 || "",
                                    exitTime: data.schedule?.exitTime1 || ""
                                }
                            ],
                            
                            officeContact: data.officeContact || "",
                            scheduleId: data.schedule?.id || undefined
                            
                        };
                        console.log("ID recibido para edición:", initialData?.scheduleId);

                        // Agregar segundo turno si existe
                        if (data.schedule?.entryTime2 && data.schedule?.exitTime2) {
                            initialData.workSchedule.push({
                                
                                id: data.schedule?.id,
                                entryTime: data.schedule.entryTime2,
                                exitTime: data.schedule.exitTime2
                            });
                        }
                        
                        setEmployeeData(initialData);
                    } else {
                        setError("Administrador no encontrado");
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error loading admin:", err);
                    setError("Error al cargar los datos del administrador.");
                    setLoading(false);
                });
        } else {
            setError("ID de administrador no proporcionado en la URL.");
            setLoading(false);
        }
    }, [id]);

    const handleFormSubmit = async (formData: EmployeeFormData) => {
        if (!id) {
            console.error("Error: Intentando actualizar sin ID de administrador.");
            return;
        }
        
        try {
            const response = await updateAdmin(id, formData);
            alert(response.data || "Administrador actualizado exitosamente!");
            navigate('/mostrar');
        } catch (error) {
            console.error("Error al actualizar administrador:", error);
            alert("Error al actualizar administrador. Por favor, intente nuevamente.");
        }
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
    const contactfieldVisible = true;
    const daySelectorVisible = true;
    const hourSelectorVisible = true;


    return (
        <>
             
            <EmployeeForm
                initialData={employeeData} // Pasamos los datos cargados
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                showShiftSelector={false}
                showDaySelector={daySelectorVisible}
                showHourSelector={hourSelectorVisible}
                showOfficeContactField={contactfieldVisible}
            />
        </>
    );

}

export default EditAdmin