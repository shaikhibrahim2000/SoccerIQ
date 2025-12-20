
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// GET all teams
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('teams')
        .select('*, leagues(league_name)');

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST new team
router.post('/', async (req, res) => {
    const { league_id, team_name, city, stadium, founded_year } = req.body;

    if (!league_id || !team_name) {
        return res.status(400).json({ error: 'league_id and team_name are required' });
    }

    const { data, error } = await supabase
        .from('teams')
        .insert([{ league_id, team_name, city, stadium, founded_year }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// DELETE team
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('teams')
        .delete()
        .eq('team_id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Team deleted' });
});

module.exports = router;
