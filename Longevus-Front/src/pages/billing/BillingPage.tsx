import React, { useEffect, useState } from "react";
import {
  getAllBillings,
  deleteBilling,
  getAllResidents,
  getBillingsByResident,
  getBillingsByResidentAndDate,
  getBillingsByInactiveResidents,
} from "../../services/BillingService";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

type Resident = {
  id: number;
  name: string;
  active: boolean;
};

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

const BillingPage = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const navigate = useNavigate();

  const loadBillings = async () => {
    try {
      const data = await getAllBillings();
      setBillings(data);
    } catch (error) {
      console.error("Error cargando facturas:", error);
      Swal.fire("Error", "No se pudieron cargar las facturas.", "error");
    }
  };

  const loadResidents = async () => {
    try {
      const data = await getAllResidents();
      const enriched = data.map((r) => ({
        id: r.id,
        name: r.name ?? "Sin nombre",
        active: true,
      }));
      setResidents(enriched);
    } catch (error) {
      console.error("Error cargando residentes:", error);
      Swal.fire("Error", "No se pudieron cargar los residentes.", "error");
    }
  };

  useEffect(() => {
    loadBillings();
    loadResidents();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar factura?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteBilling(id);
        await loadBillings();
        Swal.fire("Eliminada", "La factura fue eliminada exitosamente.", "success");
      } catch (error) {
        console.error("Error al eliminar factura:", error);
        Swal.fire("Error", "No se pudo eliminar la factura.", "error");
      }
    }
  };

  const handleSearchByResident = async () => {
    try {
      if (selectedResidentId === -1) {
        const data = await getBillingsByInactiveResidents();
        setBillings(data);
      } else if (selectedResidentId) {
        if (selectedDate) {
          const data = await getBillingsByResidentAndDate(selectedResidentId, selectedDate);
          setBillings(data);
        } else {
          const data = await getBillingsByResident(selectedResidentId);
          setBillings(data);
        }
      } else {
        Swal.fire("Atención", "Debe seleccionar un residente para buscar.", "info");
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      Swal.fire("Error", "Ocurrió un problema al buscar las facturas.", "error");
    }
  };

  const handleClearFilters = async () => {
    setSelectedDate("");
    setSelectedResidentId(null);
    await loadBillings();
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Facturas</h2>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <select
              className="form-control"
              value={selectedResidentId ?? ""}
              onChange={(e) => setSelectedResidentId(Number(e.target.value))}
            >
              <option value="">Seleccione un residente</option>
              <option value={-1}>Residentes inactivos</option>
              {residents
                .filter((r) => r.active)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
            </select>
          </div>

          {selectedResidentId !== null && (
            <>
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={async (e) => {
                    const newDate = e.target.value;
                    setSelectedDate(newDate);

                    try {
                      if (selectedResidentId) {
                        const data = await getBillingsByResidentAndDate(
                          selectedResidentId,
                          newDate
                        );
                        setBillings(data);
                      }
                    } catch (error) {
                      console.error("Error filtrando por fecha:", error);
                      Swal.fire("Error", "No se pudieron filtrar por fecha.", "error");
                    }
                  }}
                />
              </div>
              <div className="col-md-4">
                <button
                  className="btn btn-primary"
                  onClick={handleSearchByResident}
                >
                  Buscar Facturas del Residente
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mb-3 text-end">
          <button
            className="btn btn-secondary me-2"
            onClick={handleClearFilters}
          >
            Limpiar Filtros
          </button>
          <button
            className="btn btn-success"
            onClick={() => navigate("/facturas/nueva")}
          >
            + Nueva Factura
          </button>
          <button
            className="btn btn-outline-dark ms-2"
            onClick={() => navigate("/facturas/inactivas")}
          >
            Ver Facturas Canceladas
          </button>
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
                  <button
                    className="btn btn-danger p-2"
                    onClick={() => handleDelete(billing.id!)}
                    title="Eliminar"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {billings.length === 0 && (
              <tr>
                <td colSpan={5}>No hay facturas encontradas.</td>
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
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedBilling(null)}
                  />
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

export default BillingPage;
