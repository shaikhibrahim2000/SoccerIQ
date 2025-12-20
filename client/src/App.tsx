import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Leagues from './pages/Leagues';
import Teams from './pages/Teams';
import Players from './pages/Players';
import HeadToHead from './pages/HeadToHead';
import Matches from './pages/Matches';
import PlayerStats from './pages/PlayerStats';
import LeagueStats from './pages/LeagueStats';
import Seasons from './pages/Seasons';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="leagues" element={<Leagues />} />
        <Route path="teams" element={<Teams />} />
        <Route path="players" element={<Players />} />
        <Route path="matches" element={<Matches />} />
        <Route path="seasons" element={<Seasons />} />
        <Route path="player-stats" element={<PlayerStats />} />
        <Route path="league-stats" element={<LeagueStats />} />
        <Route path="head-to-head" element={<HeadToHead />} />
      </Route>
    </Routes>
  );
}

export default App;
