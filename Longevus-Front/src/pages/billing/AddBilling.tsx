import React, { useState, useEffect } from "react";
import { createBilling, getAllResidents } from "../../services/BillingService";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import type { Resident } from "../../services/BillingService";

const AddBilling = () => {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [errors, setErrors] = useState({
    date: false,
    amount: false,
    paymentMethod: false,
    selectedResidentId: false,
    startMonth: false,
    endMonth: false
  });

  const navigate = useNavigate();

  const months = [
    "Ene","Feb","Mar","Abr","May","Jun",
    "Jul","Ago","Sep","Oct","Nov","Dic",
  ];

  useEffect(() => {
    const loadResidents = async () => {
      try {
        const data = await getAllResidents();
        setResidents(data);
      } catch (error) {
        console.error("Error cargando residentes:", error);
      }
    };

    loadResidents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const period = startMonth && endMonth ? `${startMonth}-${endMonth}` : "";

    const newErrors = {
      date: !date,
      amount: amount <= 0,
      paymentMethod: !paymentMethod,
      selectedResidentId: !selectedResidentId,
      startMonth: !startMonth,
      endMonth: !endMonth
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      alert("Por favor complete todos los campos.");
      return;
    }

    const billing = {
      date,
      amount,
      period,
      paymentMethod,
      administrator: { id: 1 },
      resident: { id: selectedResidentId! }
    };

    try {
      await createBilling(billing);
      navigate("/facturas");
    } catch (error) {
      console.error("Error guardando factura:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Agregar Nueva Factura</h2>
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label>Fecha:</label>
            <input
              type="date"
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Monto (₡):</label>
            <div className="input-group">
              <span className="input-group-text">₡</span>
              <input
                type="number"
                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                min="0"
                step="0.01"
                value={amount === 0 ? "" : amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Ingrese el monto"
              />
            </div>
          </div>

          <div className="mb-3">
            <label>Período:</label>
            <div className="d-flex gap-2">
              <select
                className={`form-control ${errors.startMonth ? "is-invalid" : ""}`}
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              >
                <option value="">Mes inicio</option>
                {months
                  .filter((month) => month !== endMonth)
                  .map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
              </select>

              <span className="align-self-center">a</span>

              <select
                className={`form-control ${errors.endMonth ? "is-invalid" : ""}`}
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
              >
                <option value="">Mes fin</option>
                {months
                  .filter((month) => month !== startMonth)
                  .map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label>Método de Pago:</label>
            <select
              className={`form-control ${errors.paymentMethod ? "is-invalid" : ""}`}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Seleccione...</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Sinpe">Sinpe</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>

          <div className="mb-3">
            <label>Residente:</label>
            <select
              className={`form-control ${errors.selectedResidentId ? "is-invalid" : ""}`}
              value={selectedResidentId ?? ""}
              onChange={(e) => setSelectedResidentId(Number(e.target.value))}
            >
              <option value="">Seleccionar Residente</option>
              {residents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-success me-2">Guardar Factura</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/facturas")}>
            Cancelar
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddBilling;
