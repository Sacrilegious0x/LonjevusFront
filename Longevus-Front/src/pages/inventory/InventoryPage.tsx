import React, { useState, useEffect } from "react";
import type { ForwardedRef } from "react";
import TableBasic, { type columnDefinition } from "../../components/TableBasic";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import {
  getAllInventory,
  deleteInventory,
  type InventoryItem,
} from "../../services/InventoryService";

import { confirmDeleteAlert, succesAlert, errorAlert } from "../../js/alerts";

registerLocale("es", es);

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick }, ref: ForwardedRef<HTMLInputElement>) => (
    <input
      className="form-control"
      onClick={onClick}
      value={value}
      readOnly
      ref={ref}
      placeholder="Seleccione un mes"
    />
  )
);

const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    getAllInventory()
      .then((data) => setInventoryData(data))
      .catch((err) => {
        console.error("Error cargando inventario:", err);
        errorAlert("No se pudo cargar el inventario.");
      });
  }, []);

  const handleDelete = async (id: number, name: string) => {
    const result = await confirmDeleteAlert(name);
    if (!result.isConfirmed) return;

    try {
      await deleteInventory(id);
      setInventoryData((prev) => prev.filter((item) => item.id !== id));
      succesAlert("Eliminado", "El producto fue eliminado correctamente.");
    } catch (err) {
      console.error("Error al eliminar inventario:", err);
      errorAlert("No se pudo eliminar el producto.");
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
      isSelected ? new Set(filteredData.map((i) => i.id)) : new Set()
    );
  };

  const formatDate = (isoString: string | null): string => {
    if (!isoString) return "N/A";
    const [year, month, day] = isoString.split("-");
    return `${day}/${month}/${year}`;
  };

  const filteredData = inventoryData.filter((item) => {
    const matchCategory = selectedCategory
      ? item.product.category === selectedCategory
      : true;

    const matchDate = selectedDate
      ? item.expirationDate &&
        new Date(item.expirationDate).getMonth() === selectedDate.getMonth() &&
        new Date(item.expirationDate).getFullYear() ===
          selectedDate.getFullYear()
      : true;

    return matchCategory && matchDate;
  });

  const columns: columnDefinition<InventoryItem>[] = [
    {
      header: "#",
      accessor: () => "",
      Cell: (_item, index) => index + 1,
    },
    {
      header: "Producto",
      accessor: (item) => item.product.name,
    },
    {
      header: "Fecha de Vencimiento",
      accessor: (item) => item.expirationDate ?? "N/A",
      Cell: (item) => formatDate(item.expirationDate),
    },
    {
      header: "Foto",
      accessor: () => "",
      Cell: (item) => {
        const url = `http://localhost:8080/${item.photoURL}`;
        return (
          <img
            src={url}
            alt={`Foto de ${item.product.name}`}
            width="60"
            height="60"
            className="img-thumbnail"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.png"; // reemplazo si imagen rota
            }}
          />
        );
      },
    },
    {
      header: "Acciones",
      accessor: () => "",
      Cell: (item) => (
        <>
          <button
            className="btn btn-info btn-sm me-1"
            onClick={() => setSelectedItem(item)}
            title="Ver detalles"
          >
            <i className="bi bi-eye"></i>
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(item.id, item.product.name)}
            title="Eliminar"
          >
            <i className="bi bi-trash"></i>
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      {/* <Header /> */}
      <div className="container mt-4">
        <h1>Inventario</h1>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Filtrar por categoría:</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedDate(null);
              }}
            >
              <option value="">-- Seleccionar Categoría --</option>
              <option value="Salud">Salud</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Alimento">Alimento</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        {selectedCategory && (
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">
                Filtrar por fecha de vencimiento:
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                locale="es"
                customInput={<CustomInput />}
              />
            </div>
          </div>
        )}

        <button
          className="btn btn-secondary mb-3"
          onClick={() => {
            setSelectedCategory("");
            setSelectedDate(null);
          }}
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
      {selectedItem && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalle del Producto</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedItem(null)}
                />
              </div>
              <div className="modal-body">
                <p>
                  <strong>Nombre:</strong> {selectedItem.product.name}
                </p>
                <p>
                  <strong>Categoría:</strong> {selectedItem.product.category}
                </p>
                <p>
                  <strong>Fecha de vencimiento:</strong>{" "}
                  {formatDate(selectedItem.expirationDate)}
                </p>
                <p>
                  <strong>Proveedor:</strong>{" "}
                  {selectedItem.product.supplier.name}
                </p>
                <p>
                  <strong>ID de compra:</strong> {selectedItem.purchase.id}
                </p>
                <img
                  src={`http://localhost:8080/${selectedItem.photoURL}`}
                  alt="Foto producto"
                  className="img-fluid rounded mt-3"
                  style={{ maxHeight: 200 }}
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = "/placeholder.png")
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedItem(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <Footer /> */}
    </>
  );
};

export default InventoryPage;
