import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import {
  getInactivePurchases,
  type Purchase,
} from "../../services/PurchaseService";

const InactivePurchasesPage = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const navigate = useNavigate();

  const loadInactive = async () => {
    try {
      const data = await getInactivePurchases();
      setPurchases(data);
    } catch (error) {
      console.error("Error al cargar compras inactivas:", error);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudieron cargar las compras canceladas." });
    }
  };

  useEffect(() => {
    loadInactive();
  }, []);

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Compras Canceladas</h2>
          <button className="btn btn-outline-dark" onClick={() => navigate("/compras")}>Volver a Compras</button>
        </div>

        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Administrador</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases.map((purchase, index) => (
                <tr key={purchase.id}>
                  <td>{index + 1}</td>
                  <td>{purchase.date}</td>
                  <td>${purchase.amount.toFixed(2)}</td>
                  <td>{purchase.admin?.name ?? "No asignado"}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => setSelectedPurchase(purchase)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No hay compras canceladas.</td>
              </tr>
            )}
          </tbody>
        </table>

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
                      {selectedPurchase.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.productName || `Producto #${item.idProduct}`}</td>
                          <td>{item.quantity}</td>
                          <td>{item.expirationDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedPurchase(null)}>Cerrar</button>
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

export default InactivePurchasesPage;
