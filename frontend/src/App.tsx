import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AxonivePage } from './pages/AxonivePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/axonive" element={<AxonivePage />} />
      </Routes>
    </Router>
  );
}

export default App;

