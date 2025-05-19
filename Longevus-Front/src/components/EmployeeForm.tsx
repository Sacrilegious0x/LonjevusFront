import { useState, type ChangeEvent } from'react';
import Footer  from './Footer';
import HourSelector  from './HourSelector';
import DaySelector from './DaySelector';
import type { IShift } from './HourSelector';
import ShiftTypeSelector from './ShiftTypeSelector';

export interface EmployeeFormData {
    name: string;
    identification: string;
    email: string;
    password: string; // Nota: La contraseña NO se carga para edición, generalmente se deja vacía.
    photo: File | null; // Nota: La foto File NO se carga para edición, se maneja de forma diferente (URL existente + nueva carga).
    salary: string;
    selectedDays: string[];
    workSchedule: IShift[];
    selectedShifts: string[];
    scheduleId?: number;
    officeContact?: string;
}
export interface EmployeeInitialData{
    id?: string,
    name: string,
    identification: string,
    email: string,
    photoURL?: string,
    salary: number | string,
    selectedDays: string [];
    workSchedule: IShift[];
    selectedShifts?: string [];
    officeContact?: string;
    scheduleId?: number;
}

interface EmployeeFormProps{
    initialData?: EmployeeInitialData,
    onSubmit: (data: EmployeeFormData, employeeId?: string)=>void;
    onCancel: ()=> void;
    showShiftSelector?: boolean;
    showHourSelector?: boolean;
    showOfficeContactField?: boolean;
    showDaySelector?: boolean;
}

