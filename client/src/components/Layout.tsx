import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trophy, Shirt, Users, Menu, Bell, User } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Leagues', href: '/leagues', icon: Trophy },
        { name: 'Teams', href: '/teams', icon: Shirt },
        { name: 'Players', href: '/players', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-primary text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-center h-16 bg-primary-hover border-b border-gray-700 shadow-md">
                    <h1 className="text-2xl font-bold tracking-wider uppercase text-blue-400">Pitch<span className="text-white">Admin</span></h1>
                </div>
                <nav className="mt-8 px-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-secondary text-white shadow-lg shadow-blue-500/30'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                        }`}
                                />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex justify-between items-center h-16 bg-white shadow-sm px-6 border-b border-gray-200">
                    <button
                        className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex items-center space-x-4 ml-auto">
                        <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                        <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                                <User className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin User</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Layout;
