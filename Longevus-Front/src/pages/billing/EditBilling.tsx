import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBillingById,
  updateBilling,
  getAllResidents,
  type Billing,
  type Resident,
} from "../../services/BillingService";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { succesAlert, errorAlert, confirmEditAlert } from "../../js/alerts";

const EditBilling = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [billing, setBilling] = useState<Billing | null>(null);
  const [loading, setLoading] = useState(true);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [errors, setErrors] = useState({
    date: false,
    amount: false,
    paymentMethod: false,
    residentId: false,
    startMonth: false,
    endMonth: false,
  });

  const months = [
    "Ene","Feb","Mar","Abr","May","Jun",
    "Jul","Ago","Sep","Oct","Nov","Dic",
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await getBillingById(parseInt(id));
        setBilling(data);
        const [start, end] = data.period.split("-");
        setStartMonth(start);
        setEndMonth(end);
        setLoading(false);
      }
      const res = await getAllResidents();
      setResidents(res);
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBilling((prev) =>
      prev
        ? { ...prev, [name]: name === "amount" ? parseFloat(value) : value }
        : null
    );
  };

  const handleResidentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const selectedResident = residents.find((r) => r.id === selectedId);
    if (selectedResident && billing) {
      setBilling({ ...billing, resident: selectedResident });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = {
      date: !billing?.date,
      amount: !billing?.amount || billing.amount <= 0,
      paymentMethod: !billing?.paymentMethod,
      residentId: !billing?.resident?.id,
      startMonth: !startMonth,
      endMonth: !endMonth,
    };
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
      errorAlert(
        "Campos Imcompletos. Porfavor complete los campos antes de guardar"
      );
      return;
    }

    const result = await confirmEditAlert(
      "Esta acción actualizará la factura."
    );
    if (!result.isConfirmed) return;

    try {
      const updatedBilling: Billing = {
        ...billing!,
        period: `${startMonth}-${endMonth}`,
      };

      await updateBilling(billing!.id!, updatedBilling);

      await succesAlert(
        "Factura actualizada",
        "La factura se actualizó correctamente."
      );

      navigate("/facturas");
    } catch (error) {
      console.error("Error al actualizar la factura:", error);
      errorAlert("Hubo un problema al actualizar la factura.");
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando factura...</p>;
  if (!billing)
    return <p className="text-center mt-4">Factura no encontrada</p>;

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
              name="date"
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              value={billing.date}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Monto (₡):</label>
            <div className="input-group">
              <span className="input-group-text">₡</span>
              <input
                type="number"
                name="amount"
                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                value={billing.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Período:</label>
            <div className="d-flex gap-2">
              <select
                className={`form-control ${
                  errors.startMonth ? "is-invalid" : ""
                }`}
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              >
                <option value="">Mes inicio</option>
                {months
                  .filter((m) => m !== endMonth)
                  .map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
              </select>
              <span className="align-self-center">a</span>
              <select
                className={`form-control ${
                  errors.endMonth ? "is-invalid" : ""
                }`}
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
              >
                <option value="">Mes fin</option>
                {months
                  .filter((m) => m !== startMonth)
                  .map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Método de Pago:</label>
            <select
              name="paymentMethod"
              className={`form-select ${
                errors.paymentMethod ? "is-invalid" : ""
              }`}
              value={billing.paymentMethod}
              onChange={handleChange}
            >
              <option value="">Seleccione</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Sinpe">Sinpe</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Residente:</label>
            <select
              className={`form-select ${errors.residentId ? "is-invalid" : ""}`}
              value={billing.resident?.id ?? ""}
              onChange={handleResidentChange}
            >
              <option value="">Seleccionar Residente</option>
              {residents.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.name}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/facturas")}
            >
              <i className="bi bi-reply me-1"></i>
              Volver
            </button>

            <button type="submit" className="btn btn-primary">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditBilling;
