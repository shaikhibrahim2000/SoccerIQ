const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

const toInt = (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
};

const toNumber = (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
};

// GET recent player stats
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('player_stats')
        .select('stat_id, match_id, player_id, goals, assists, shots_on_target, key_passes, yellow_cards, red_cards, rating, matches(match_date), players(player_name)')
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST create player stats for a match
router.post('/', async (req, res) => {
    const {
        match_id,
        player_id,
        goals,
        assists,
        shots_on_target,
        shots_off_target,
        key_passes,
        tackles_won,
        tackles_attempted,
        interceptions,
        clearances,
        fouls_committed,
        fouls_won,
        yellow_cards,
        red_cards,
        pass_completion_rate,
        dribbles_successful,
        dribbles_attempted,
        rating,
    } = req.body;

    if (!match_id || !player_id) {
        return res.status(400).json({ error: 'match_id and player_id are required' });
    }

    const insertRow = {
        match_id: toInt(match_id),
        player_id: toInt(player_id),
        goals: toInt(goals),
        assists: toInt(assists),
        shots_on_target: toInt(shots_on_target),
        shots_off_target: toInt(shots_off_target),
        key_passes: toInt(key_passes),
        tackles_won: toInt(tackles_won),
        tackles_attempted: toInt(tackles_attempted),
        interceptions: toInt(interceptions),
        clearances: toInt(clearances),
        fouls_committed: toInt(fouls_committed),
        fouls_won: toInt(fouls_won),
        yellow_cards: toInt(yellow_cards),
        red_cards: toInt(red_cards),
        pass_completion_rate: toNumber(pass_completion_rate),
        dribbles_successful: toInt(dribbles_successful),
        dribbles_attempted: toInt(dribbles_attempted),
        rating: toNumber(rating),
    };

    const { data, error } = await supabase
        .from('player_stats')
        .insert([insertRow])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

module.exports = router;
