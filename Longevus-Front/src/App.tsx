import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import InventoryPage from "./pages/inventory/InventoryPage";
import VisitSchedule from './pages/home/VisitSchedule';
import Index from './pages/Employee/Index';
import AddEmployee from './pages/Employee/AddEmployee';
import ShowEmployee from './pages/Employee/ShowEmployees';
import EditEmployee from './pages/Employee/EditEmployee';
import ViewEmployee from './pages/Employee/VIewEmployee';
import EditInventoryPage from './pages/inventory/EditInventoryPage';
import PurchasePage from './pages/purchase/PurchasePage';
import EditPurchase from './pages/purchase/EditPurchase';
import AddPurchase from './pages/purchase/AddPurchase';
import ProductPage from './pages/product/ProductPage';
import EditProduct from './pages/product/EditProduct';
import AddProduct from './pages/product/AddProduct';
import AddResident from './pages/Residents/AddResident';
import ShowResidents from './pages/Residents/ShowResidents';
import SuppliersList from './pages/suppliers/SuppliersList';
import SuppliersAdd from './pages/suppliers/SuppliersAdd';
import Role_Permissions from './pages/suppliers/Role_permission';
import SuppliersEdit from './pages/suppliers/SuppliertsUpdate';


function App() {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventario" element={<InventoryPage />} />
        <Route path="/inventario/editar/:id" element={<EditInventoryPage />} />
        <Route path="/visita" element={<VisitSchedule />} />
        <Route path='/login' element={<Index/>} />
        <Route path='/agregar' element={< AddEmployee/>}/>
        <Route path='/mostrar' element={<ShowEmployee/>}/>
        <Route path='/editar/:id' element={<EditEmployee/>}/>
        <Route path='/perfil/:id' element={< ViewEmployee/>}/>
        <Route path='/mostrarResidentes' element={<ShowResidents/>}/>
        <Route path='/AgregarResidente' element={<AddResident/>}/>
        <Route path="/compras" element={<PurchasePage />} />
        <Route path="/compras/editar/:id" element={<EditPurchase />} />    
        <Route path="/compras/agregar" element={<AddPurchase/>} /> 
        <Route path="/productos" element={<ProductPage/>} />
        <Route path="/productos/editar/:id" element={<EditProduct />} />
        <Route path="/productos/agregar" element={<AddProduct />} />
        <Route path="/proveedores" element={<SuppliersList />} />
        <Route path="/proveedores/guardar" element={<SuppliersAdd/>} />
        <Route path="/roles_permisos" element={<Role_Permissions />} />
        <Route path="/proveedores/editar" element={<SuppliersEdit/>} />

      </Routes>
    </BrowserRouter>
  );
}
export default App;