import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GlobalMix from './pages/GlobalMix';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/global-mix" element={<GlobalMix />} />
      </Routes>
    </Router>
  );
}

export default App;

