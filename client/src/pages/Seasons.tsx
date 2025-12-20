import { useEffect, useState } from 'react';
import { leaguesService, seasonsService } from '../services/api';
import { Calendar, Loader2, Trash2 } from 'lucide-react';

interface League {
    league_id: number;
    league_name: string;
}

interface Season {
    season_id: number;
    league_id: number;
    season_year: string;
    start_date: string;
    end_date: string;
}

const Seasons = () => {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        league_id: '',
        season_year: '',
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [leaguesRes, seasonsRes] = await Promise.all([
                leaguesService.getAll(),
                seasonsService.getAll(),
            ]);
            setLeagues(leaguesRes.data);
            setSeasons(seasonsRes.data);
        } catch (error) {
            console.error('Error fetching seasons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await seasonsService.create({
                league_id: parseInt(formData.league_id, 10),
                season_year: formData.season_year,
                start_date: formData.start_date,
                end_date: formData.end_date,
            });
            setFormData({ league_id: '', season_year: '', start_date: '', end_date: '' });
            fetchData();
        } catch (error) {
            console.error('Error creating season:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (seasonId: number) => {
        if (!window.confirm('Delete this season? This cannot be undone.')) return;
        try {
            await seasonsService.delete(seasonId);
            setSeasons((prev) => prev.filter((season) => season.season_id !== seasonId));
        } catch (error) {
            console.error('Error deleting season:', error);
        }
    };

    const leagueName = (id: number) => leagues.find((l) => l.league_id === id)?.league_name || 'Unknown League';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Seasons</h1>
                <p className="mt-1 text-sm text-gray-500">Create and manage league seasons.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                                Active Seasons
                            </h2>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {seasons.length} Total
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                {seasons.map((season) => (
                                    <div key={season.season_id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-300 hover:border-indigo-300">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900">{season.season_year}</h3>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    {leagueName(season.league_id)}
                                                </div>
                                                <div className="mt-2 text-xs text-gray-400">
                                                    {season.start_date} → {season.end_date}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(season.season_id)}
                                                    className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    aria-label={`Delete ${season.season_year}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {seasons.length === 0 && (
                                    <div className="col-span-full text-center py-12">
                                        <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No seasons</h3>
                                        <p className="mt-1 text-sm text-gray-500">Create a season to get started.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white shadow-lg rounded-xl border border-gray-100 sticky top-6">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-xl">
                            <h2 className="text-lg font-semibold text-white">Add New Season</h2>
                            <p className="text-blue-200 text-sm mt-1">Tie seasons to leagues</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">League</label>
                                <select
                                    className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors bg-white"
                                    value={formData.league_id}
                                    onChange={(e) => setFormData({ ...formData, league_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select a league</option>
                                    {leagues.map((league) => (
                                        <option key={league.league_id} value={league.league_id}>
                                            {league.league_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Season Year</label>
                                <input
                                    type="text"
                                    className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors"
                                    value={formData.season_year}
                                    onChange={(e) => setFormData({ ...formData, season_year: e.target.value })}
                                    placeholder="e.g. 2024-2025"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Add Season'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Seasons;
