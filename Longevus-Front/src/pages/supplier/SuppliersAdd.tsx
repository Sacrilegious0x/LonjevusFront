
import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SuppliersAdd() {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    photoUrl: '',
    isActive: true,
  });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFormData({
      ...formData,
      photoUrl: URL.createObjectURL(file), // opcional, para previsualizar
    });
  }
};


  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('email', formData.email);
      data.append('address', formData.address);
      data.append('isActive', formData.isActive.toString());

      if (selectedFile) {
      data.append('photo', selectedFile); //el archivo real
    }

     const config = {headers: {'Content-Type': 'multipart/form-data',},};

      const res = await axios.post(
        'http://localhost:8080/suppliers/save', // tu endpoint de POST
        data,config
      );
      console.log('Proveedor guardado:', res.data);

      // 4. Rediriges o limpias el formulario
      //useNavigate('/proveedores');

      console.log('Guardado:', res.data);
      navigate('/proveedores');
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  return (
    <>
      <Header />
      <div className='container mt-5 form-container'>
        <div className='row'>
          <div className='col-12'>
            <center>
              <h1 className='mt-2'>Agregar Proveedores</h1>
            </center>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>Nombre:<i className="bi bi-person-fill"></i></label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className='form-control'
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='phoneNumber' className='form-label'>Teléfono:<i className="bi bi-telephone-plus-fill"></i></label>
                <input
                  type='text'
                  id='phoneNumber'
                  name='phoneNumber'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className='form-control'
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='email' className='form-label'>Correo:<i className="bi bi-envelope-fill"></i></label>
                <input
                  type='text'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='form-control'
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='address' className='form-label'>Dirección:<i className="bi bi-compass"></i></label>
                <input
                  type='text'
                  id='address'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  className='form-control'
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='photo' className='form-label'>Fotografía:<i className="bi bi-image"></i></label>
                <input
                  type='file'
                  id='photo'
                  name='photo'
                  onChange={handleFileChange}
                  className='form-control'
                  accept='image/*'
                  required
                />
              </div>

              <div className='mb-3'>
                <button type='submit' className='btn btn-success'>Guardar</button>
                <a href='/proveedores' className='btn btn-light m-1'>Volver</a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
