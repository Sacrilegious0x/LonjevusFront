import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface SupplierData {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  photo: File | null;
  isActive: boolean;
}

export default function SuppliersEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SupplierData>({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    photo: null,
    isActive: true,
  });

  // Cargar datos del proveedor al montar
  useEffect(() => {
    async function fetchSupplier() {
      try {
        // TODO: Llamar a la API para obtener el proveedor por su ID
        // const response = await axios.get(`/api/suppliers/${id}`);
        // const data = response.data;
        // setFormData({
        //   name: data.name,
        //   phoneNumber: data.phoneNumber,
        //   email: data.email,
        //   address: data.address,
        //   photo: null, // o puedes convertir la URL en File si lo deseas
        //   isActive: data.isActive,
        // });
      } catch (error) {
        console.error('Error fetching supplier:', error);
      }
    }
    if (id) fetchSupplier();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        photo: file,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('email', formData.email);
      data.append('address', formData.address);
      if (formData.photo) {
        data.append('photo', formData.photo);
      }
      data.append('isActive', formData.isActive.toString());

      // TODO: Llamar a la API para actualizar el proveedor
      // await axios.put(`/api/suppliers/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });

      // Redirigir de vuelta a la lista
      navigate('/proveedores');
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  return (
    <>
      <Header />
      <div className='container mt-5 form-container'>
        <div className='row'>
          <div className='col-12'>
            <center>
              <h1 className='mt-2'>Editar Proveedor</h1>
            </center>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>Nombre:<i className="bi bi-person-fill"></i></label>
                <input type='text' id='name' name='name' value={formData.name} onChange={handleChange} className='form-control'required/>
              </div>
              <div className='mb-3'>
                <label htmlFor='phoneNumber' className='form-label'>Teléfono:<i className="bi bi-telephone-plus-fill"></i></label>
                <input type='text' id='phoneNumber' name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} className='form-control' required/>
              </div>
              <div className='mb-3'>
                <label htmlFor='email' className='form-label'>Correo:<i className="bi bi-envelope-fill"></i></label>
                <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} className='form-control' required/>
              </div>
              <div className='mb-3'>
                <label htmlFor='address' className='form-label'>Dirección:<i className="bi bi-compass"></i></label>
                <input type='text' id='address' name='address' value={formData.address} onChange={handleChange} className='form-control' required />
              </div>
              <div className='mb-3'>
                <label htmlFor='photo' className='form-label'>Fotografía:<i className="bi bi-image"></i></label>
                <input type='file' id='photo' name='photo' onChange={handleFileChange} className='form-control' accept='image/*' />
              </div>
              <div className='mb-3'>
                <button type='submit' className='btn btn-success'>Guardar cambios</button>
                <button type='button' className='btn btn-light m-1' onClick={() => navigate('/proveedores')}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}