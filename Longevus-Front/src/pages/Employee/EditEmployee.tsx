import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Ejemplo con React Router
import EmployeeForm from '../../components/EmployeeForm'; // Asegúrate de que la ruta sea correcta
import type { EmployeeFormData, EmployeeInitialData } from '../../components/EmployeeForm'; // Importa los tipos
import { updateCaregiver, getCaregiverById, } from '../../services/CaregiverService';
import type { CaregiverApiResponse } from '../../services/CaregiverService';
import type { IShift } from '../../components/HourSelector';

const EditEmployee =()=>{
    const { id } = useParams<{ id: string }>(); // Obtiene el ID de la URL
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState<EmployeeInitialData | null>(null);
     const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    if (id) {
        setLoading(true);
        setError(null);
        getCaregiverById(id)
            .then((apiData: CaregiverApiResponse) => { // apiData es ahora del tipo CaregiverApiResponse refinado
                if (apiData) {
                    const workScheduleTransformed: IShift[] = [];
                    // Usamos apiData.schedule.id si existe, que es el ID primario del objeto schedule.
                    // apiData.scheduleId (el FK en Caregiver) debería ser igual si la data es consistente.
                    const dbScheduleId = apiData.schedule?.id;

                    if (apiData.schedule) {
                        if (apiData.schedule.entryTime1 || apiData.schedule.exitTime1) {
                            workScheduleTransformed.push({
                                id: `${dbScheduleId || 'sched'}-0`,
                                entryTime: apiData.schedule.entryTime1 || "", // Maneja bien el null de la API
                                exitTime: apiData.schedule.exitTime1 || ""  // Maneja bien el null de la API
                            });
                        }
                        if (apiData.schedule.entryTime2 || apiData.schedule.exitTime2) {
                            workScheduleTransformed.push({
                                id: `${dbScheduleId || 'sched'}-1`,
                                entryTime: apiData.schedule.entryTime2 || "", // Maneja bien el null de la API
                                exitTime: apiData.schedule.exitTime2 || ""  // Maneja bien el null de la API
                            });
                        }
                    }
                    
                    if (workScheduleTransformed.length === 0) { // Si no hay turnos, agregar uno vacío por defecto
                        workScheduleTransformed.push({ id: crypto.randomUUID(), entryTime: "", exitTime: "" });
                    }

                    const initialData: EmployeeInitialData = {
                        id: String(apiData.id), // Convertir number a string para el form
                        name: apiData.name,
                        identification: apiData.identification,
                        email: apiData.email,
                        photoURL: apiData.photoUrl || "", // Mapear de photoUrl (API) a photoURL (Form)
                        salary: String(apiData.salary), // Convertir number a string para el input del form
                        selectedDays: apiData.schedule?.days ? apiData.schedule.days.split(',') : [],
                        workSchedule: workScheduleTransformed,
                        selectedShifts: apiData.shift ? apiData.shift.split(',') : [],
                        scheduleId: dbScheduleId, // Este es el ID del schedule que se usará para actualizar
                        // apiData.isActive y apiData.password no se mapean directamente a EmployeeInitialData
                        // ya que el formulario no los usa para la inicialización de esta manera.
                        // El password, si se cambia, se maneja como un campo nuevo.
                        // isActive se gestionaría en otro lugar si fuera editable.
                    };

                    console.log("Datos del cuidador recibidos (crudos API):", apiData);
                    console.log("Datos iniciales para el formulario (transformados):", initialData);

                    setEmployeeData(initialData)
                } else {
                    setError("Empleado no encontrado");
                }
                setLoading(false);
            })
            .catch(err => {
                // ... manejo de errores ...
                console.error("Error cargando datos del empleado:", err);
                let errorMessage = "Error al cargar los datos del empleado.";   
                setError(errorMessage);
                setLoading(false);
            });
    } else {
        setError("ID de empleado no proporcionado en la URL.");
        setLoading(false);
    }
}, [id]);
 // Recarga si el ID de la URL cambia

const handleFormSubmit = async (formData: EmployeeFormData, id?: string) => {
         if (!id) {
                  console.error("Error: Intentando actualizar sin ID de administrador.");
                  return;
              }
              
              try {
                  const response = await updateCaregiver(id, formData);
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
    const shiftSelectorVisible = true;
    const daySelectorVisible = true;
    const hourSelectorVisible = true;

    return (
        <>
             
            <EmployeeForm
                initialData={employeeData} // Pasamos los datos cargados
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                showShiftSelector={shiftSelectorVisible}
                showDaySelector={daySelectorVisible}
                showHourSelector={hourSelectorVisible}
                showOfficeContactField={false}
            />
          
        
        </>
    );

}

export default EditEmployee