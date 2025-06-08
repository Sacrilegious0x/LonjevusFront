import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBilling, type Billing } from "../../services/BillingService";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";

const AddBilling = () => {
  const navigate = useNavigate();

  const [billing, setBilling] = useState<Billing>({
    date: "",
    amount: 0,
    period: "",
    paymentMethod: "",
    administrator: { id: 1 }, // Cambiar si hay login
    resident: { id: 1 },      // Cambiar a selección dinámica si lo deseas
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBilling((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBilling(billing);
      alert("Factura creada con éxito.");
      navigate("/facturas");
    } catch (error) {
      console.error("Error al crear factura:", error);
      alert("Error al crear factura.");
    }
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
            <label className="form-label">Monto:</label>
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

          {/* ID de residente fijo o seleccionable */}
          <div className="mb-3">
            <label className="form-label">ID del Residente:</label>
            <input
              type="number"
              className="form-control"
              value={billing.resident.id}
              onChange={(e) =>
                setBilling((prev) => ({
                  ...prev,
                  resident: { id: parseInt(e.target.value) },
                }))
              }
              required
            />
          </div>

          <button type="submit" className="btn btn-success">Guardar Factura</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/facturas")}>
            Cancelar
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddBilling;
