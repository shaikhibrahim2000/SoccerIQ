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

module.exports = router;
