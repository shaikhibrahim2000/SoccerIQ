import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaguesService, teamsService, playersService, positionsService } from '../services/api';
import { Trophy, Shirt, Users, TrendingUp, ArrowRight, Globe, UsersRound } from 'lucide-react';
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

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
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

            // Group players by position category
            const positionMap = new Map(positions.map((p: any) => [p.position_id, p.position_category]));
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
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
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
        return <div className="text-center text-gray-500">Failed to load dashboard data</div>;
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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Overview of your football analysis platform</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Players by Position */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Players by Position</h2>
                            <p className="text-sm text-gray-500 mt-1">Distribution across categories</p>
                        </div>
                        <UsersRound className="h-8 w-8 text-indigo-500" />
                    </div>
                    <div className="space-y-4">
                        {stats.playersByPosition.length > 0 ? (
                            stats.playersByPosition.map((item, index) => (
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Teams by League</h2>
                            <p className="text-sm text-gray-500 mt-1">League distribution</p>
                        </div>
                        <Globe className="h-8 w-8 text-indigo-500" />
                    </div>
                    <div className="space-y-4">
                        {stats.teamsByLeague.length > 0 ? (
                            stats.teamsByLeague.map((item, index) => (
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

