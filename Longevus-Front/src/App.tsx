import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VisitSchedule from './pages/VisitSchedule';
import Index from './pages/Personal/Index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/visita" element={<VisitSchedule />} />
        <Route path='/personal' element={<Index/>} />
      </Routes>
    </Router>
  );
}

export default App;
