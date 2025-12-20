import { Routes, Route, Link, useLocation } from 'react-router-dom';
import LeagueForm from '../components/forms/LeagueForm';
import TeamForm from '../components/forms/TeamForm';
import PlayerForm from '../components/forms/PlayerForm';
import { Shield, Users, Trophy } from 'lucide-react';

export default function AdminDashboard() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname.includes(path) ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100';
    };

    return (
        <div className="flex gap-6 mt-6">
            <aside className="w-64 bg-white p-4 rounded-lg shadow h-fit">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Admin Panel</h2>
                <nav className="flex flex-col gap-2">
                    <Link to="/admin/leagues" className={`p-3 rounded-md flex items-center gap-3 transition ${isActive('/leagues')}`}>
                        <Trophy size={20} /> Leagues
                    </Link>
                    <Link to="/admin/teams" className={`p-3 rounded-md flex items-center gap-3 transition ${isActive('/teams')}`}>
                        <Shield size={20} /> Teams
                    </Link>
                    <Link to="/admin/players" className={`p-3 rounded-md flex items-center gap-3 transition ${isActive('/players')}`}>
                        <Users size={20} /> Players
                    </Link>
                </nav>
            </aside>
            <section className="flex-grow bg-white p-6 rounded-lg shadow">
                <Routes>
                    <Route path="/" element={<div className="text-gray-500">Select an option from the sidebar to manage data.</div>} />
                    <Route path="/leagues" element={<LeagueForm />} />
                    <Route path="/teams" element={<TeamForm />} />
                    <Route path="/players" element={<PlayerForm />} />
                </Routes>
            </section>
        </div>
    );
}
