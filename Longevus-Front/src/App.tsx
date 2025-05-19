import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import InventoryPage from './pages/inventory/InventoryPage';
import PurchasePage from './pages/purchase/PurchasePage';
import AddPurchase from './pages/purchase/AddPurchase';
import EditPurchase from './pages/purchase/EditPurchase';


function App() {
  return (
    <BrowserRouter>  
      <Routes>
         <Route path="/" element={<HomePage />} />
         <Route path="/inventario" element={<InventoryPage />} />
         <Route path="/compras" element={<PurchasePage />} />
         <Route path="/compras/agregar" element={<AddPurchase />} />
        <Route path="/compras/editar/:id" element={<EditPurchase />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;