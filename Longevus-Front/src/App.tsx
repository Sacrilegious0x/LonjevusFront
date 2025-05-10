import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VisitSchedule from './pages/VisitSchedule';
import ShowResidents from './pages/ShowResidents';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/residentes" element={< ShowResidents />} />
      </Routes>
    </Router>
  );
}

export default App;
