import React, { useState, useEffect } from "react";
import TableBasic from "../../components/TableBasic";
import type { columnDefinition } from "../../components/TableBasic";
import DateFilter from "../../components/DateFilter";
import Footer from "../../components/Footer";
import Header from "../../components/HeaderAdmin";
import Swal from "sweetalert2";

import {
  getAllInventory,
  deleteInventory,
  type InventoryItem,
} from "../../services/InventoryService";

const InventoryPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    getAllInventory()
      .then((data) => setInventoryData(data))
      .catch((err) => {
        console.error("Error cargando inventario:", err);
        Swal.fire("Error", "No se pudo cargar el inventario.", "error");
      });
  }, []);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteInventory(id);
      setInventoryData((prev) => prev.filter((item) => item.id !== id));
      await Swal.fire({
        title: "Eliminado",
        text: "El producto fue eliminado correctamente.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error al eliminar inventario:", err);
      Swal.fire("Error", "No se pudo eliminar el producto.", "error");
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
    setSelectedRows(
      isSelected ? new Set(inventoryData.map((i) => i.id)) : new Set()
    );
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
      header: "ID de Compra",
      accessor: (item) => item.purchase.id,
    },
    {
  header: "Foto",
  accessor: () => "",
  Cell: (item) => {
    const [imgError, setImgError] = useState(false);
    const url = `http://localhost:8080/${item.photoURL}`;

    return !imgError ? (
      <img
        src={url}
        alt={`Foto de ${item.product.name}`}
        width="60"
        height="60"
        className="img-thumbnail"
        style={{ objectFit: "cover" }}
        onError={() => {
          console.warn("⚠️ Imagen rota:", url);
          setImgError(true);
        }}
      />
    ) : (
      <span className="text-muted">Sin imagen</span>
    );
  },
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

  const filteredData = inventoryData.filter((item) =>
    selectedDate ? item.product.expirationDate === selectedDate : true
  );

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h1>Inventario</h1>
        <div className="row mb-3">
          <div className="col-md-6">
            <DateFilter
              value={selectedDate}
              onChange={(dateStr) => {
                const isoDate = new Date(dateStr).toISOString().split("T")[0];
                setSelectedDate(isoDate);
              }}
            />
          </div>
        </div>

        <button
          className="btn btn-secondary mb-3"
          onClick={() => setSelectedDate("")}
        >
          Limpiar búsqueda
        </button>

        <p>
          Total de productos: <strong>{filteredData.length}</strong>
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
