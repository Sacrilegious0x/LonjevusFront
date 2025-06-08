import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import InventoryPage from "./pages/inventory/InventoryPage";
import VisitSchedule from './pages/home/VisitSchedule';
import Index from './pages/Employee/Index';
import AddEmployee from './pages/Employee/AddEmployee';
import ShowEmployee from './pages/Employee/ShowEmployees';
import EditEmployee from './pages/Employee/EditEmployee';
import ViewEmployee from './pages/Employee/VIewEmployee';
import ShowResidents from './pages/Residents/ShowResidents';
import AddResident from './pages/Residents/AddResident';
import PurchasePage from './pages/purchase/PurchasePage';
import EditPurchase from './pages/purchase/EditPurchase';
import AddPurchase from './pages/purchase/AddPurchase';
import ProductsList from './pages/product/ProductList';
import BillingPage from './pages/billing/BillingPage';

function App() {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventario" element={<InventoryPage />} />
        <Route path="/visita" element={<VisitSchedule />} />
        <Route path='/login' element={<Index/>} />
        <Route path='/empleado/agregar' element={< AddEmployee/>}/>
        <Route path='/empleado/mostrar' element={<ShowEmployee/>}/>
        <Route path='/empleado/editar/:id' element={<EditEmployee/>}/>
        <Route path='/empleado/perfil/:id' element={< ViewEmployee/>}/>
        <Route path='/residente/mostrar' element={<ShowResidents/>}/>
        <Route path='/residente/agregar' element={<AddResident/>}/>
        <Route path="/compras" element={<PurchasePage />} />
        <Route path="/compras/editar/:id" element={<EditPurchase />} /> 
        <Route path="/compras/agregar" element={<AddPurchase />} />
        <Route path="/productos" element={<ProductsList />} />
        <Route path="/facturas" element={<BillingPage />} />
         </Routes>
    </BrowserRouter>
  );
}
export default App;