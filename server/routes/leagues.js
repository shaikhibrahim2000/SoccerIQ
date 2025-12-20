
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// GET all leagues
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('leagues')
        .select('*');

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST new league
router.post('/', async (req, res) => {
    const { league_name, country } = req.body;

    if (!league_name || !country) {
        return res.status(400).json({ error: 'Please provide league_name and country' });
    }

    const { data, error } = await supabase
        .from('leagues')
        .insert([{ league_name, country }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// DELETE league
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('leagues')
        .delete()
        .eq('league_id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'League deleted' });
});

module.exports = router;
