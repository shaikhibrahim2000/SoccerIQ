import { useEffect, useState } from 'react';
import { matchesService, playerStatsService, playersService } from '../services/api';
import { BarChart3, Loader2 } from 'lucide-react';

interface Player {
    player_id: number;
    player_name: string;
}

interface Match {
    match_id: number;
    match_date: string | null;
    match_time: string | null;
    venue: string | null;
}

interface PlayerStatRow {
    stat_id: number;
    goals: number | null;
    assists: number | null;
    shots_on_target: number | null;
    key_passes: number | null;
    yellow_cards: number | null;
    red_cards: number | null;
    rating: number | null;
    matches?: { match_date: string | null };
    players?: { player_name: string };
}

const PlayerStats = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [stats, setStats] = useState<PlayerStatRow[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        match_id: '',
        player_id: '',
        goals: '',
        assists: '',
        shots_on_target: '',
        shots_off_target: '',
        key_passes: '',
        tackles_won: '',
        tackles_attempted: '',
        interceptions: '',
        clearances: '',
        fouls_committed: '',
        fouls_won: '',
        yellow_cards: '',
        red_cards: '',
        pass_completion_rate: '',
        dribbles_successful: '',
        dribbles_attempted: '',
        rating: '',
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [playersRes, matchesRes, statsRes] = await Promise.all([
                    playersService.getAll(),
                    matchesService.getAll(),
                    playerStatsService.getAll(),
                ]);
                setPlayers(playersRes.data);
                setMatches(matchesRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error('Error loading player stats data:', err);
            }
        };
        loadData();
    }, []);

    const refreshStats = async () => {
        const statsRes = await playerStatsService.getAll();
        setStats(statsRes.data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.match_id || !formData.player_id) {
            setError('Match and player are required.');
            return;
        }
        setError(null);
        setIsSubmitting(true);
        try {
            await playerStatsService.create({
                ...formData,
                match_id: parseInt(formData.match_id, 10),
                player_id: parseInt(formData.player_id, 10),
            });
            setFormData({
                match_id: '',
                player_id: '',
                goals: '',
                assists: '',
                shots_on_target: '',
                shots_off_target: '',
                key_passes: '',
                tackles_won: '',
                tackles_attempted: '',
                interceptions: '',
                clearances: '',
                fouls_committed: '',
                fouls_won: '',
                yellow_cards: '',
                red_cards: '',
                pass_completion_rate: '',
                dribbles_successful: '',
                dribbles_attempted: '',
                rating: '',
            });
            await refreshStats();
        } catch (err: any) {
            const message = err?.response?.data?.error || 'Failed to save player stats.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Player Stats</h1>
                <p className="mt-1 text-sm text-gray-500">Record match-by-match player performance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Player Stats</h2>
                        <BarChart3 className="h-5 w-5 text-indigo-500" />
                    </div>
                    {stats.length === 0 ? (
                        <div className="text-sm text-gray-500">No stats recorded yet.</div>
                    ) : (
                        <div className="space-y-3">
                            {stats.slice(0, 15).map((row) => (
                                <div key={row.stat_id} className="border border-gray-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <div>
                                        <div className="font-semibold text-gray-900">{row.players?.player_name || 'Unknown Player'}</div>
                                        <div className="text-xs text-gray-500">Match date: {row.matches?.match_date || 'Unknown'}</div>
                                    </div>
                                    <div className="text-sm text-gray-700 flex flex-wrap gap-3">
                                        <span>Goals: <strong>{row.goals ?? 0}</strong></span>
                                        <span>Assists: <strong>{row.assists ?? 0}</strong></span>
                                        <span>Shots OT: <strong>{row.shots_on_target ?? 0}</strong></span>
                                        <span>Key Passes: <strong>{row.key_passes ?? 0}</strong></span>
                                    </div>
                                    <div className="text-sm text-gray-700 flex flex-wrap gap-3">
                                        <span>YC: <strong>{row.yellow_cards ?? 0}</strong></span>
                                        <span>RC: <strong>{row.red_cards ?? 0}</strong></span>
                                        <span>Rating: <strong>{row.rating ?? '-'}</strong></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white shadow-lg rounded-xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-xl">
                        <h2 className="text-lg font-semibold text-white">Add Player Stats</h2>
                        <p className="text-blue-200 text-sm mt-1">Match-level performance entry</p>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Match</label>
                            <select
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.match_id}
                                onChange={(e) => setFormData({ ...formData, match_id: e.target.value })}
                                required
                            >
                                <option value="">Select match</option>
                                {matches.map((match) => (
                                    <option key={match.match_id} value={match.match_id}>
                                        {match.match_date || 'Unknown date'} {match.venue ? `• ${match.venue}` : ''} (#{match.match_id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Player</label>
                            <select
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.player_id}
                                onChange={(e) => setFormData({ ...formData, player_id: e.target.value })}
                                required
                            >
                                <option value="">Select player</option>
                                {players.map((player) => (
                                    <option key={player.player_id} value={player.player_id}>
                                        {player.player_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                min="0"
                                placeholder="Goals"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.goals}
                                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Assists"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.assists}
                                onChange={(e) => setFormData({ ...formData, assists: e.target.value })}
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Shots on target"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.shots_on_target}
                                onChange={(e) => setFormData({ ...formData, shots_on_target: e.target.value })}
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Shots off target"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.shots_off_target}
                                onChange={(e) => setFormData({ ...formData, shots_off_target: e.target.value })}
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Key passes"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.key_passes}
                                onChange={(e) => setFormData({ ...formData, key_passes: e.target.value })}
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Tackles won"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.tackles_won}
                                onChange={(e) => setFormData({ ...formData, tackles_won: e.target.value })}
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Interceptions"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.interceptions}
                                onChange={(e) => setFormData({ ...formData, interceptions: e.target.value })}
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Yellow cards"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.yellow_cards}
                                onChange={(e) => setFormData({ ...formData, yellow_cards: e.target.value })}
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Red cards"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.red_cards}
                                onChange={(e) => setFormData({ ...formData, red_cards: e.target.value })}
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Rating"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Pass completion %"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.pass_completion_rate}
                                onChange={(e) => setFormData({ ...formData, pass_completion_rate: e.target.value })}
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Dribbles successful"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.dribbles_successful}
                                onChange={(e) => setFormData({ ...formData, dribbles_successful: e.target.value })}
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Dribbles attempted"
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                value={formData.dribbles_attempted}
                                onChange={(e) => setFormData({ ...formData, dribbles_attempted: e.target.value })}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save Stats'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PlayerStats;
