import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VisitSchedule from './pages/VisitSchedule';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/visita" element={<VisitSchedule />} />
      </Routes>
    </Router>
  );
}

export default App;
