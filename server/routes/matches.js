const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

const getResult = (goalsFor, goalsAgainst) => {
    if (goalsFor > goalsAgainst) return 'win';
    if (goalsFor < goalsAgainst) return 'loss';
    return 'draw';
};

const normalizeRole = (role, fallback) => {
    if (!role) return fallback;
    return String(role).trim().toLowerCase();
};

// POST record a match and its two team rows
router.post('/', async (req, res) => {
    const {
        season_id,
        match_date,
        match_time,
        venue,
        teamA_id,
        teamB_id,
        teamA_goals,
        teamB_goals,
        teamA_role,
        teamB_role,
        teamA_possession,
        teamB_possession,
    } = req.body;

    if (!season_id || !match_date || !teamA_id || !teamB_id) {
        return res.status(400).json({ error: 'season_id, match_date, teamA_id, and teamB_id are required' });
    }
    if (teamA_id === teamB_id) {
        return res.status(400).json({ error: 'teamA_id and teamB_id must be different' });
    }

    const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .insert([{
            season_id,
            match_date,
            match_time: match_time || null,
            venue: venue || null,
        }])
        .select()
        .single();

    if (matchError) return res.status(500).json({ error: matchError.message });

    const matchId = matchData.match_id;
    const goalsA = parseInt(teamA_goals, 10) || 0;
    const goalsB = parseInt(teamB_goals, 10) || 0;

    const { error: teamsError } = await supabase
        .from('match_teams')
        .insert([
            {
                match_id: matchId,
                team_id: teamA_id,
                team_role: normalizeRole(teamA_role, 'home'),
                goals_scored: goalsA,
                possession_percentage: teamA_possession || null,
                result: getResult(goalsA, goalsB),
            },
            {
                match_id: matchId,
                team_id: teamB_id,
                team_role: normalizeRole(teamB_role, 'away'),
                goals_scored: goalsB,
                possession_percentage: teamB_possession || null,
                result: getResult(goalsB, goalsA),
            },
        ]);

    if (teamsError) {
        return res.status(500).json({ error: teamsError.message });
    }

    res.status(201).json({ match_id: matchId });
});

module.exports = router;