const EmployeeForm = ({initialData, onSubmit, onCancel, showShiftSelector = false,
    showHourSelector = false,showOfficeContactField = false,
    showDaySelector = false}: EmployeeFormProps) => {
        // !!! AÑADIR ESTOS CONSOLE LOGS !!!
    console.log("Dentro de EmployeeForm - Props de visibilidad:");
    console.log("initialData presente:", !!initialData); // Para saber si es modo edición
    console.log("showShiftSelector:", showShiftSelector, typeof showShiftSelector);
    console.log("showDaySelector:", showDaySelector, typeof showDaySelector);
    console.log("showHourSelector:", showHourSelector, typeof showHourSelector);
    console.log("showOfficeContactField:", showOfficeContactField, typeof showOfficeContactField); // Para comparar

    const [formData, setFormData] = useState<EmployeeFormData>(()=>{
        if(initialData){
            return{
                name: initialData.name || "",
                identification: initialData.identification || "",
                email: initialData.email || "",
                password: "", 
                photo: null, 
                salary: String(initialData.salary) || "", 
                selectedDays: initialData.selectedDays || [],
                workSchedule: initialData.workSchedule && initialData.workSchedule.length > 0
                    ? initialData.workSchedule.map((shift, index) => ({ 
                        ...shift,
                        id: `${initialData.scheduleId ?? 'sched'}-${index}`
                      }))
                    : [{ id: crypto.randomUUID(), entryTime: "", exitTime: "" }], // Horario por defecto si no hay o está vacío
                selectedShifts: initialData.selectedShifts || [], officeContact:initialData.officeContact || "",
            };
        }else{
            return{
                name: "",
                identification: "",
                email: "",
                password: "",
                photo: null as File | null,
                salary: "" as string,
                selectedDays: [] as string[], 
                workSchedule: [{ id: crypto.randomUUID(), entryTime: "", exitTime: "" }] as IShift[], 
                selectedShifts: [] as string[]
            }
        }
    });
    const isEditing = !!initialData;
    const formTitle = isEditing ? "Editar Personal " : "Agregar Personal ";


    /// Handler genérico para inputs de texto/email/password/archivos, etc
    const handleForm = (e: ChangeEvent<HTMLInputElement>) =>  {
        const { name, value, type, files } = e.target;
        if (type === 'file' && files) {
            setFormData(prevForm => ({
                ...prevForm,
                [name]: files[0],
            }));
        } else {
            setFormData(prevForm => ({
                ...prevForm,
                [name]: value,
            }));
        }
    };

   
    const handleDayChange = (dayLetter: string, isChecked: boolean) => {
        setFormData(prevForm => {
            const currentShift = prevForm.selectedDays;
            if (isChecked) {
                return { ...prevForm, selectedDays: [...currentShift, dayLetter] };
            } else {
                return { ...prevForm, selectedDays: currentShift.filter(d => d !== dayLetter) };
            }
        });
    };
     const handleShiftTypeChange = (shift: string, isChecked: boolean) => {
        setFormData(prevForm => {
            const currentDays = prevForm.selectedShifts;
            if (isChecked) {
                return { ...prevForm, selectedShifts: [...currentDays, shift] };
            } else {
                return { ...prevForm, selectedShifts: currentDays.filter(d => d !== shift) };
            }
        });
    };

    const handleWorkScheduleChange = (index: number, field: 'entryTime' | 'exitTime', value: string) => {
        setFormData(prevForm => ({
            ...prevForm,
            workSchedule: prevForm.workSchedule.map((shift, i) =>
                i === index ? { ...shift, [field]: value } : shift
            ),
        }));
    };

    
    const addCommonShift = () => {
        setFormData(prevForm => ({
            ...prevForm,
            workSchedule: [...prevForm.workSchedule, { id: crypto.randomUUID(), entryTime: "", exitTime: "" } as IShift],
        }));
    };

    
    const removeCommonShift = (idToRemove: string) => {
        setFormData(prevForm => ({
            ...prevForm,
            workSchedule: prevForm.workSchedule.filter(shift => shift.id !== idToRemove),
        }));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const finalFormData = {
            ...formData,
            scheduleId: initialData?.scheduleId ?? formData.scheduleId,
        };
        onSubmit(finalFormData, initialData?.id);
        console.log("Form Data Submitted:", JSON.stringify(formData, null, 2));
    };

    const currentlySelectedDays = formData.selectedDays;
    console.log(currentlySelectedDays + " Ha seleccionado esos dias");


    return (
        <>
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-12'>
                        <h1>
                            {formTitle} 
                            {isEditing ? (
                                <i className="bi bi-pencil-square"></i> // Icono para editar
                            ) : (
                                <i className="bi bi-person-plus-fill"></i> // Icono para agregar
                            )}
                            
                            </h1>
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                <label htmlFor='nameInput' className='form-label'>Nombre: <i className="bi bi-person-fill"></i></label>
                                <input type='text' name='name' id='nameInput' onChange={handleForm} value={formData.name} className='form-control' required />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='identificationInput'>Identificaci&oacute;n: <i className="bi bi-person-vcard-fill"></i></label>
                                <input type='text' name='identification' id='identificationInput' onChange={handleForm} value={formData.identification} className='form-control' required />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='emailInput'>Correo: <i className="bi bi-envelope-fill"></i></label>
                                <input type='email' name='email' id='emailInput' onChange={handleForm} value={formData.email} className='form-control' required />
                            </div>
                           {!isEditing && (
                                <div className='mb-3'>
                                    <label htmlFor='passwordInput'>Contrase&ntilde;a: <i className="bi bi-key-fill"></i></label>
                                    <input type='password' name='password' id='passwordInput' onChange={handleForm} value={formData.password} className='form-control' required={!isEditing} />
                                </div>
                            )}                         
                            <div className='mb-3'>
                                <label htmlFor='photoInput'>Fotograf&iacute;a: <i className="bi bi-images"></i></label>
                                <input type='file' name='photo' id='photoInput' onChange={handleForm} className='form-control' required={!isEditing} />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='salaryInput'>Sueldo: </label>
                                <input type='number' name='salary' id='salaryInput' onChange={handleForm} value={formData.salary} className='form-control' required />
                            </div>

                            {showShiftSelector && (
                                <ShiftTypeSelector
                                selectedShiftTypes={formData.selectedShifts}
                                onShiftTypeChange={handleShiftTypeChange}
                             />
                            )}
                            {showDaySelector && (
                                <DaySelector
                                    selectedDays={formData.selectedDays}
                                    onDayChange={handleDayChange}  
                                />
                            )}

                            {showHourSelector && (                          
                                <HourSelector
                                    shifts={formData.workSchedule}
                                    onUpdateShift={handleWorkScheduleChange}
                                    onAddShift={addCommonShift}
                                    onRemoveShift={removeCommonShift}
                                />
                            )}

                            {showOfficeContactField && (
                                <div className='mb-3'>
                                    <label htmlFor='officeContact'>Contacto de oficina: <i className="bi bi-telephone-fill"></i></label>
                                    <input
                                        type='tel'
                                        name='officeContact'
                                        id='officeContact'
                                        onChange={handleForm}
                                        value={formData.officeContact || ''}
                                        className='form-control'
                                    />
                                </div>
                            )}

                            <div className='mb-3'>
                                <button type="button" className='btn btn-secondary btn-sm me-3' onClick={onCancel}>Volver</button>
                                <input type='submit' value={"Guardar"} className='btn btn-primary btn-sm' />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EmployeeForm;