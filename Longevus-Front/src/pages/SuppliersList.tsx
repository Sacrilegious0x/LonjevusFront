
import Header from "../components/Header";

export default function SuppliersCrudPage() {
    return (
    <>  
    <Header/>
      <div className="container mt-4">
        <h2>Proveedores</h2>
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Foto</th>
              <th>Activo</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
      </>  
    );

  }
  