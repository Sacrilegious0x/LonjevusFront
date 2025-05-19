import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";


interface Product {
  name: string;
  price: number;
  expirationDate: string; 
  category: string;
  unit: string;
  supplier: string;
  photoURL: string;
}


const categorias = ["Salud", "Limpieza", "Alimento", "Otro"];
const unidades = ["Unitario", "ml", "g", "kg", "Caja"];
const proveedores = ["Farmacia Central", "Distribuidora Salud", "Proveedor X"];

const getUnitId = (unidad: string): number => {
  const mapa: { [key: string]: number } = {
    "Unitario": 1,
    "ml": 2,
    "g": 3,
    "kg": 4,
    "Caja": 5
  };
  return mapa[unidad] || 1; 
};

const getSupplierId = (proveedor: string): number => {
  const mapa: { [key: string]: number } = {
    "Farmacia Central": 1,
    "Distribuidora Salud": 2,
    "Proveedor X": 3
  };
  return mapa[proveedor] || 1;
};

const AddProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product>({
    name: "",
    price: 0,
    expirationDate: "",
    category: "",
    unit: "",
    supplier: "",
    photoURL: "",
  });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const newProduct = {
    name: product.name,
    price: product.price,
    expirationDate: product.expirationDate,
    category: product.category,
    photoURL: product.photoURL,
    unit: { id: getUnitId(product.unit) }, 
    supplier: { id: getSupplierId(product.supplier) },
  };

  try {
    await axios.post("http://localhost:8080/api/products/add", newProduct);
    alert("Producto agregado exitosamente.");
    navigate("/productos");
  } catch (error) {
    console.error("Error al agregar producto:", error);
    alert("Error al agregar producto.");
  }
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setProduct(prev => ({ ...prev, [name]: value }));
};




  return (
    <div className="container mt-4">
      <h2>Agregar Nuevo Producto</h2>

      <button className="btn btn-secondary mb-3" onClick={() => navigate("/productos")}>
        ← Volver a Productos
      </button>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            name="name"
            type="text"
            className="form-control"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            name="price"
            type="number"
            className="form-control"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de Vencimiento</label>
          <input
            name="expirationDate"
            type="date"
            className="form-control"
            value={product.expirationDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select
            name="category"
            className="form-select"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Unidad de Medida</label>
          <select
            name="unit"
            className="form-select"
            value={product.unit}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una unidad</option>
            {unidades.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Proveedor</label>
          <select
            name="supplier"
            className="form-select"
            value={product.supplier}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">URL de la Foto</label>
          <input
            name="photoURL"
            type="text"
            className="form-control"
            value={product.photoURL}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">Agregar Producto</button>
      </form>
    </div>
  );
};

export default AddProduct;
