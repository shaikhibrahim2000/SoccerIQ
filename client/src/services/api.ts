import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Positions Service
export const positionsService = {
    getAll: () => api.get('/positions'),
};

export const leaguesService = {
    getAll: () => api.get('/leagues'),
    create: (data: { league_name: string; country: string }) => api.post('/leagues', data),
    delete: (id: number) => api.delete(`/leagues/${id}`),
};

export const teamsService = {
    getAll: () => api.get('/teams'),
    create: (data: { team_name: string; league_id: number; city?: string; stadium?: string; founded_year?: number | null }) => api.post('/teams', data),
    delete: (id: number) => api.delete(`/teams/${id}`),
};

export const seasonsService = {
    getAll: () => api.get('/seasons'),
};

export const playersService = {
    getAll: () => api.get('/players'),
    create: (data: { player_name: string; default_position_id: number; team_id: number }) => api.post('/players', data),
    delete: (id: number) => api.delete(`/players/${id}`),
};

export const matchesService = {
    record: (data: {
        season_id: number;
        match_date: string;
        match_time?: string;
        venue?: string;
        teamA_id: number;
        teamB_id: number;
        teamA_goals: number;
        teamB_goals: number;
        teamA_role?: string;
        teamB_role?: string;
    }) => api.post('/matches', data),
};

export const headToHeadService = {
    getSummary: (teamA: number, teamB: number) => api.get('/head-to-head', { params: { teamA, teamB } }),
};

export default api;
