import { useState, useEffect } from 'react';
import { leaguesService } from '../services/api';
import { Plus, Loader2, Globe, Trophy, Trash2 } from 'lucide-react';

interface League {
    league_id: number;
    league_name: string;
    country: string;
    created_at: string;
}

const Leagues = () => {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ league_name: '', country: '' });


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await leaguesService.getAll();
            setLeagues(response.data);
        } catch (error) {
            console.error('Error fetching leagues:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await leaguesService.create(formData);
            setFormData({ league_name: '', country: '' });
            fetchData();
        } catch (error) {
            console.error('Error creating league:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (leagueId: number) => {
        if (!window.confirm('Delete this league? This cannot be undone.')) return;
        try {
            await leaguesService.delete(leagueId);
            setLeagues((prev) => prev.filter((league) => league.league_id !== leagueId));
        } catch (error) {
            console.error('Error deleting league:', error);
        }
    };



    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Leagues</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage competitions and tournaments.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Trophy className="w-5 h-5 mr-2 text-indigo-500" />
                                Active Leagues
                            </h2>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {leagues.length} Total
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                {leagues.map((league) => (
                                    <div key={league.league_id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-300 hover:border-indigo-300">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {league.league_name}
                                                </h3>
                                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                                    <Globe className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                    {league.country}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                    {league.league_name.charAt(0)}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(league.league_id)}
                                                    className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    aria-label={`Delete ${league.league_name}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {leagues.length === 0 && (
                                    <div className="col-span-full text-center py-12">
                                        <Trophy className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No leagues</h3>
                                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new league.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Section - Takes up 1 column */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow-lg rounded-xl border border-gray-100 sticky top-6">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-xl">
                            <h2 className="text-lg font-semibold text-white">Add New League</h2>
                            <p className="text-blue-200 text-sm mt-1">Create a new competition entry</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label htmlFor="league_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    League Name
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="league_name"
                                        id="league_name"
                                        required
                                        value={formData.league_name}
                                        onChange={(e) => setFormData({ ...formData, league_name: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors"
                                        placeholder="e.g. Premier League"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                    Country
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="country"
                                        id="country"
                                        required
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors"
                                        placeholder="e.g. England"
                                    />
                                </div>
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
                                            Add League
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

export default Leagues;
