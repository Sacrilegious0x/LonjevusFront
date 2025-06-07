import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import EmployeeForm from '../../components/EmployeeForm'; 
import type { EmployeeFormData, EmployeeInitialData } from '../../components/EmployeeForm'; 
import { updateCaregiver, getCaregiverById, } from '../../services/CaregiverService';
import type { CaregiverApiResponse } from '../../services/CaregiverService';
import type { IShift } from '../../components/HourSelector';

const EditEmployee =()=>{
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState<EmployeeInitialData | null>(null);
     const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    if (id) {
        setLoading(true);
        setError(null);
        getCaregiverById(id)
            .then((apiData: CaregiverApiResponse) => { 
                if (apiData) {
                    const workScheduleTransformed: IShift[] = [];     
                    const dbScheduleId = apiData.schedule?.id;

                    if (apiData.schedule) {
                        if (apiData.schedule.entryTime1 || apiData.schedule.exitTime1) {
                            workScheduleTransformed.push({
                                id: `${dbScheduleId || 'sched'}-0`,
                                entryTime: apiData.schedule.entryTime1 || "", 
                                exitTime: apiData.schedule.exitTime1 || ""  
                            });
                        }
                        if (apiData.schedule.entryTime2 || apiData.schedule.exitTime2) {
                            workScheduleTransformed.push({
                                id: `${dbScheduleId || 'sched'}-1`,
                                entryTime: apiData.schedule.entryTime2 || "", 
                                exitTime: apiData.schedule.exitTime2 || ""  
                            });
                        }
                    }
                    
                    if (workScheduleTransformed.length === 0) {
                        workScheduleTransformed.push({ id: crypto.randomUUID(), entryTime: "", exitTime: "" });
                    }

                    const initialData: EmployeeInitialData = {
                        id: String(apiData.id), 
                        name: apiData.name,
                        identification: apiData.identification,
                        email: apiData.email,
                        photoURL: apiData.photoUrl || "", 
                        salary: String(apiData.salary), 
                        selectedDays: apiData.schedule?.days ? apiData.schedule.days.split(',') : [],
                        workSchedule: workScheduleTransformed,
                        selectedShifts: apiData.shift ? apiData.shift.split(',') : [],
                        scheduleId: dbScheduleId, 
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

const handleFormSubmit = async (formData: EmployeeFormData, id?: string) => {
         if (!id) {
                  console.error("Error: Intentando actualizar sin ID de trabajador.");
                  return;
              }
              
              try {
                  const response = await updateCaregiver(id, formData);
                  alert(response.data || "Trabajador actualizado exitosamente!");
                  navigate('/empleado/mostrar');
              } catch (error) {
                  console.error("Error al actualizar Trabajador:", error);
                  alert("Error al actualizar trabajador. Por favor, intente nuevamente.");
              }
    };
    const handleCancel = () => {
        console.log("Operación de edición cancelada");
        navigate('/empleado/mostrar'); 
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
                initialData={employeeData} 
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