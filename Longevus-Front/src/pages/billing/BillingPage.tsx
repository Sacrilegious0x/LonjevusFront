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
              <th>Método de Pago</th>
              <th>Periodo</th>
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
                <td>{billing.paymentMethod}</td>
                <td>{billing.period}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => navigate(`/facturas/editar/${billing.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => billing.id && handleDelete(billing.id)}
                  >
                    Eliminar
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
      </div>
      <Footer />
    </>
  );
};

export default BillingPage;
