import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import InventoryPage from "./pages/inventory/InventoryPage";
import VisitSchedule from './pages/home/VisitSchedule';
import Index from './pages/Employee/Index';
import AddEmployee from './pages/Employee/AddEmployee';
import ShowResidents from './pages/Residents/ShowResidents';
import ShowEmployee from './pages/Employee/ShowEmployees';
import EditEmployee from './pages/Employee/EditEmployee';
import ViewEmployee from './pages/Employee/VIewEmployee';

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
        <Route path='/mostrarResidentes' element={<ShowResidents/>}/>
        <Route path='/editar/:id' element={<EditEmployee/>}/>
        <Route path='/perfil/:id' element={< ViewEmployee/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;