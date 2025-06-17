
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { getSuppliers, type ISupplier } from "../../services/SupplierService";

import { getProductById, getUnits, updateProduct, type IUnit, type RawProduct } from "../../services/ProductService";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { confirmEditAlert, succesAlert } from "../../js/alerts";
getProductById
interface FormState {
  name: string;
  price: string;
  expirationDate: string; // "yyyy-MM-dd"
  category: string;
  unitId: string;      
  supplierId: string;  
  isActive: boolean;
  // photoUrl lo usamos solo para previsualizar o para mostrar un string vacío.
  // No es lo mismo que el archivo real, que guardamos en selectedFile.
  photoUrl: string;
}




const categories = ["Salud", "Limpieza", "Alimento", "Otro"];

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

 //manejar inputs vacios
 const [touched, setTouched] = useState<Record<string, boolean>>({});
 const [errors, setErrors] = useState<Record<string, string>>({});

  // Listas desplegables
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [units, setUnits] = useState<IUnit[]>([]);

  // Carga y error de proveedores/unidades
  const [loadingSuppliers, setLoadingSuppliers] = useState<boolean>(true);
  const [errorSuppliers, setErrorSuppliers] = useState<string | null>(null);
  const [loadingUnits, setLoadingUnits] = useState<boolean>(true);
  const [errorUnits, setErrorUnits] = useState<string | null>(null);

  // Carga y error del producto actual
  const [loadingProduct, setLoadingProduct] = useState<boolean>(true);
  const [errorProduct, setErrorProduct] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<FormState>({
    name: "",
    price: "",
    expirationDate: "",
    category: "",
    unitId: "",
    supplierId: "",
    isActive: true,
    photoUrl: "",
  });

  // Para manejar el archivo .jpg/.png nuevo (si el usuario reemprueba foto)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  //  Traer la lista de proveedores 
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const list = await getSuppliers();
        setSuppliers(list);
      } catch (err) {
        setErrorSuppliers(err instanceof Error ? err.message : "Error desconocido al cargar proveedores");
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  // Traer la lista de unidades
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const list = await getUnits();
        setUnits(list);
      } catch (err) {
        setErrorUnits(err instanceof Error ? err.message : "Error desconocido al cargar unidades");
      } finally {
        setLoadingUnits(false);
      }
    };
    fetchUnits();
  }, []);

  //Traer el producto por ID y rellenar el formulario 
  useEffect(() => {
    if (!id) return;

  const fetchProduct = async () => {
    try {
      // Recibimos todo el objeto anidado
      const prod: RawProduct = await getProductById(id);

      // Extraemos únicamente los IDs de unit y supplier:
      const unitIdString = prod.unit.id.toString();
      const supplierIdString = prod.supplier.id.toString();

      // Rellenamos el formulario con valores planos
      setFormData({
        name: prod.name,
        price: prod.price.toString(),
        expirationDate: prod.expirationDate, // "yyyy-MM-dd"
        category: prod.category,
        unitId: unitIdString,       
        supplierId: supplierIdString, // p. ej. "2"
        photoUrl: prod.photoURL,     // ojo que el backend lo llamó "photoURL"
        isActive:prod.isActive
      });
    } catch (err) {
      setErrorProduct(err instanceof Error ? err.message : "Error al cargar el producto");
    } finally {
      setLoadingProduct(false);
    }
  };

    fetchProduct();
  }, [id]);

  //Manejo de inputs 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cuando el usuario elige un archivo nuevo:
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Previsualización local (URL temporal):
      setFormData((prev) => ({
        ...prev,
        photoUrl: URL.createObjectURL(file),
      }));
    }
  };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setTouched(target => ({ ...target, [name]: true }));
  
  
      setErrors(err => ({
        ...err,
        [name]: value.trim() ? '' : 'Este campo es obligatorio'}));
    };

  //  Submit de la actualización
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = new FormData();
      // Siempre incluimos el ID 
      data.append("id", id!);
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("expirationDate", formData.expirationDate);
      data.append("category", formData.category);
      data.append("unitId", formData.unitId);
      data.append("supplierId", formData.supplierId);
      data.append("isActive", formData.isActive.toString());

      // Si selecciono una foto nueva lo enviamos; 
      // si no no incluimos “photo” y el backend debe mantener la foto antigua
      if (selectedFile) {
        data.append("photo", selectedFile);
      }

       const response = await confirmEditAlert(formData.name);

      if(response.isConfirmed){

      await updateProduct(data);
      succesAlert("Actualizado",`Producto actualizado exitosamente`)
      navigate("/productos");
      }else{
        console.log("No se actualizo el producto");
      }
    } catch (error) {
      console.error("Error actualizando producto:", error);
    }
  };

  //  6) Manejo de estados de carga/error 
  if (loadingSuppliers || loadingUnits || loadingProduct) {
    return (
      <>
        <Header />
        <div className="container mt-5">Cargando datos…</div>
        <Footer />
      </>
    );
  }

  if (errorSuppliers || errorUnits || errorProduct) {
    return (
      <>
        <Header />
        <div className="container mt-5 text-danger">
          {errorSuppliers ?? errorUnits ?? errorProduct}
        </div>
        <Footer />
      </>
    );
  }

  // Formulario ya listo para editar
  return (
    <>
      {/* <Header /> */}
      <div className="container mt-5 form-container">
        <div className="row">
          <div className="col-12">
            <center>
              <h1 className="mt-2">Editar Producto</h1>
            </center>
            <form onSubmit={handleSubmit}>
              {/* Nombre */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Nombre:
                </label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.name && errors.name && (
                  <div className="invalid-feedback">
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Precio */}
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Precio en ₡:
                </label>
                <input
                  name="price"
                  id="price"
                  type="number"
                  className={`form-control ${touched.price && errors.price ? 'is-invalid' : ''}`}
                  value={formData.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.price && errors.price && (
                  <div className="invalid-feedback">
                    {errors.price}
                  </div>
                )}
              </div>

              {/* Fecha de vencimiento */}
              <div className="mb-3">
                <label htmlFor="expirationDate" className="form-label">
                  Fecha de Vencimiento:
                </label>
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

              {/* Categoría */}
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Categoría:
                </label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unidad de Medida */}
              <div className="mb-3">
                <label htmlFor="unitId" className="form-label">
                  Unidad de Medida:
                </label>
                <select
                  id="unitId"
                  name="unitId"
                  className="form-select"
                  value={formData.unitId}      // Por ejemplo, "3"
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una unidad:</option>
                  {units.map((u) => (
                    // Convertimos el id (number) a string, para que coincida con formData.unitId
                    <option key={u.id} value={u.id.toString()}>
                      {u.unitType}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proveedor */}
              <div className="mb-3">
                <label htmlFor="supplierId" className="form-label">
                  Proveedor:
                </label>
                <select
                  id="supplierId"
                  name="supplierId"
                  className="form-select"
                  value={formData.supplierId}  // Por ejemplo, "5"
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un proveedor:</option>
                  {suppliers.map((prov) => (
                    <option key={prov.id} value={prov.id.toString()}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Foto actual / previsualización */}
              <div className="mb-3">
                Foto Nueva:
                <input
                  id="photoUrl"
                  name="photoUrl"
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <small className="text-muted">
                  Si no seleccionas un archivo nuevo, se mantendrá la foto actual.
                </small>
              </div>

              <div className="mb-3">
                <button type="submit" className="btn btn-primary">
                  Guardar 
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => navigate("/productos")}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default EditProduct;

