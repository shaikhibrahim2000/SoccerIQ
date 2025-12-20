import { useState } from 'react';
import axios from 'axios';
import { Trophy } from 'lucide-react';

export default function LeagueForm() {
    const [formData, setFormData] = useState({
        league_name: '',
        country: ''
    });
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/leagues', formData);
            setStatus('League added successfully!');
            setFormData({ league_name: '', country: '' });
        } catch (error) {
            console.error(error);
            setStatus('Error adding league.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-500" /> Manage Leagues
            </h2>

            {status && (
                <div className={`p-4 mb-4 rounded ${status.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">League Name</label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. English Premier League"
                        value={formData.league_name}
                        onChange={(e) => setFormData({ ...formData, league_name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. England"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    Add League
                </button>
            </form>
        </div>
    );
}
