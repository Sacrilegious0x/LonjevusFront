import React from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditInventoryPage = () => {
  const { id } = useParams();

  // Simulación: obtener el ítem por ID
  const item = {
    id: 1,
    name: "Vitamina C",
    quantity: 100,
    expirationDate: "2025-12-31",
    supplierName: "Proveedor Salud",
    purchaseId: "COMP-001",
    photoUrl: "https://picsum.photos/60/60",
    category: "Salud"
  };

  return (
    <div className="container mt-4">
      <h2>Editar Inventario - ID: {id}</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Producto</label>
          <input type="text" className="form-control" value={item.name} />
        </div>
        <div className="mb-3">
          <label className="form-label">Cantidad</label>
          <input type="number" className="form-control" value={item.quantity} />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Vencimiento</label>
          <input type="date" className="form-control" value={item.expirationDate} />
        </div>
        <div className="mb-3">
          <label className="form-label">Proveedor</label>
          <input type="text" className="form-control" value={item.supplierName} />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select className="form-select" value={item.category}>
            <option value="Alimentos">Alimentos</option>
            <option value="Salud">Salud</option>
            <option value="Limpieza">Limpieza</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditInventoryPage;
