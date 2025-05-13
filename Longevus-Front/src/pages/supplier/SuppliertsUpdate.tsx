import { useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";


export default function SuppliersEdit() {

    const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    dir: '',
    photo: null,
    isActive: '',
  });

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

    };
    return new Promise(resolve => setTimeout(() => resolve(dummyData), 500)); // Simula retardo de red
};


    return (
        <>
        <Header/>
            <div className='container mt-5 form-container'>
                <div className='row'>
                    <div className='col-12'>
                        <center><h1 className="mt-2">Editar Proveedores</h1></center>
                        <form>
                            <div className='mb-3'>
                                <label className='form-label'>Nombre: </label>
                                <input type='text' name='name'  value={formData.name} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <label>Teléfono: </label>
                                <input type='text' name='phoneNumber' value={formData.phoneNumber} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <label>Correo: </label>
                                <input type='text' name='email' value={formData.email} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <label>Direccion </label>
                                <input type='text' name='dir'  value={formData.dir} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <label>Fotografia: </label>
                                <input type='file' name='photo'  className='form-control' required/>
                            </div>

                            <div className='mb-3'>
                                <input type='hidden' name='isActive'  value={formData.isActive} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <input type='submit' value={"Guardar"} className='btn btn-success' required/>
                                <a href="/proveedores" className="btn btn-light m-1">Volver</a>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        <Footer/>
        </>
    );

}