import { useEffect, useState } from 'react';
import { matchesService, seasonsService, teamsService } from '../services/api';
import { CalendarPlus, Loader2 } from 'lucide-react';

interface Team {
    team_id: number;
    team_name: string;
}

interface Season {
    season_id: number;
    season_year: string;
}

const Matches = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        season_id: '',
        match_date: '',
        match_time: '',
        venue: '',
        teamA_id: '',
        teamB_id: '',
        teamA_goals: '',
        teamB_goals: '',
        teamA_role: 'Home',
        teamB_role: 'Away',
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [teamsRes, seasonsRes] = await Promise.all([
                    teamsService.getAll(),
                    seasonsService.getAll(),
                ]);
                setTeams(teamsRes.data);
                setSeasons(seasonsRes.data);
            } catch (err) {
                console.error('Error loading data:', err);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.teamA_id || !formData.teamB_id || formData.teamA_id === formData.teamB_id) {
            setError('Please select two different teams.');
            return;
        }
        if (!formData.season_id || !formData.match_date) {
            setError('Season and match date are required.');
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            await matchesService.record({
                season_id: parseInt(formData.season_id, 10),
                match_date: formData.match_date,
                match_time: formData.match_time || undefined,
                venue: formData.venue || undefined,
                teamA_id: parseInt(formData.teamA_id, 10),
                teamB_id: parseInt(formData.teamB_id, 10),
                teamA_goals: parseInt(formData.teamA_goals, 10) || 0,
                teamB_goals: parseInt(formData.teamB_goals, 10) || 0,
                teamA_role: formData.teamA_role,
                teamB_role: formData.teamB_role,
            });
            setStatus('Match recorded successfully.');
            setFormData({
                season_id: '',
                match_date: '',
                match_time: '',
                venue: '',
                teamA_id: '',
                teamB_id: '',
                teamA_goals: '',
                teamB_goals: '',
                teamA_role: 'Home',
                teamB_role: 'Away',
            });
        } catch (err: any) {
            const message = err?.response?.data?.error || 'Failed to record match.';
            setError(message);
            setStatus(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Record Match</h1>
                <p className="mt-1 text-sm text-gray-500">Add completed match results to power head-to-head stats.</p>
            </div>

            <div className="bg-white shadow-lg rounded-xl border border-gray-100">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-xl">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <CalendarPlus className="h-5 w-5" />
                        New Match Result
                    </h2>
                    <p className="text-blue-200 text-sm mt-1">Select season, teams, and final score</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {status && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            {status}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                        <select
                            className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                            value={formData.season_id}
                            onChange={(e) => setFormData({ ...formData, season_id: e.target.value })}
                            required
                        >
                            <option value="">Select a season</option>
                            {seasons.map((season) => (
                                <option key={season.season_id} value={season.season_id}>
                                    {season.season_year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Match Date</label>
                            <input
                                type="date"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.match_date}
                                onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Match Time</label>
                            <input
                                type="time"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.match_time}
                                onChange={(e) => setFormData({ ...formData, match_time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                        <input
                            type="text"
                            className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                            value={formData.venue}
                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                            placeholder="e.g. Old Trafford"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Team A</label>
                            <select
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.teamA_id}
                                onChange={(e) => setFormData({ ...formData, teamA_id: e.target.value })}
                                required
                            >
                                <option value="">Select team</option>
                                {teams.map((team) => (
                                    <option key={team.team_id} value={team.team_id}>
                                        {team.team_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Team B</label>
                            <select
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.teamB_id}
                                onChange={(e) => setFormData({ ...formData, teamB_id: e.target.value })}
                                required
                            >
                                <option value="">Select team</option>
                                {teams.map((team) => (
                                    <option key={team.team_id} value={team.team_id}>
                                        {team.team_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Team A Role</label>
                            <select
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.teamA_role}
                                onChange={(e) => setFormData({ ...formData, teamA_role: e.target.value })}
                            >
                                <option value="Home">Home</option>
                                <option value="Away">Away</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Team B Role</label>
                            <select
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.teamB_role}
                                onChange={(e) => setFormData({ ...formData, teamB_role: e.target.value })}
                            >
                                <option value="Away">Away</option>
                                <option value="Home">Home</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Team A Goals</label>
                            <input
                                type="number"
                                min="0"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.teamA_goals}
                                onChange={(e) => setFormData({ ...formData, teamA_goals: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Team B Goals</label>
                            <input
                                type="number"
                                min="0"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.teamB_goals}
                                onChange={(e) => setFormData({ ...formData, teamB_goals: e.target.value })}
                                required
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
                                'Record Match'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Matches;
