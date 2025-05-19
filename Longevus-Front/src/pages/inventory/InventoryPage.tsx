import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableBasic from "../../components/TableBasic";
import type { columnDefinition } from "../../components/TableBasic";
import CategoryFilter from "../../components/CategoryFilter";
import DateFilter from "../../components/DateFilter";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";



type InventoryItem = {
  id: number;
  quantity: number;
  category: string;
  photoURL: string;
  product: {
    name: string;
    expirationDate: string;
    supplier: {
      name: string;
    };
  };
  purchase: {
    id: number;
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
      .then(setInventoryData)
      .catch((err) => console.error("Error cargando inventario:", err));
  }, []);

  const handleEdit = (item: InventoryItem) => {
    navigate(`/inventario/editar/${item.id}`);
  };

  const handleDelete = (id: number) => {
    console.log("Eliminar inventario con ID:", id);
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
    { header: "#", accessor: "id" },
    { header: "Producto", accessor: (item) => item.product.name },
    { header: "Cantidad", accessor: "quantity" },
    {
      header: "Fecha de Vencimiento",
      accessor: (item) => item.product.expirationDate,
    },
    {
      header: "Proveedor",
      accessor: (item) => item.product.supplier.name,
    },
    {
      header: "Id de la compra",
      accessor: (item) => `COMP-${item.purchase.id.toString().padStart(3, "0")}`,
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
            <DateFilter value={selectedDate} onChange={setSelectedDate} />
          </div>
        </div>
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
