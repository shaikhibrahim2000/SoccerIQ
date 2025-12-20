const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// GET all seasons
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .order('start_date', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST create season
router.post('/', async (req, res) => {
    const { league_id, season_year, start_date, end_date } = req.body;

    if (!league_id || !season_year || !start_date || !end_date) {
        return res.status(400).json({ error: 'league_id, season_year, start_date, and end_date are required' });
    }

    const { data, error } = await supabase
        .from('seasons')
        .insert([{
            league_id,
            season_year,
            start_date,
            end_date,
        }])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// DELETE season
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('seasons')
        .delete()
        .eq('season_id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Season deleted' });
});

module.exports = router;
