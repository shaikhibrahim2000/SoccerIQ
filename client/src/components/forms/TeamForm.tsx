import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield } from 'lucide-react';
import { League } from '../../types/db';

export default function TeamForm() {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [formData, setFormData] = useState({
        league_id: '',
        team_name: '',
        city: '',
        stadium: '',
        founded_year: ''
    });
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        fetchLeagues();
    }, []);

    const fetchLeagues = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/leagues');
            setLeagues(res.data);
        } catch (err) {
            console.error('Error fetching leagues', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/teams', formData);
            setStatus('Team added successfully!');
            setFormData({
                league_id: '',
                team_name: '',
                city: '',
                stadium: '',
                founded_year: ''
            });
        } catch (error) {
            console.error(error);
            setStatus('Error adding team.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="text-blue-600" /> Manage Teams
            </h2>

            {status && (
                <div className={`p-4 mb-4 rounded ${status.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">League</label>
                    <select
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.league_id}
                        onChange={(e) => setFormData({ ...formData, league_id: e.target.value })}
                    >
                        <option value="">Select League</option>
                        {leagues.map((league) => (
                            <option key={league.league_id} value={league.league_id}>
                                {league.league_name} ({league.country})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Arsenal"
                            value={formData.team_name}
                            onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. London"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stadium</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Emirates Stadium"
                            value={formData.stadium}
                            onChange={(e) => setFormData({ ...formData, stadium: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 1886"
                            value={formData.founded_year}
                            onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full"
                >
                    Add Team
                </button>
            </form>
        </div>
    );
}
