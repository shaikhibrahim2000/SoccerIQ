import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Leagues from './pages/Leagues';
import Teams from './pages/Teams';
import Players from './pages/Players';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Default to Leagues for now */}
        <Route index element={<Navigate to="/leagues" replace />} />
        <Route path="leagues" element={<Leagues />} />
        <Route path="teams" element={<Teams />} />
        <Route path="players" element={<Players />} />
      </Route>
    </Routes>
  );
}

export default App;
