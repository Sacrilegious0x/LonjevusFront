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
import EditResident from './pages/Residents/EditResident';
import ViewResident from './pages/Residents/ViewResident';
import SuppliersList from './pages/suppliers/SuppliersList';
import SuppliersAdd from './pages/suppliers/SuppliersAdd';
import Role_Permissions from './pages/suppliers/Role_permission';
import SuppliersEdit from './pages/suppliers/SuppliertsUpdate';


function App() {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/residente/mostrar' element={<ShowResidents/>}/>
        <Route path='/residente/agregar' element={<AddResident/>}/>
        <Route path='/residente/editar/:id' element={<EditResident/>}/>
        <Route path='/residente/perfil/:id' element={<ViewResident/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;