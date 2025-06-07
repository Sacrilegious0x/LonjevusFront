import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import InventoryPage from "./pages/inventory/InventoryPage";
import VisitSchedule from './pages/home/VisitSchedule';
import Index from './pages/Employee/Index';
import AddEmployee from './pages/Employee/AddEmployee';
import ShowEmployee from './pages/Employee/ShowEmployees';
import EditEmployee from './pages/Employee/EditEmployee';
import ViewEmployee from './pages/Employee/VIewEmployee';
import PurchasePage from './pages/purchase/PurchasePage';
import EditPurchase from './pages/purchase/EditPurchase';
import AddPurchase from './pages/purchase/AddPurchase';
import EditProduct from './pages/product/EditProduct';
import AddProduct from './pages/product/AddProduct';
import AddResident from './pages/Residents/AddResident';
import ShowResidents from './pages/Residents/ShowResidents';
import EditResident from './pages/Residents/EditResident';
import ViewResident from './pages/Residents/ViewResident';
import ShowActivity from './pages/Activity/ShowActivities';

function App() {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventario" element={<InventoryPage />} />
        <Route path="/visita" element={<VisitSchedule />} />
        <Route path='/login' element={<Index/>} />
        <Route path='/agregar' element={< AddEmployee/>}/>
        <Route path='/mostrar' element={<ShowEmployee/>}/>
        <Route path='/editar/:id' element={<EditEmployee/>}/>
        <Route path='/perfil/:id' element={< ViewEmployee/>}/>
        <Route path='/residente/mostrar' element={<ShowResidents/>}/>
        <Route path='/residente/agregar' element={<AddResident/>}/>
        <Route path='/residente/editar/:id' element={<EditResident/>}/>
        <Route path='/residente/perfil/:id' element={<ViewResident/>}/>
        <Route path="/compras" element={<PurchasePage />} />
        <Route path="/compras/editar/:id" element={<EditPurchase />} />    
        <Route path="/compras/agregar" element={<AddPurchase/>} /> 
        <Route path="/productos/editar/:id" element={<EditProduct />} />
        <Route path="/productos/agregar" element={<AddProduct />} />
        <Route path="/actividades/mostrar" element={<ShowActivity />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;