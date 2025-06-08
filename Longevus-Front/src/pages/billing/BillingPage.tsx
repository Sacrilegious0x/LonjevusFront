import React, { useEffect, useState } from "react";
import {
  getAllBillings,
  deleteBilling,
  type Billing,
  getBillingsByDate,
  getBillingsByPeriod
} from "../../services/BillingService";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";

const BillingPage = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const navigate = useNavigate();

  const loadBillings = async () => {
    try {
      const data = await getAllBillings();
      setBillings(data);
    } catch (error) {
      console.error("Error cargando facturas:", error);
    }
  };

  useEffect(() => {
    loadBillings();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar esta factura?")) {
      await deleteBilling(id);
      await loadBillings();
    }
  };

  const handleSearchByDate = async () => {
    if (selectedDate) {
      const data = await getBillingsByDate(selectedDate);
      setBillings(data);
    }
  };

  const handleSearchByPeriod = async () => {
    if (selectedPeriod) {
      const data = await getBillingsByPeriod(selectedPeriod);
      setBillings(data);
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Facturas</h2>

        <div className="row g-3 mb-3">
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button className="btn btn-outline-primary mt-1" onClick={handleSearchByDate}>Buscar por fecha</button>
          </div>

          <div className="col-md-3">
            <input
              type="text"
              placeholder="Periodo (ej. Marzo)"
              className="form-control"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            />
            <button className="btn btn-outline-primary mt-1" onClick={handleSearchByPeriod}>Buscar por período</button>
          </div>

          <div className="col-md-3">
            <button className="btn btn-secondary mt-4" onClick={loadBillings}>Limpiar Filtros</button>
          </div>

          <div className="col-md-3 text-end">
            <button className="btn btn-success mt-4" onClick={() => navigate("/facturas/nueva")}>
              + Nueva Factura
            </button>
          </div>
        </div>

        <table className="table table-bordered table-striped text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Consecutivo</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {billings.map((billing, index) => (
              <tr key={billing.id}>
                <td>{index + 1}</td>
                <td>{billing.consecutive}</td>
                <td>{billing.date}</td>
                <td>₡{billing.amount.toFixed(2)}</td>
                <td className="d-flex flex-row justify-content-center gap-1">
                  <button className="btn btn-info p-2" onClick={() => setSelectedBilling(billing)} title="Ver">
                    <i className="bi bi-eye"></i>
                  </button>
                  <button className="btn btn-warning p-2" onClick={() => navigate(`/facturas/editar/${billing.id}`)} title="Editar">
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="btn btn-danger p-2" onClick={() => handleDelete(billing.id!)} title="Eliminar">
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {billings.length === 0 && (
              <tr>
                <td colSpan={7}>No hay facturas encontradas.</td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedBilling && (
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalle de Factura</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedBilling(null)} />
                </div>
                <div className="modal-body">
                  <p><strong>Consecutivo:</strong> {selectedBilling.consecutive}</p>
                  <p><strong>Fecha:</strong> {selectedBilling.date}</p>
                  <p><strong>Monto:</strong> ₡{selectedBilling.amount.toFixed(2)}</p>
                  <p><strong>Método de Pago:</strong> {selectedBilling.paymentMethod}</p>
                  <p><strong>Periodo:</strong> {selectedBilling.period}</p>
                  <hr />
                  <p><strong>Administrador:</strong> {selectedBilling.administrator?.name}</p>
                  <p><strong>Residente:</strong> {selectedBilling.resident?.name}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedBilling(null)}>
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

export default BillingPage;
