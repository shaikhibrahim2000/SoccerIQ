import { useState, useEffect } from 'react';
import { teamsService, leaguesService } from '../services/api';
import { Plus, Loader2, Shirt, Trophy, MapPin, Calendar, Building2, Trash2 } from 'lucide-react';

interface Team {
    team_id: number;
    team_name: string;
    league_id: number;
    city: string;
    stadium: string;
    founded_year: number;
    created_at: string;
}

interface League {
    league_id: number;
    league_name: string;
}

const Teams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [leagues, setLeagues] = useState<League[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        team_name: '',
        league_id: '',
        city: '',
        stadium: '',
        founded_year: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [teamsRes, leaguesRes] = await Promise.all([
                teamsService.getAll(),
                leaguesService.getAll(),
            ]);
            setTeams(teamsRes.data);
            setLeagues(leaguesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.league_id) return;

        setIsSubmitting(true);
        try {
            await teamsService.create({
                team_name: formData.team_name,
                league_id: parseInt(formData.league_id),
                city: formData.city,
                stadium: formData.stadium,
                founded_year: parseInt(formData.founded_year) || null,
            });
            setFormData({ team_name: '', league_id: '', city: '', stadium: '', founded_year: '' });
            const response = await teamsService.getAll();
            setTeams(response.data);
        } catch (error) {
            console.error('Error creating team:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (teamId: number) => {
        if (!window.confirm('Delete this team? This cannot be undone.')) return;
        try {
            await teamsService.delete(teamId);
            setTeams((prev) => prev.filter((team) => team.team_id !== teamId));
        } catch (error) {
            console.error('Error deleting team:', error);
        }
    };


    const getLeagueName = (id: number) => {
        if (!leagues || leagues.length === 0) return 'Loading...';
        return leagues.find(l => l.league_id === id)?.league_name || 'Unknown League';
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Teams</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage football clubs and national teams.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Shirt className="w-5 h-5 mr-2 text-indigo-500" />
                                Active Teams
                            </h2>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {teams.length} Total
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                {teams.map((team) => (
                                    <div key={team.team_id} className="group relative bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-300 hover:border-indigo-300">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {team.team_name}
                                                </h3>
                                                <div className="mt-2 space-y-1">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Trophy className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                        {getLeagueName(team.league_id)}
                                                    </div>
                                                    {team.city && (
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                            {team.city}
                                                        </div>
                                                    )}
                                                    {team.stadium && (
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Building2 className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                            {team.stadium}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                    {team.team_name.charAt(0)}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(team.team_id)}
                                                    className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    aria-label={`Delete ${team.team_name}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {teams.length === 0 && (
                                    <div className="col-span-full text-center py-12">
                                        <Shirt className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No teams</h3>
                                        <p className="mt-1 text-sm text-gray-500">Add a team to get started.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow-lg rounded-xl border border-gray-100 sticky top-6">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-xl">
                            <h2 className="text-lg font-semibold text-white">Add New Team</h2>
                            <p className="text-blue-200 text-sm mt-1">Register a new club</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label htmlFor="team_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Team Name
                                </label>
                                <input
                                    type="text"
                                    name="team_name"
                                    id="team_name"
                                    required
                                    value={formData.team_name}
                                    onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                                    className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors"
                                    placeholder="e.g. Manchester City"
                                />
                            </div>

                            <div>
                                <label htmlFor="league_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    League
                                </label>
                                <select
                                    id="league_id"
                                    name="league_id"
                                    required
                                    value={formData.league_id}
                                    onChange={(e) => setFormData({ ...formData, league_id: e.target.value })}
                                    className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors bg-white"
                                >
                                    <option value="">Select a league</option>
                                    {leagues.map((league) => (
                                        <option key={league.league_id} value={league.league_id}>
                                            {league.league_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors"
                                        placeholder="e.g. Manchester"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="founded_year" className="block text-sm font-medium text-gray-700 mb-1">
                                        Founded
                                    </label>
                                    <input
                                        type="number"
                                        name="founded_year"
                                        id="founded_year"
                                        value={formData.founded_year}
                                        onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors"
                                        placeholder="e.g. 1880"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="stadium" className="block text-sm font-medium text-gray-700 mb-1">
                                    Stadium
                                </label>
                                <input
                                    type="text"
                                    name="stadium"
                                    id="stadium"
                                    value={formData.stadium}
                                    onChange={(e) => setFormData({ ...formData, stadium: e.target.value })}
                                    className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors"
                                    placeholder="e.g. Etihad Stadium"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        <>
                                            <Plus className="-ml-1 mr-2 h-5 w-5" />
                                            Add Team
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Teams;
