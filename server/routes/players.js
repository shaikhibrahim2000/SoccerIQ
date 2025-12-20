
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// GET all players
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('players')
        .select('*, positions(position_name)');

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST new player
router.post('/', async (req, res) => {
    const {
        player_name,
        default_position_id,
        position_id, // Support both for backward compatibility
        team_id,
        date_of_birth,
        nationality,
        height_cm,
        foot,
        season_id
    } = req.body;

    // Use default_position_id if provided, otherwise fall back to position_id
    const positionId = default_position_id || position_id;

    if (!player_name || !positionId || !team_id) {
        return res.status(400).json({ error: 'player_name, default_position_id (or position_id), and team_id are required' });
    }

    const { data, error } = await supabase
        .from('players')
        .insert([{
            player_name,
            default_position_id: positionId,
            team_id,
            date_of_birth,
            nationality,
            height_cm,
            foot
        }])
        .select();

    if (error) return res.status(500).json({ error: error.message });

    if (season_id) {
        const today = new Date().toISOString().slice(0, 10);
        const player = Array.isArray(data) ? data[0] : data;
        const { error: rosterError } = await supabase
            .from('team_rosters')
            .insert([{
                team_id,
                player_id: player.player_id,
                season_id,
                join_date: today,
                contract_status: 'Active',
            }]);

        if (rosterError) return res.status(500).json({ error: rosterError.message });
    }

    res.status(201).json(data);
});

// DELETE player
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('players')
        .delete()
        .eq('player_id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Player deleted' });
});

module.exports = router;
