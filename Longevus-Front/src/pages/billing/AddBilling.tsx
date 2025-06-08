import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBilling, type Billing } from "../../services/BillingService";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import axios from "axios";

interface Resident {
  id: number;
  name: string;
  photo: string;
}

const AddBilling = () => {
  const navigate = useNavigate();

  const [residents, setResidents] = useState<Resident[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [billing, setBilling] = useState<Billing & { residentName?: string }>({
  date: new Date().toISOString().split("T")[0],
  amount: 0,
  period: "",
  paymentMethod: "",
  administrator: { id: 1 },
  resident: { id: 0 },
  residentName: "", // nuevo
});


  useEffect(() => {
    axios.get("http://localhost:8080/residents").then((res) => {
      setResidents(res.data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBilling((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (billing.resident.id === 0) {
      alert("Debe seleccionar un residente.");
      return;
    }
    try {
      await createBilling(billing);
      alert("Factura creada con éxito.");
      navigate("/facturas");
    } catch (error) {
      console.error("Error al crear factura:", error);
      alert("Error al crear factura.");
    }
  };

  const handleSelectResident = (id: number, name: string) => {
  setBilling((prev) => ({
    ...prev,
    resident: { id },
    residentName: name
  }));
  setShowModal(false);
};


  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Agregar Nueva Factura</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Fecha:</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={billing.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Monto (₡):</label>
            <input
              type="number"
              name="amount"
              className="form-control"
              value={billing.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Período:</label>
            <input
              type="text"
              name="period"
              className="form-control"
              value={billing.period}
              onChange={handleChange}
              required
              placeholder="Ej: Ene-Jul"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Método de Pago:</label>
            <select
              name="paymentMethod"
              className="form-select"
              value={billing.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Sinpe">Sinpe</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>
          </div>

          {/* Botón para elegir residente */}
          <div className="mb-3">
            <label className="form-label">Residente:</label><br />
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setShowModal(true)}
            >
              Seleccionar Residente
            </button>
            {billing.resident.id !== 0 && (
              <p className="mt-2">ID seleccionado: {billing.resident.id}</p>
            )}
          </div>

          <button type="submit" className="btn btn-success">
            Guardar Factura
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate("/facturas")}
          >
            Cancelar
          </button>
        </form>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Seleccionar Residente</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  {residents.map((r) => (
                    <div className="col-md-4 mb-3" key={r.id}>
                      <div
                        className="card h-100"
                        onClick={() => handleSelectResident(r.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={`http://localhost:8080/${r.photo}`}
                          className="card-img-top"
                          alt={r.name}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body text-center">
                          <h6 className="card-title">{r.name}</h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AddBilling;
