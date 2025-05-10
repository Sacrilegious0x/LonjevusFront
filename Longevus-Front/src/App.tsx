import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VisitSchedule from './pages/VisitSchedule';
import SuppliersList from './pages/SuppliersList';
import SuppliersAdd from './pages/SuppliersAdd';
import SuppliersEdit from './pages/SuppliertsUpdate';
import Role_Permissions from './pages/Role_permission';

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/visita" element={<VisitSchedule />} />
        <Route path="/proveedores" element={<SuppliersList />} />
        <Route path="/proveedores/guardar" element={<SuppliersAdd/>} />
        <Route path="/roles_permisos" element={<Role_Permissions />} />
        <Route path="/proveedores/editar" element={<SuppliersEdit/>} />
      </Routes>
    </Router>
  );
}

export default App;
