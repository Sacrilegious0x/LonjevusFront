import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryPage from "./pages/inventory/InventoryPage";
import HomePage from './pages/home/HomePage';
import VisitSchedule from './pages/home/VisitSchedule';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
         <Route path="/inventario" element={<InventoryPage />} />
        <Route path="/visita" element={<VisitSchedule />} />
      </Routes>
    </Router>
  );
}

export default App;
