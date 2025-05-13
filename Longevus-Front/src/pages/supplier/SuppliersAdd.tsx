
import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';


export default function SuppliersAdd() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    photoUrl: '',
    isActive: true,
  });

  const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      photoUrl: URL.createObjectURL(file), // Ahora es un string
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
      data.append('dir', formData.address);
      data.append('photo', formData.photoUrl);
      data.append('isActive', formData.isActive.toString());

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };


      // Optionally redirect or reset form
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
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='form-control'
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='dir' className='form-label'>Dirección:<i className="bi bi-compass"></i></label>
                <input
                  type='text'
                  id='dir'
                  name='dir'
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
