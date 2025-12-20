const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

router.get('/', async (req, res) => {
    const teamA = parseInt(req.query.teamA, 10);
    const teamB = parseInt(req.query.teamB, 10);

    if (!teamA || !teamB || teamA === teamB) {
        return res.status(400).json({ error: 'teamA and teamB must be different valid team IDs' });
    }

    const query = (tableName) => supabase
        .from(tableName)
        .select('match_id, team_id, goals_scored, matches(match_date, match_time, venue)')
        .in('team_id', [teamA, teamB]);

    let { data, error } = await query('match_team');
    if (error && String(error.message || '').includes('match_team')) {
        const retry = await query('match_teams');
        data = retry.data;
        error = retry.error;
    }

    if (error) return res.status(500).json({ error: error.message });

    const matchesById = new Map();
    for (const row of data || []) {
        if (!matchesById.has(row.match_id)) {
            matchesById.set(row.match_id, { match: row.matches, teams: [] });
        }
        matchesById.get(row.match_id).teams.push(row);
    }

    const headToHeadMatches = [];
    for (const [matchId, entry] of matchesById.entries()) {
        if (entry.teams.length < 2) continue;
        const teamARow = entry.teams.find((t) => t.team_id === teamA);
        const teamBRow = entry.teams.find((t) => t.team_id === teamB);
        if (!teamARow || !teamBRow) continue;
        headToHeadMatches.push({
            match_id: matchId,
            match_date: entry.match?.match_date || null,
            match_time: entry.match?.match_time || null,
            venue: entry.match?.venue || null,
            teamA_goals: teamARow.goals_scored ?? 0,
            teamB_goals: teamBRow.goals_scored ?? 0,
        });
    }

    headToHeadMatches.sort((a, b) => {
        const dateA = a.match_date ? new Date(a.match_date).getTime() : 0;
        const dateB = b.match_date ? new Date(b.match_date).getTime() : 0;
        return dateB - dateA;
    });

    let teamAWins = 0;
    let teamBWins = 0;
    let draws = 0;

    for (const match of headToHeadMatches) {
        if (match.teamA_goals > match.teamB_goals) teamAWins += 1;
        else if (match.teamA_goals < match.teamB_goals) teamBWins += 1;
        else draws += 1;
    }

    const totalMatches = headToHeadMatches.length;
    const toPct = (count) => (totalMatches ? Math.round((count / totalMatches) * 100) : 0);

    res.json({
        teamA,
        teamB,
        totalMatches,
        teamAWins,
        teamBWins,
        draws,
        teamAWinPct: toPct(teamAWins),
        teamBWinPct: toPct(teamBWins),
        drawPct: toPct(draws),
        recentMatches: headToHeadMatches.slice(0, 5),
    });
});

module.exports = router;
