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
import SuppliersList from './pages/supplier/SuppliersList';
import SuppliersAdd from './pages/supplier/SuppliersAdd';
import Role_Permissions from './pages/role_permissions/Role_permission';
import AddResident from './pages/Residents/AddResident';
import PurchasePage from './pages/purchase/PurchasePage';
import EditPurchase from './pages/purchase/EditPurchase';
import AddPurchase from './pages/purchase/AddPurchase';
import EditProduct from './pages/product/EditProduct';
import ProductPage from './pages/product/ProductList';
import AddProduct from './pages/product/AddProduct';
import AddAdmin from './pages/Employee/AddAdmin';
import EditAdmin from './pages/Employee/EditAdmin';
import EditResident from './pages/Residents/EditResident';
import ViewResident from './pages/Residents/ViewResident';
import SuppliersEdit from './pages/supplier/SuppliertsUpdate';
import RoomList from './pages/Room/ListRooms';
import AddRoom from './pages/Room/AddRoom';
import EditRoom from './pages/Room/EditRoom';
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
        <Route path="/compras/agregar" element={<AddPurchase/>} /> 
        <Route path="/productos" element={<ProductPage/>} />
        <Route path="/productos/editar/:id" element={<EditProduct />} />
        <Route path="/productos/agregar" element={<AddProduct />} />
        <Route path="/proveedores" element={<SuppliersList />} />
        <Route path="/proveedores/agregar" element={<SuppliersAdd/>} />
        <Route path='/proveedores/editar/:id' element={<SuppliersEdit/>} />
        <Route path="/roles_permisos" element={<Role_Permissions />} />
        <Route path='/admin/agregar' element={<AddAdmin/>}/>
        <Route path='/admin/editar/:id' element = {<EditAdmin/>}/>
        <Route path='/residente/editar/:id' element={<EditResident/>}/>
        <Route path='/residente/perfil/:id' element={<ViewResident/>}/>
        <Route path='/habitaciones' element={<RoomList/>}/>
        <Route path='/habitaciones/agregar' element={<AddRoom/>}/>
        <Route path='/habitaciones/editar/:id' element={<EditRoom/>}/>
         </Routes>
    </BrowserRouter>
  );
}
export default App;