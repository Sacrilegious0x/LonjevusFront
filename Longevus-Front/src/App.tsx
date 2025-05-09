import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VisitSchedule from './pages/VisitSchedule';
import SuppliersList from './pages/SuppliersList';
import SuppliersAdd from './pages/SuppliersAdd';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/visita" element={<VisitSchedule />} />
        <Route path="/proveedores" element={<SuppliersList />} />
      </Routes>
    </Router>
  );
}

export default App;
