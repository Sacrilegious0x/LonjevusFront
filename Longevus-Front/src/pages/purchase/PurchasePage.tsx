import React, { useState, useEffect } from "react";
import StandardTable, { type Column } from "../../components/StandardTable";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import axios from "axios";


interface PurchaseItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Purchase {
  id: number;
  date: string;
  totalAmount: number;
  managerName: string;
  items: PurchaseItem[];
}

const PurchasePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const mapPurchase = (purchase: any): Purchase => ({
    id: purchase.id,
    date: purchase.date,
    totalAmount: purchase.amount,
    managerName: purchase.admin?.name || "No asignado",
    items: purchase.items,
  });

  const getAllPurchases = async () => {
    const response = await axios.get("http://localhost:8080/api/purchases/all");
    return response.data;
  };

  const deletePurchase = async (id: number): Promise<void> => {
    await fetch(`http://localhost:8080/api/purchases/${id}`, {
      method: 'DELETE',
    });
  };

  useEffect(() => {
    getAllPurchases()
      .then((data) => {
        setPurchases(data.map(mapPurchase));
      })
      .catch((error) => console.error("Error al obtener compras:", error));
  }, [location]);

  const columns: Column<Purchase>[] = [
    {
      header: "#",
      accessor: "id",
      render: (_item, index) => index + 1,
    },
    { header: "Fecha", accessor: "date" },
    {
      header: "Monto",
      accessor: "totalAmount",
      render: (item) => `$${item.totalAmount.toFixed(2)}`,
    },
    { header: "Administrador", accessor: "managerName" },
  ];

  const handleEdit = (purchase: Purchase) => {
    navigate(`/compras/editar/${purchase.id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar la compra con ID ${id}?`);
    if (confirmDelete) {
      try {
        await deletePurchase(id);
        setPurchases(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error al eliminar la compra:", error);
      }
    }
  };

  const handleView = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
  };

  return (
    <>
    <Header/>
    <div className="container mt-4">
      <h2>Listado de Compras</h2>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success" onClick={() => navigate("/compras/agregar")}>
          <i className="bi bi-plus-lg"></i> Agregar Compra
        </button>
      </div>

      <StandardTable<Purchase>
        data={purchases}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderActions={(item) => (
          <>
            <button className="btn btn-sm btn-info" onClick={() => handleView(item)}>
              <i className="bi bi-eye"></i>
            </button>
            <button className="btn btn-sm btn-primary" onClick={() => handleEdit(item)}>
              <i className="bi bi-pencil"></i>
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
              <i className="bi bi-trash"></i>
            </button>
          </>
        )}
      />

      {selectedPurchase && (
        <div className="modal show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalle de Compra #{selectedPurchase.id}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedPurchase(null)} />
              </div>
              <div className="modal-body">
                <p><strong>Encargado:</strong> {selectedPurchase.managerName}</p>
                <p><strong>Fecha:</strong> {selectedPurchase.date}</p>
                <p><strong>Monto Total:</strong> ${selectedPurchase.totalAmount.toFixed(2)}</p>

                <table className="table table-bordered mt-3">
                  <thead className="table-secondary">
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPurchase.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedPurchase(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default PurchasePage;