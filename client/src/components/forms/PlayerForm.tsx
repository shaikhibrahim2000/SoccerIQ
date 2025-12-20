import { useState } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';

export default function PlayerForm() {
    const [formData, setFormData] = useState({
        player_name: '',
        nationality: '',
        position_id: 1, // Default to a placeholder ID for now
        height_cm: '',
        foot: 'Right',
        date_of_birth: ''
    });
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/players', {
                ...formData,
                default_position_id: formData.position_id // Map to DB column
            });
            setStatus('Player added successfully!');
            setFormData({
                player_name: '',
                nationality: '',
                position_id: 1,
                height_cm: '',
                foot: 'Right',
                date_of_birth: ''
            });
        } catch (error) {
            console.error(error);
            setStatus('Error adding player.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="text-purple-600" /> Manage Players
            </h2>

            {status && (
                <div className={`p-4 mb-4 rounded ${status.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Player Name</label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Bukayo Saka"
                        value={formData.player_name}
                        onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. England"
                            value={formData.nationality}
                            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.date_of_birth}
                            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 178"
                            value={formData.height_cm}
                            onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Foot</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.foot}
                            onChange={(e) => setFormData({ ...formData, foot: e.target.value })}
                        >
                            <option value="Right">Right</option>
                            <option value="Left">Left</option>
                            <option value="Both">Both</option>
                        </select>
                    </div>
                </div>

                <div className="bg-yellow-50 p-2 text-sm text-yellow-800 rounded border border-yellow-200">
                    Note: Positions must be added to the DB separately. Defaulting ID to 1.
                </div>

                <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition w-full"
                >
                    Add Player
                </button>
            </form>
        </div>
    );
}
