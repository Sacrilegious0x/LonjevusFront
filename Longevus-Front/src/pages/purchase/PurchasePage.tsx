import React, { useState, useEffect } from "react";
import StandardTable, { type Column } from "../../components/StandardTable";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import {
  getAllPurchases,
  deletePurchase,
  type Purchase
} from "../../services/PurchaseService";

const PurchasePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    getAllPurchases()
      .then((data) => setPurchases(data))
      .catch((error) => console.error("Error al obtener compras:", error));
  }, [location]);

  const columns: Column<Purchase>[] = [
    {
      header: "#",
      accessor: "date",
      render: (_item, index) => index + 1,
    },
    { header: "Fecha", accessor: "date" },
    {
      header: "Monto",
      accessor: "amount",
      render: (item) => `$${item.amount.toFixed(2)}`,
    },
    {
      header: "Administrador",
      accessor: "admin",
      render: (item) => item.admin?.name ?? "No asignado",
    },
  ];

  const handleEdit = (purchase: Purchase) => {
    navigate(`/compras/editar/${purchase.id}`);
  };

  const handleDelete = async (id: string) => {
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
      <Header />
      <div className="container mt-4">
        <h2>Listado de Compras</h2>
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-success"
            onClick={() => navigate("/compras/agregar")}
            title="Agregar Compra"
          >
            <i className="bi bi-cart-plus fs-5"></i>
          </button>
        </div>

        <StandardTable<Purchase>
          data={purchases}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(item) => handleDelete(item.id!)}
          renderActions={(item) => (
            <div className="d-flex flex-row gap-1">
              <button className="btn btn-info p-2" onClick={() => handleView(item)} title="Ver">
                <i className="bi bi-eye"></i>
              </button>
              <button className="btn btn-warning p-2" onClick={() => handleEdit(item)} title="Editar">
                <i className="bi bi-pencil-square"></i>
              </button>
              <button className="btn btn-danger p-2" onClick={() => handleDelete(item.id!)} title="Eliminar">
                <i className="bi bi-trash"></i>
              </button>
            </div>
          )}
        />

        {selectedPurchase && (
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalle de Compra</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedPurchase(null)} />
                </div>
                <div className="modal-body">
                  <p><strong>Encargado:</strong> {selectedPurchase.admin?.name}</p>
                  <p><strong>Fecha:</strong> {selectedPurchase.date}</p>
                  <p><strong>Monto Total:</strong> ${selectedPurchase.amount.toFixed(2)}</p>

                  <table className="table table-bordered mt-3">
                    <thead className="table-secondary">
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Fecha de Vencimiento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPurchase.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.productName || `Producto #${item.idProduct}`}</td>
                          <td>{item.quantity}</td>
                          <td>{item.expirationDate}</td>
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
      <Footer />
    </>
  );
};

export default PurchasePage;
