
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

const getLeagueMatchIds = async (leagueId) => {
    const { data: seasons, error: seasonsError } = await supabase
        .from('seasons')
        .select('season_id')
        .eq('league_id', leagueId);

    if (seasonsError) throw seasonsError;
    const seasonIds = seasons.map((row) => row.season_id);
    if (seasonIds.length === 0) return [];

    const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select('match_id')
        .in('season_id', seasonIds);

    if (matchesError) throw matchesError;
    return matches.map((row) => row.match_id);
};

router.get('/:id/top-scorers', async (req, res) => {
    try {
        const leagueId = parseInt(req.params.id, 10);
        const matchIds = await getLeagueMatchIds(leagueId);
        if (matchIds.length === 0) return res.json([]);

        const { data, error } = await supabase
            .from('player_stats')
            .select('player_id, goals, players(player_name)')
            .in('match_id', matchIds);

        if (error) return res.status(500).json({ error: error.message });

        const totals = new Map();
        for (const row of data || []) {
            const playerId = row.player_id;
            const name = row.players?.player_name || 'Unknown';
            const current = totals.get(playerId) || { player_id: playerId, player_name: name, total_goals: 0 };
            current.total_goals += row.goals || 0;
            totals.set(playerId, current);
        }

        const result = Array.from(totals.values())
            .sort((a, b) => b.total_goals - a.total_goals)
            .slice(0, 10);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to load top scorers' });
    }
});

router.get('/:id/top-assists', async (req, res) => {
    try {
        const leagueId = parseInt(req.params.id, 10);
        const matchIds = await getLeagueMatchIds(leagueId);
        if (matchIds.length === 0) return res.json([]);

        const { data, error } = await supabase
            .from('player_stats')
            .select('player_id, assists, players(player_name)')
            .in('match_id', matchIds);

        if (error) return res.status(500).json({ error: error.message });

        const totals = new Map();
        for (const row of data || []) {
            const playerId = row.player_id;
            const name = row.players?.player_name || 'Unknown';
            const current = totals.get(playerId) || { player_id: playerId, player_name: name, total_assists: 0 };
            current.total_assists += row.assists || 0;
            totals.set(playerId, current);
        }

        const result = Array.from(totals.values())
            .sort((a, b) => b.total_assists - a.total_assists)
            .slice(0, 10);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to load top assists' });
    }
});

router.get('/:id/table', async (req, res) => {
    try {
        const leagueId = parseInt(req.params.id, 10);
        const matchIds = await getLeagueMatchIds(leagueId);
        if (matchIds.length === 0) return res.json([]);

        const { data, error } = await supabase
            .from('match_teams')
            .select('match_id, team_id, goals_scored, result, teams(team_name)')
            .in('match_id', matchIds);

        if (error) return res.status(500).json({ error: error.message });

        const matchMap = new Map();
        for (const row of data || []) {
            if (!matchMap.has(row.match_id)) {
                matchMap.set(row.match_id, []);
            }
            matchMap.get(row.match_id).push(row);
        }

        const table = new Map();
        const getTeamRow = (row) => {
            if (!table.has(row.team_id)) {
                table.set(row.team_id, {
                    team_id: row.team_id,
                    team_name: row.teams?.team_name || 'Unknown',
                    played: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goals_for: 0,
                    goals_against: 0,
                    goal_diff: 0,
                    points: 0,
                });
            }
            return table.get(row.team_id);
        };

        for (const [matchId, rows] of matchMap.entries()) {
            if (rows.length < 2) continue;
            const [a, b] = rows;
            const aGoals = a.goals_scored || 0;
            const bGoals = b.goals_scored || 0;

            const aRow = getTeamRow(a);
            const bRow = getTeamRow(b);

            aRow.played += 1;
            bRow.played += 1;

            aRow.goals_for += aGoals;
            aRow.goals_against += bGoals;
            bRow.goals_for += bGoals;
            bRow.goals_against += aGoals;

            if (aGoals > bGoals) {
                aRow.wins += 1;
                bRow.losses += 1;
                aRow.points += 3;
            } else if (aGoals < bGoals) {
                bRow.wins += 1;
                aRow.losses += 1;
                bRow.points += 3;
            } else {
                aRow.draws += 1;
                bRow.draws += 1;
                aRow.points += 1;
                bRow.points += 1;
            }
        }

        for (const row of table.values()) {
            row.goal_diff = row.goals_for - row.goals_against;
        }

        const result = Array.from(table.values()).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goal_diff !== a.goal_diff) return b.goal_diff - a.goal_diff;
            return b.goals_for - a.goals_for;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to load league table' });
    }
});

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
