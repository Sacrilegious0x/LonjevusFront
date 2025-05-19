import React, { useEffect, useState } from "react";
import axios from "axios";
import StandardTable, { type Column } from "../../components/StandardTable";
import "bootstrap/dist/css/bootstrap.min.css";
import CategoryFilter from "../../components/CategoryFilter";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  expirationDate: string;
  category: string;
  unit: { id: number; unit_type: string };
  supplier: { id: number; name: string };
  photoURL: string;
}

const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("Todos");

  // 🔁 Traer productos directamente usando axios
  const getAllProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products/all");
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const filteredProducts =
    filter === "Todos" ? products : products.filter((p) => p.category === filter);

  const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const handleEdit = (product: Product) => {
    navigate(`/productos/editar/${product.id}`);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`);
    if (confirmDelete) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const columns: Column<Product>[] = [
    { header: "#", accessor: "id" },
    { header: "Nombre", accessor: "name" },
    {
      header: "Precio",
      accessor: "price",
      render: (item) => `$${item.price.toFixed(2)}`
    },
    { header: "Fecha Vencimiento", accessor: "expirationDate" },
    { header: "Categoría", accessor: "category" },
    {
      header: "Unidad",
      accessor: "unit",
      render: (item) => item.unit.unit_type
    },
    {
      header: "Proveedor",
      accessor: "supplier",
      render: (item) => item.supplier.name
    },
    {
      header: "Foto",
      accessor: "photoURL",
      render: (item) => (
        <img
          src={item.photoURL}
          alt={item.name}
          className="img-thumbnail"
          width="60"
          height="60"
          style={{ objectFit: "cover" }}
        />
      )
    }
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Productos</h2>
        <button className="btn btn-success" onClick={() => navigate("/productos/agregar")}>
          + Agregar Producto
        </button>
      </div>

      <CategoryFilter value={filter} onChange={setFilter} options={uniqueCategories} />

      <StandardTable<Product>
        data={filteredProducts}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProductPage;
