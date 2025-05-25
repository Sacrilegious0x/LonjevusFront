import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/HeaderAdmin';
import Footer from '../../components/Footer';
import { updateSupplier,getSupplierById } from '../../pages/services/SupplierService'

interface SupplierData {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  photoUrl: string;
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
    photoUrl: '',
    isActive: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Cargar datos del proveedor al llamar
  useEffect(() => {
    async function fetchSupplier() {
      try {
        const response = getSupplierById(id);
        const data = await response;
        setFormData({
         name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          address: data.address,
          photoUrl: data.photo,
          isActive: data.isActive,
        });
      } catch (error) {
        console.error('Error fetching supplier:', error);
      }
    }
    if (id) fetchSupplier();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFormData({
        ...formData,
        photoUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('id', id!)
      data.append('name', formData.name);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('email', formData.email);
      data.append('address', formData.address);
      if (selectedFile) {
        data.append('photo', selectedFile);
      } 
      data.append('isActive', formData.isActive.toString());

      updateSupplier(data);

      navigate('/proveedores');
    } catch (error) {
      console.error('Error updating supplier: ', error);
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
                <input type='text' id='name' name='name' value={formData.name} onChange={handleChange} className='form-control' required />
              </div>
              <div className='mb-3'>
                <label htmlFor='phoneNumber' className='form-label'>Teléfono:<i className="bi bi-telephone-plus-fill"></i></label>
                <input type='text' id='phoneNumber' name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} className='form-control' required />
              </div>
              <div className='mb-3'>
                <label htmlFor='email' className='form-label'>Correo:<i className="bi bi-envelope-fill"></i></label>
                <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} className='form-control' required />
              </div>
              <div className='mb-3'>
                <label htmlFor='address' className='form-label'>Dirección:<i className="bi bi-compass"></i></label>
                <input type='text' id='address' name='address' value={formData.address} onChange={handleChange} className='form-control' required />
              </div>
              <div className='mb-3'>
                <div className='mb-3'>
                  <img
                    src={`http://localhost:8080/${formData.photoUrl}`}
                    alt="Foto proveedor"
                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                  />
                </div>
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