
import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';


export default function SuppliersAdd() {

    const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    dir: '',
    photo: null,
    isActive: '',
    });

    return (
        <>
        <Header/>
            <div className='container mt-5 form-container'>
                <div className='row'>
                    <div className='col-12'>
                        <center><h1 className="mt-2">Agregar Proveedores</h1></center>
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