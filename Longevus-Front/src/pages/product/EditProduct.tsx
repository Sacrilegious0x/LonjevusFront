import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

interface Product {
  id: number;
  nombre: string;
  precio: number;
  fechaVencimiento: string;
  categoria: string;
  unidad: string;
  proveedor: string;
  fotoUrl: string;
}

const categoriasDisponibles = ["Salud", "Limpieza", "Alimento", "Otro"];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        const data = res.data;
        setProduct({
          id: data.id,
          nombre: data.name,
          precio: data.price,
          fechaVencimiento: data.expirationDate,
          categoria: data.category,
          unidad: data.unit.name,
          proveedor: data.supplier.name,
          fotoUrl: data.photoURL,
        });
      })
      .catch((err) => {
        console.error("Error al cargar el producto:", err);
        alert("Error al cargar producto.");
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const updatedProduct = {
      name: product.nombre,
      price: product.precio,
      expirationDate: product.fechaVencimiento,
      category: product.categoria,
      photoURL: product.fotoUrl,
      unit: { name: product.unidad },
      supplier: { name: product.proveedor },
    };

    try {
      await axios.put(`http://localhost:8080/api/products/${id}`, updatedProduct);
      alert("Producto actualizado correctamente.");
      navigate("/productos");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Ocurrió un error al actualizar el producto.");
    }
  };

  if (!product) {
    return <div className="container mt-4">Cargando producto...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Editar Producto #{id}</h2>
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/productos")}>
        ← Volver a Productos
      </button>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input name="nombre" type="text" className="form-control" value={product.nombre} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input name="precio" type="number" className="form-control" value={product.precio} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Vencimiento</label>
          <input name="fechaVencimiento" type="date" className="form-control" value={product.fechaVencimiento} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select name="categoria" className="form-select" value={product.categoria} onChange={handleChange}>
            {categoriasDisponibles.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Unidad</label>
          <input name="unidad" type="text" className="form-control" value={product.unidad} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Proveedor</label>
          <input name="proveedor" type="text" className="form-control" value={product.proveedor} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">URL de la Foto</label>
          <input name="fotoUrl" type="text" className="form-control" value={product.fotoUrl} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditProduct;
