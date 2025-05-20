import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableBasic from "../../components/TableBasic";
import type { columnDefinition } from "../../components/TableBasic";
import CategoryFilter from "../../components/CategoryFilter";
import DateFilter from "../../components/DateFilter";
import Footer from "../../components/Footer";
import Header from "../../components/HeaderAdmin";
import "bootstrap/dist/css/bootstrap.min.css";

type InventoryItem = {
  id: number;
  quantity: number;
  category: string;
  photoURL: string;
  product: {
    name: string;
    expirationDate: string | null;
    supplier: {
      name: string;
    };
  };
  purchase: {
    id: string;
  };
};

const InventoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const navigate = useNavigate();

  const getAllInventory = async (): Promise<InventoryItem[]> => {
    const res = await fetch("http://localhost:8080/api/inventory/all");
    if (!res.ok) {
      throw new Error("Error al obtener inventario");
    }
    return res.json();
  };

  useEffect(() => {
    getAllInventory()
      .then((data) => {
        setInventoryData(data);
      })
      .catch((err) => console.error("Error cargando inventario:", err));
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este ítem del inventario?");
    if (confirmed) {
      try {
        const res = await fetch(`http://localhost:8080/api/inventory/delete/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar");

        setInventoryData((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Error al eliminar inventario:", err);
      }
    }
  };

  const toggleRow = (id: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const selectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedRows(new Set(inventoryData.map((item) => item.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const columns: columnDefinition<InventoryItem>[] = [
    {
      header: "#",
      accessor: () => "",
      Cell: (_item, index) => index + 1,
    },
    { header: "Producto", accessor: (item) => item.product.name },
    {
      header: "Fecha de Vencimiento",
      accessor: (item) => item.product.expirationDate ?? "N/A",
    },
    {
      header: "Proveedor",
      accessor: (item) => item.product.supplier.name,
    },
    {
      header: "Id de la compra",
      accessor: (item) => item.purchase.id,
    },
    {
      header: "Fotografía",
      accessor: () => "",
      Cell: (item) => (
        <img
          src={item.photoURL}
          alt={item.product.name}
          className="img-thumbnail"
          width="60"
          height="60"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      header: "Acciones",
      accessor: () => "",
      Cell: (item) => (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDelete(item.id)}
        >
          Eliminar
        </button>
      ),
    },
  ];

  const categoryOptions = Array.from(
    new Set(inventoryData.map((item) => item.category).filter(Boolean))
  );

  const filteredData = inventoryData.filter((item) => {
    const categoryMatch =
      selectedCategory === "Todos" || item.category === selectedCategory;
    const dateMatch =
      !selectedDate || item.product.expirationDate === selectedDate;
    return categoryMatch && dateMatch;
  });

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h1>Inventario</h1>
        <div className="row mb-3">
          <div className="col-md-6">
            <CategoryFilter
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
            />
          </div>
          <div className="col-md-6">
            <DateFilter
              value={selectedDate}
              onChange={(dateStr) => {
                // Convertir a formato YYYY-MM-DD
                const isoDate = new Date(dateStr).toISOString().split("T")[0];
                setSelectedDate(isoDate);
              }}
            />
          </div>
        </div>
        <button
  className="btn btn-secondary mt-2"
  onClick={() => setSelectedDate("")}
>
  Limpiar búsqueda
</button>

        <p>
          Total de unidades en inventario:{" "}
          <strong>{filteredData.length}</strong>
        </p>
        <TableBasic<InventoryItem>
          data={filteredData}
          columns={columns}
          selectedRows={selectedRows}
          onToggleRow={toggleRow}
          onSelectAll={selectAll}
        />
      </div>
      <Footer />
    </>
  );
};

export default InventoryPage;