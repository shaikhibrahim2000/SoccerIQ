import { useEffect, useState } from 'react';
import { leagueStatsService, leaguesService } from '../services/api';
import { Loader2, Trophy, Users } from 'lucide-react';

interface League {
    league_id: number;
    league_name: string;
}

interface LeaderRow {
    player_id: number;
    player_name: string;
    total_goals?: number;
    total_assists?: number;
}

interface TableRow {
    team_id: number;
    team_name: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
    goal_diff: number;
    points: number;
}

const LeagueStats = () => {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [selectedLeague, setSelectedLeague] = useState('');
    const [topScorers, setTopScorers] = useState<LeaderRow[]>([]);
    const [topAssists, setTopAssists] = useState<LeaderRow[]>([]);
    const [table, setTable] = useState<TableRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadLeagues = async () => {
            const res = await leaguesService.getAll();
            setLeagues(res.data);
        };
        loadLeagues();
    }, []);

    const loadStats = async (leagueId: string) => {
        setLoading(true);
        setError(null);
        try {
            const [scorersRes, assistsRes, tableRes] = await Promise.all([
                leagueStatsService.topScorers(parseInt(leagueId, 10)),
                leagueStatsService.topAssists(parseInt(leagueId, 10)),
                leagueStatsService.table(parseInt(leagueId, 10)),
            ]);
            setTopScorers(scorersRes.data);
            setTopAssists(assistsRes.data);
            setTable(tableRes.data);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to load league stats.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">League Stats</h1>
                <p className="mt-1 text-sm text-gray-500">All-time top scorers, assists, and league table.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select League</label>
                    <select
                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                        value={selectedLeague}
                        onChange={(e) => {
                            setSelectedLeague(e.target.value);
                            if (e.target.value) loadStats(e.target.value);
                        }}
                    >
                        <option value="">Choose a league</option>
                        {leagues.map((league) => (
                            <option key={league.league_id} value={league.league_id}>
                                {league.league_name}
                            </option>
                        ))}
                    </select>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
            </div>

            {loading && (
                <div className="flex justify-center items-center h-24">
                    <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
                </div>
            )}

            {!loading && selectedLeague && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Top Scorers</h2>
                            <Trophy className="h-5 w-5 text-amber-500" />
                        </div>
                        {topScorers.length === 0 ? (
                            <div className="text-sm text-gray-500">No goals recorded yet.</div>
                        ) : (
                            <div className="space-y-3">
                                {topScorers.map((row, index) => (
                                    <div key={row.player_id} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-700">{index + 1}. {row.player_name}</span>
                                        <span className="font-semibold text-gray-900">{row.total_goals}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Top Assists</h2>
                            <Users className="h-5 w-5 text-indigo-500" />
                        </div>
                        {topAssists.length === 0 ? (
                            <div className="text-sm text-gray-500">No assists recorded yet.</div>
                        ) : (
                            <div className="space-y-3">
                                {topAssists.map((row, index) => (
                                    <div key={row.player_id} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-700">{index + 1}. {row.player_name}</span>
                                        <span className="font-semibold text-gray-900">{row.total_assists}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Points Table (All-Time)</h2>
                        {table.length === 0 ? (
                            <div className="text-sm text-gray-500">No match results recorded yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 border-b">
                                            <th className="py-2 pr-4">Team</th>
                                            <th className="py-2 pr-4">P</th>
                                            <th className="py-2 pr-4">W</th>
                                            <th className="py-2 pr-4">D</th>
                                            <th className="py-2 pr-4">L</th>
                                            <th className="py-2 pr-4">GF</th>
                                            <th className="py-2 pr-4">GA</th>
                                            <th className="py-2 pr-4">GD</th>
                                            <th className="py-2">Pts</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.map((row, index) => (
                                            <tr key={row.team_id} className="border-b last:border-none">
                                                <td className="py-2 pr-4">
                                                    <span className="font-medium text-gray-900">{index + 1}. {row.team_name}</span>
                                                </td>
                                                <td className="py-2 pr-4">{row.played}</td>
                                                <td className="py-2 pr-4">{row.wins}</td>
                                                <td className="py-2 pr-4">{row.draws}</td>
                                                <td className="py-2 pr-4">{row.losses}</td>
                                                <td className="py-2 pr-4">{row.goals_for}</td>
                                                <td className="py-2 pr-4">{row.goals_against}</td>
                                                <td className="py-2 pr-4">{row.goal_diff}</td>
                                                <td className="py-2 font-semibold text-gray-900">{row.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeagueStats;
