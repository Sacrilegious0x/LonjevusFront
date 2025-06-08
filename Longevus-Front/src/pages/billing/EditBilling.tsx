import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBillingById,
  updateBilling,
  type Billing,
} from "../../services/BillingService";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";

const EditBilling = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [billing, setBilling] = useState<Billing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getBillingById(parseInt(id)).then((data) => {
        setBilling(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBilling((prev) =>
      prev ? { ...prev, [name]: name === "amount" ? parseFloat(value) : value } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (billing && billing.id) {
      try {
        await updateBilling(billing.id, billing);
        alert("Factura actualizada con éxito.");
        navigate("/facturas");
      } catch (error) {
        console.error("Error al actualizar la factura:", error);
        alert("Hubo un error al actualizar la factura.");
      }
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando factura...</p>;
  if (!billing) return <p className="text-center mt-4">Factura no encontrada</p>;

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Editar Factura</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Fecha:</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={billing.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Monto:</label>
            <input
              type="number"
              className="form-control"
              name="amount"
              value={billing.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Período:</label>
            <input
              type="text"
              className="form-control"
              name="period"
              value={billing.period}
              onChange={handleChange}
              placeholder="Ej: Ene-Jun"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Método de Pago:</label>
            <select
              className="form-select"
              name="paymentMethod"
              value={billing.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Sinpe">Sinpe</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/facturas")}>Cancelar</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditBilling;
