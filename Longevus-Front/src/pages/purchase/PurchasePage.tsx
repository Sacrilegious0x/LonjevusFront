import React, { useState, useEffect } from "react";
import StandardTable, { type Column } from "../../components/StandardTable";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import {
  getAllPurchases,
  deletePurchase,
  type Purchase,
} from "../../services/PurchaseService";

const PurchasePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const loadPurchases = async () => {
    try {
      const data = await getAllPurchases();
      setPurchases(data);
    } catch (error) {
      console.error("Error al obtener compras:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las compras.",
      });
    }
  };

  useEffect(() => {
    loadPurchases();
  }, [location]);

  const columns: Column<Purchase>[] = [
    { header: "#", accessor: "date", render: (_item, index) => index + 1 },
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
    Swal.fire({
      title: "Editar compra",
      text: `¿Deseas editar esta compra?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/compras/editar/${purchase.id}`);
      }
    });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Eliminar compra?",
      text: `Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deletePurchase(id);
        setPurchases((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "Compra eliminada correctamente.",
        });
      } catch (error) {
        console.error("Error al eliminar la compra:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la compra.",
        });
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
        <div className="d-flex justify-content-between mb-3">
          <div>
            <button
              className="btn btn-outline-dark ms-2"
              onClick={() => navigate("/compras/inactivas")}
            >
              Ver Compras Canceladas
            </button>
          </div>
          <div>
            <button
              className="btn btn-success"
              onClick={() => navigate("/compras/agregar")}
              title="Agregar Compra"
            >
              <i className="bi bi-cart-plus fs-5"></i>
            </button>
          </div>
        </div>

        <StandardTable<Purchase>
          data={purchases}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(item) => handleDelete(item.id!)}
          renderActions={(item) => (
            <div className="d-flex flex-row gap-1">
              <button
                className="btn btn-info p-2"
                onClick={() => handleView(item)}
                title="Ver"
              >
                <i className="bi bi-eye"></i>
              </button>
              <button
                className="btn btn-warning p-2"
                onClick={() => handleEdit(item)}
                title="Editar"
              >
                <i className="bi bi-pencil-square"></i>
              </button>
              <button
                className="btn btn-danger p-2"
                onClick={() => handleDelete(item.id!)}
                title="Eliminar"
              >
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
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedPurchase(null)}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Encargado:</strong> {selectedPurchase.admin?.name}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {selectedPurchase.date}
                  </p>
                  <p>
                    <strong>Monto Total:</strong> $
                    {selectedPurchase.amount.toFixed(2)}
                  </p>
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
                          <td>
                           {item.productName ?? 'Producto no disponible'}
                          </td>
                          <td>{item.quantity}</td>
                          <td>{item.expirationDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedPurchase(null)}
                  >
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
