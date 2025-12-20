import { useEffect, useState } from 'react';
import { headToHeadService, teamsService } from '../services/api';
import { ArrowRightLeft, Loader2 } from 'lucide-react';

interface Team {
    team_id: number;
    team_name: string;
}

interface HeadToHeadMatch {
    match_id: number;
    match_date: string | null;
    match_time: string | null;
    venue: string | null;
    teamA_goals: number;
    teamB_goals: number;
}

interface HeadToHeadSummary {
    teamA: number;
    teamB: number;
    totalMatches: number;
    teamAWins: number;
    teamBWins: number;
    draws: number;
    teamAWinPct: number;
    teamBWinPct: number;
    drawPct: number;
    recentMatches: HeadToHeadMatch[];
}

const HeadToHead = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamA, setTeamA] = useState('');
    const [teamB, setTeamB] = useState('');
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<HeadToHeadSummary | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTeams = async () => {
            try {
                const res = await teamsService.getAll();
                setTeams(res.data);
            } catch (err) {
                console.error('Error loading teams:', err);
            }
        };
        loadTeams();
    }, []);

    const handleCompare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamA || !teamB || teamA === teamB) {
            setError('Please select two different teams.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const res = await headToHeadService.getSummary(parseInt(teamA, 10), parseInt(teamB, 10));
            setSummary(res.data);
        } catch (err: any) {
            console.error('Error fetching head-to-head:', err);
            setError(err?.response?.data?.error || 'Failed to load head-to-head data.');
            setSummary(null);
        } finally {
            setLoading(false);
        }
    };

    const teamName = (id: number) => teams.find((t) => t.team_id === id)?.team_name || 'Unknown Team';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Head-to-Head</h1>
                <p className="mt-1 text-sm text-gray-500">Compare two teams across their historical meetings.</p>
            </div>

            <form onSubmit={handleCompare} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Team A</label>
                        <select
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                            value={teamA}
                            onChange={(e) => setTeamA(e.target.value)}
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
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                            value={teamB}
                            onChange={(e) => setTeamB(e.target.value)}
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

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                        <>
                            <ArrowRightLeft className="h-4 w-4 mr-2" />
                            Compare
                        </>
                    )}
                </button>
            </form>

            {loading && (
                <div className="flex justify-center items-center h-24">
                    <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
                </div>
            )}

            {summary && !loading && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <p className="text-sm text-gray-500">Total Meetings</p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.totalMatches}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <p className="text-sm text-gray-500">{teamName(summary.teamA)} Win %</p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.teamAWinPct}%</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <p className="text-sm text-gray-500">{teamName(summary.teamB)} Win %</p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.teamBWinPct}%</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Win/Draw/Loss Breakdown</h2>
                            <span className="text-sm text-gray-500">{summary.drawPct}% draws</span>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="text-green-700 font-semibold">{teamName(summary.teamA)} Wins</div>
                                <div className="text-2xl font-bold text-green-800">{summary.teamAWins}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="text-gray-700 font-semibold">Draws</div>
                                <div className="text-2xl font-bold text-gray-900">{summary.draws}</div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="text-blue-700 font-semibold">{teamName(summary.teamB)} Wins</div>
                                <div className="text-2xl font-bold text-blue-800">{summary.teamBWins}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Meetings</h2>
                        {summary.recentMatches.length === 0 ? (
                            <div className="text-sm text-gray-500">No head-to-head matches found.</div>
                        ) : (
                            <div className="space-y-3">
                                {summary.recentMatches.map((match) => (
                                    <div key={match.match_id} className="flex items-center justify-between border border-gray-100 rounded-lg p-4">
                                        <div className="text-sm text-gray-600">
                                            {match.match_date || 'Unknown date'} {match.match_time ? `• ${match.match_time}` : ''}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {teamName(summary.teamA)} {match.teamA_goals} - {match.teamB_goals} {teamName(summary.teamB)}
                                        </div>
                                        <div className="text-xs text-gray-500">{match.venue || 'Venue TBD'}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeadToHead;
