import { Routes, Route, BrowserRouter } from 'react-router-dom';
import SuppliersList from './pages/supplier/SuppliersList';
import SuppliersAdd from './pages/supplier/SuppliersAdd';
import SuppliersEdit from './pages/supplier/SuppliertsUpdate';
import RolesList from './pages/role_permissions/Role_permission';
function App() {
  return (
    <BrowserRouter>  
      <Routes>

      <Route path="/proveedores" element={<SuppliersList />} />
        <Route path="/proveedores/guardar" element={<SuppliersAdd/>} />
        <Route path="/roles_permisos" element={<RolesList />} />
      <Route path="/proveedores/editar/:id" element={<SuppliersEdit />} />
      

      </Routes>
    </BrowserRouter>
  );
}
export default App;