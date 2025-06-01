import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createProduct } from "../services/ProductService";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { getSuppliers, type ISupplier } from "../services/SupplierService";

const categories = ["Salud", "Limpieza", "Alimento", "Otro"];
const units = ["Unitario", "ml", "g", "kg", "Caja"];

const AddProduct = () => {

  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState<boolean>(true);
  const [errorSuppliers, setErrorSuppliers] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    expirationDate: '',
    category: '',
    unit: '',
    supplier: '',
    photoUrl: '',
    isActive: true,
  });

    useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const supplierList = await getSuppliers();
        setSuppliers(supplierList);
      } catch (err) {
        setErrorSuppliers(err instanceof Error ? err.message : "Error desconocido al cargar proveedores");
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('expirationDate', formData.expirationDate);
      data.append('category', formData.category);
      data.append('unit', formData.unit);
      data.append('supplier', formData.supplier);
      data.append('isActive', formData.isActive.toString());

      if (selectedFile) {
        data.append('photo', selectedFile); //el archivo real
      }


      await createProduct(data);
      navigate('/proveedores');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (

    <>
      <Header />
      <div className='container mt-5 form-container'>
        <div className='row'>
          <div className="col-12">
             <center>
              <h1 className='mt-2'>Agregar Productos</h1>
             </center>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre:</label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Precio</label>
                <input
                  name="price"
                  id="price"
                  type="number"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de Vencimiento</label>
                <input
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                  className="form-control"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Unidad de Medida</label>
                <select
                  id="unit"
                  name="unit"
                  className="form-select"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una unidad</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="supplier" className="form-label">
                  Proveedor
                </label>
                <select
                  id="supplier"
                  name="supplier"
                  className="form-select"
                  value={formData.supplier}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un proveedor</option>
                  {suppliers.map((prov) => (
                    // Aquí hacemos que el value sea el id, pero lo que se muestre sea el name
                    <option key={prov.id} value={prov.id}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

                            {/* Foto */}
              <div className="mb-3">
                <label htmlFor="photoUrl" className="form-label">
                  Foto:
                </label>
                <input
                  id="photoUrl"
                  name="photoUrl"
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
                {/* Si quieres mostrar un preview antes de enviar:
                    {formData.photoUrl && (
                      <img
                        src={formData.photoUrl}
                        style={{ width: 100, marginTop: "10px" }}
                        alt="Previsualización"
                      />
                    )} 
                */}
              </div>
              <div className="mb-3">
                  <button type="submit" className="btn btn-success">Agregar Producto</button>
                  <a href='/productos' className='btn btn-light m-1'>Volver</a>
              </div> 
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddProduct;
