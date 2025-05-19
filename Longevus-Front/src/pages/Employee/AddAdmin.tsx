import EmployeeForm from '../../components/EmployeeForm';
import type { EmployeeFormData } from '../../components/EmployeeForm';
import { createAdmin } from '../../services/AdminService';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/HeaderAdmin';

const AddAdmin = ()=>{
    const navigate = useNavigate();
    const handleFormSubmit = async  (formData: EmployeeFormData) => {
        console.log("Datos para crear nuevo empleado:", formData);
        try{
            const response = await createAdmin(formData);
            alert(response.data || "Administrador creado exitosamente!"); 
            navigate('/mostrar');
        }catch(error){
             console.error("Error al crear admin:", error);
        }
    };
    const handleCancel = () => {
        console.log("Operación de añadir cancelada");
        navigate('/mostrar');
    };

    return(
        <>
            <Header/>
            <EmployeeForm       
            onSubmit={handleFormSubmit} 
            onCancel={handleCancel}
            showShiftSelector={false}
            showDaySelector={true}
            showHourSelector={true}
            showOfficeContactField={true}
            />   
        </>
        
    )

}
export default AddAdmin;