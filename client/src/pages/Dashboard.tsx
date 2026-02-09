import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaguesService, teamsService, playersService, positionsService } from '../services/api';
import { Trophy, Shirt, Users, ArrowRight, Globe, UsersRound } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface DashboardStats {
    totalLeagues: number;
    totalTeams: number;
    totalPlayers: number;
    playersByPosition: { category: string; count: number }[];
    teamsByLeague: { league_name: string; count: number }[];
}

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        setError(null);
        try {
            const [leaguesRes, teamsRes, playersRes, positionsRes] = await Promise.all([
                leaguesService.getAll(),
                teamsService.getAll(),
                playersService.getAll(),
                positionsService.getAll()
            ]);

            const leagues = leaguesRes.data;
            const teams = teamsRes.data;
            const players = playersRes.data;
            const positions = positionsRes.data;

            // Group players by position category (API returns untyped data, so we type the entries)
            const positionEntries = (positions as { position_id: number; position_category: string }[]).map((p) => [p.position_id, p.position_category] as [number, string]);
            const positionMap = new Map<number, string>(positionEntries);
            const playersByPositionMap = new Map<string, number>();
            
            players.forEach((player: any) => {
                const category = positionMap.get(player.default_position_id) || 'Unknown';
                playersByPositionMap.set(category, (playersByPositionMap.get(category) || 0) + 1);
            });

            const playersByPosition = Array.from(playersByPositionMap.entries())
                .map(([category, count]) => ({ category, count }))
                .sort((a, b) => b.count - a.count);

            // Group teams by league
            const teamsByLeagueMap = new Map<string, number>();
            teams.forEach((team: any) => {
                const leagueName = team.leagues?.league_name || 'Unknown League';
                teamsByLeagueMap.set(leagueName, (teamsByLeagueMap.get(leagueName) || 0) + 1);
            });

            const teamsByLeague = Array.from(teamsByLeagueMap.entries())
                .map(([league_name, count]) => ({ league_name, count }))
                .sort((a, b) => b.count - a.count);

            setStats({
                totalLeagues: leagues.length,
                totalTeams: teams.length,
                totalPlayers: players.length,
                playersByPosition,
                teamsByLeague
            });
        } catch (err: unknown) {
            console.error('Error fetching dashboard stats:', err);
            const message = err && typeof err === 'object' && 'code' in err && (err as { code?: string }).code === 'ERR_NETWORK'
                ? 'Cannot reach the server. Start the backend with: cd server && npm start'
                : 'Failed to load dashboard data. Check the server and Supabase configuration.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12 px-4">
                <p className="text-gray-600 mb-4">{error ?? 'Failed to load dashboard data'}</p>
                <button
                    type="button"
                    onClick={() => { setLoading(true); fetchDashboardStats(); }}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    <Loader2 className="h-4 w-4" />
                    Retry
                </button>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Leagues',
            value: stats.totalLeagues,
            icon: Trophy,
            color: 'bg-yellow-500',
            link: '/leagues',
            description: 'Active competitions'
        },
        {
            title: 'Total Teams',
            value: stats.totalTeams,
            icon: Shirt,
            color: 'bg-blue-500',
            link: '/teams',
            description: 'Football clubs'
        },
        {
            title: 'Total Players',
            value: stats.totalPlayers,
            icon: Users,
            color: 'bg-green-500',
            link: '/players',
            description: 'Registered athletes'
        }
    ];

    // High-quality football/soccer imagery (Unsplash - free to use)
    const heroBg = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80';
    const pitchTexture = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=60';

    return (
        <div className="space-y-8 relative">
            {/* Hero section with soccer background */}
            <div
                className="relative rounded-2xl overflow-hidden min-h-[200px] md:min-h-[240px] flex items-end"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.75) 50%, rgba(15, 23, 42, 0.6) 100%), url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent" />
                <div className="relative w-full p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">Dashboard</h1>
                    <p className="mt-1 text-sm md:text-base text-white/90">Overview of your football analysis platform</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.title}
                            to={card.link}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                                    <p className="mt-1 text-xs text-gray-400">{card.description}</p>
                                </div>
                                <div className={`${card.color} rounded-lg p-3 group-hover:scale-110 transition-transform`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-indigo-600 group-hover:text-indigo-700">
                                View all <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Charts Section - with subtle pitch texture */}
            <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative rounded-2xl overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.97), rgba(248,250,252,0.98)), url(${pitchTexture})`,
                    backgroundSize: '320px auto',
                    backgroundPosition: 'right bottom',
                }}
            >
                {/* Players by Position */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Players by Position</h2>
                            <p className="text-sm text-gray-500 mt-1">Distribution across categories</p>
                        </div>
                        <UsersRound className="h-8 w-8 text-indigo-500" />
                    </div>
                    <div className="space-y-4">
                        {stats.playersByPosition.length > 0 ? (
                            stats.playersByPosition.map((item) => (
                                <div key={item.category} className="flex items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{item.category}</span>
                                            <span className="text-sm font-bold text-gray-900">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${(item.count / stats.totalPlayers) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400">No players data available</div>
                        )}
                    </div>
                </div>

                {/* Teams by League */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Teams by League</h2>
                            <p className="text-sm text-gray-500 mt-1">League distribution</p>
                        </div>
                        <Globe className="h-8 w-8 text-indigo-500" />
                    </div>
                    <div className="space-y-4">
                        {stats.teamsByLeague.length > 0 ? (
                            stats.teamsByLeague.map((item) => (
                                <div key={item.league_name} className="flex items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{item.league_name}</span>
                                            <span className="text-sm font-bold text-gray-900">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${(item.count / stats.totalTeams) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400">No teams data available</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div
                className="relative rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden bg-white"
                style={{
                    backgroundImage: `linear-gradient(105deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.98) 70%, rgba(239,246,255,0.4) 100%)`,
                }}
            >
                <div
                    className="absolute right-0 top-0 w-48 h-full opacity-[0.07] bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${heroBg})` }}
                />
                <h2 className="text-lg font-semibold text-gray-900 mb-4 relative">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                    <Link
                        to="/leagues"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                    >
                        <Trophy className="h-5 w-5 text-indigo-500 mr-3" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Manage Leagues</span>
                        <ArrowRight className="h-4 w-4 text-gray-400 ml-auto group-hover:text-indigo-500" />
                    </Link>
                    <Link
                        to="/teams"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                    >
                        <Shirt className="h-5 w-5 text-indigo-500 mr-3" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Manage Teams</span>
                        <ArrowRight className="h-4 w-4 text-gray-400 ml-auto group-hover:text-indigo-500" />
                    </Link>
                    <Link
                        to="/players"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                    >
                        <Users className="h-5 w-5 text-indigo-500 mr-3" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Manage Players</span>
                        <ArrowRight className="h-4 w-4 text-gray-400 ml-auto group-hover:text-indigo-500" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


