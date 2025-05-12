import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import InventoryPage from "./pages/inventory/InventoryPage";
import VisitSchedule from './pages/home/VisitSchedule';
import Index from './pages/Employee/Index';
import AddEmployee from './pages/Employee/AddEmployee';
import ShowEmployee from './pages/Employee/ShowEmployee';
import SuppliersAdd from './pages/suppliers/SuppliersAdd';
import Role_Permissions from './pages/suppliers/Role_permission';
import SuppliersEdit from './pages/suppliers/SuppliertsUpdate';
import SuppliersList from './pages/suppliers/SuppliersList';

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
         <Route path="/inventario" element={<InventoryPage />} />
        <Route path="/visita" element={<VisitSchedule />} />
        <Route path='/login' element={<Index/>} />
        <Route path='/agregar' element={< AddEmployee/>}/>
        <Route path='/mostrar' element={<ShowEmployee/>}/>


        <Route path="/proveedores" element={<SuppliersList />} />
        <Route path="/proveedores/guardar" element={<SuppliersAdd/>} />
        <Route path="/roles_permisos" element={<Role_Permissions />} />
        <Route path="/proveedores/editar" element={<SuppliersEdit/>} />


      </Routes>
    </Router>
  );
}

export default App;
