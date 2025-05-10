
import Header from "../components/Header";

export default function SuppliersCrudPage() {
    return (
    <>  
    <Header/>
      <div className="container mt-4">
        <div className="text-success border border-success">
        <h2 className="text-center p-1">Proveedores</h2>
        </div>
      <button className="btn btn-success mt-2 mb-2">
          <i className="bi bi-file-earmark-plus"></i>
        </button>
        <table className="table table-striped table-bordered table-hover table-success">
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Foto</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td>1</td>
              <td>John Doe</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>
                <a href="#" className="btn btn-warning ">Editar</a>
                <a href="#" className="btn btn-danger ">Eliminar</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </>  
    );

  }
  