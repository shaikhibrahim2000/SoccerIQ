import { useState, useEffect } from 'react';
import { playersService, teamsService, positionsService } from '../services/api';
import { Plus, Loader2, Users } from 'lucide-react';

interface Player {
    player_id: number;
    player_name: string;
    positions?: { position_name: string };
    default_position_id: number;
    team_id: number;
    created_at: string;
}

interface Team {
    team_id: number;
    team_name: string;
}

interface Position {
    position_id: number;
    position_name: string;
    position_category: string;
}

const Players = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        player_name: '',
        position_id: '',
        team_id: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [playersRes, teamsRes, positionsRes] = await Promise.all([
                playersService.getAll(),
                teamsService.getAll(),
                positionsService.getAll()
            ]);
            setPlayers(playersRes.data);
            setTeams(teamsRes.data);
            setPositions(positionsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.position_id || !formData.team_id) {
            setError('Please select both position and team');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await playersService.create({
                player_name: formData.player_name,
                default_position_id: parseInt(formData.position_id),
                team_id: parseInt(formData.team_id)
            });
            setFormData({ player_name: '', position_id: '', team_id: '' });
            fetchData();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || 'Failed to add player. Please try again.';
            setError(errorMessage);
            console.error('Error adding player:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTeamName = (id: number) => {
        if (!teams || teams.length === 0) return 'Loading...';
        return teams.find(t => t.team_id === id)?.team_name || 'Unknown Team';
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Players</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage football players and athletes.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Section */}
                <div className="lg:col-span-2 space-y-6">
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-indigo-500" />
                            Active Players
                        </h2>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {players.length} Total
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                            {players.map((player) => (
                                <div key={player.player_id} className="group relative bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-300 hover:border-indigo-300">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {player.player_name}
                                            </h3>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <span className="inline-block w-20 text-xs font-semibold uppercase tracking-wide text-gray-400">Position</span>
                                                    <span className="text-gray-700">
                                                        {player.positions?.position_name || 'Unknown'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <span className="inline-block w-20 text-xs font-semibold uppercase tracking-wide text-gray-400">Team</span>
                                                    <span className="text-gray-700">{getTeamName(player.team_id)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                {player.player_name.charAt(0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {players.length === 0 && (
                                <div className="col-span-full text-center py-12">
                                    <Users className="mx-auto h-12 w-12 text-gray-300" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No players</h3>
                                    <p className="mt-1 text-sm text-gray-500">Add players to build your team.</p>
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
                        <h2 className="text-lg font-semibold text-white">Add New Player</h2>
                        <p className="text-blue-200 text-sm mt-1">Register a new athlete</p>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label htmlFor="player_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Player Name
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="player_name"
                                    id="player_name"
                                    required
                                    value={formData.player_name}
                                    onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                                    className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors"
                                    placeholder="e.g. Bukayo Saka"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                                Position
                            </label>
                            <select
                                id="position"
                                name="position"
                                required
                                value={formData.position_id}
                                onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors bg-white"
                            >
                                <option value="">Select a position</option>
                                {positions.map((pos) => (
                                    <option key={pos.position_id} value={pos.position_id}>
                                        {pos.position_name} ({pos.position_category})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="team_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Team
                            </label>
                            <select
                                id="team_id"
                                name="team_id"
                                required
                                value={formData.team_id}
                                onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                                className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors bg-white"
                            >
                                <option value="">Select a team</option>
                                {teams.map((team) => (
                                    <option key={team.team_id} value={team.team_id}>
                                        {team.team_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

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
                                        Add Player
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

export default Players;
