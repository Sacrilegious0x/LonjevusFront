import React, { useEffect, useState } from "react";
import {
  getInactiveBillings,
  getBillingsByDate,
} from "../../services/BillingService";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";

type Billing = {
  id?: number;
  consecutive?: string;
  date: string;
  amount: number;
  period: string;
  paymentMethod: string;
  isActive?: boolean;
  administrator: { id: number; name?: string };
  resident: { id: number; name?: string };
};

const InactiveBillingsPage = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const navigate = useNavigate();

  const loadInactive = async () => {
    const data = await getInactiveBillings();
    setBillings(data);
  };

  const handleSearchByDate = async (value: string) => {
    setSelectedDate(value);

    if (value) {
      const data = await getBillingsByDate(value);
      const inactives = data.filter((b) => !b.isActive);
      setBillings(inactives);
    }
  };

  useEffect(() => {
    loadInactive();
  }, []);

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Facturas Canceladas</h2>

        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => handleSearchByDate(e.target.value)}
            />
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-6 text-end">
            <button className="btn btn-secondary" onClick={loadInactive}>
              Limpiar Filtros
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
                  <button
                    className="btn btn-info p-2"
                    onClick={() => setSelectedBilling(billing)}
                    title="Ver"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button
                    className="btn btn-warning p-2"
                    onClick={() => navigate(`/facturas/editar/${billing.id}`)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>
              </tr>
            ))}
            {billings.length === 0 && (
              <tr>
                <td colSpan={5}>No hay facturas canceladas.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mb-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/facturas")}
          >
            ← Volver
          </button>
        </div>

        {selectedBilling && (
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalle de Factura</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedBilling(null)}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Consecutivo:</strong> {selectedBilling.consecutive}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {selectedBilling.date}
                  </p>
                  <p>
                    <strong>Monto:</strong> ₡{selectedBilling.amount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Método de Pago:</strong>{" "}
                    {selectedBilling.paymentMethod}
                  </p>
                  <p>
                    <strong>Periodo:</strong> {selectedBilling.period}
                  </p>
                  <hr />
                  <p>
                    <strong>Administrador:</strong>{" "}
                    {selectedBilling.administrator?.name}
                  </p>
                  <p>
                    <strong>Residente:</strong> {selectedBilling.resident?.name}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedBilling(null)}
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

export default InactiveBillingsPage;
