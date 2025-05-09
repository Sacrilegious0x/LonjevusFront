
import React, { useState } from 'react';

const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    dir: '',
    photo: null,
    isActive: '',
  });

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {

  
    
  };

export default function SuppliersAdd() {

    return (

        <>
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-12'>
                        <h1>Agregar Proveedores</h1>
                        <form>
                            <div className='mb-3'>
                                <label className='form-label'>Nombre: </label>
                                <input type='text' name='name' onChange={handleForm} value={formData.name} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <label>Teléfono: </label>
                                <input type='text' name='phoneNumber' onChange={handleForm}value={formData.phoneNumber} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <label>Correo: </label>
                                <input type='text' name='email' onChange={handleForm} value={formData.email} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <label>Direccion </label>
                                <input type='text' name='dir' onChange={handleForm} value={formData.dir} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <label>Fotografia: </label>
                                <input type='file' name='photo' onChange={handleForm} className='form-control' required/>
                            </div>

                            <div className='mb-3'>
                                <label>Activo: </label>
                                <input type='number' name='isActive' onChange={handleForm} value={formData.isActive} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <input type='submit' value={"Guardar"} className='btn btn-primary' required/>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
            
        </>



    );

}