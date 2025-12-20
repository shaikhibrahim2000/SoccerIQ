# Football Analysis Platform

A full-stack web application for managing football data including leagues, teams, and players.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Supabase account and project

## Setup Instructions

### 1. Clone and Navigate to Project

```bash
cd football-analysis-platform
```

### 2. Set Up Backend (Server)

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```bash
touch .env
```

4. Add your Supabase credentials to `.env`:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
PORT=5001
```

**Note:** The server defaults to port 5001 to match the client configuration. You can change this in the `.env` file if needed.

5. (Optional) Seed positions data:
```bash
node seed_positions.js
```

### 3. Set Up Frontend (Client)

1. Navigate to the client directory (from project root):
```bash
cd ../client
```

2. Install dependencies:
```bash
npm install
```

### 4. Running the Application

You need to run both the server and client simultaneously. Open two terminal windows:

#### Terminal 1 - Start the Backend Server:
```bash
cd server
npm start
```

The server should start on `http://localhost:5001` (or the port you specified in `.env`).

#### Terminal 2 - Start the Frontend Client:
```bash
cd client
npm run dev
```

The client should start on `http://localhost:5173` (Vite's default port).

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
football-analysis-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript types
│   └── package.json
├── server/                 # Express backend
│   ├── routes/            # API routes
│   ├── config/            # Configuration files
│   ├── server.js          # Server entry point
│   └── package.json
└── README.md
```

## Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server
- `npm start` - Start the server
- `npm run dev` - Start the server (alias for start)
- `npm run seed` - Seed positions data

## API Endpoints

- `GET /api/leagues` - Get all leagues
- `POST /api/leagues` - Create a league
- `DELETE /api/leagues/:id` - Delete a league
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create a team
- `DELETE /api/teams/:id` - Delete a team
- `GET /api/players` - Get all players
- `POST /api/players` - Create a player
- `DELETE /api/players/:id` - Delete a player
- `GET /api/positions` - Get all positions

## Troubleshooting

### Port Mismatch Issue
If you see connection errors, check that:
- Server is running on port 5001 (or update `client/src/services/api.ts` baseURL)
- Both servers are running simultaneously

### Supabase Connection Issues
- Verify your `.env` file has correct `SUPABASE_URL` and `SUPABASE_KEY`
- Ensure your Supabase project has the required tables: `leagues`, `teams`, `players`, `positions`

### Database Setup
Make sure your Supabase database has the following tables:
- `leagues` (league_id, league_name, country)
- `teams` (team_id, team_name, league_id, city, stadium, founded_year)
- `players` (player_id, player_name, default_position_id, team_id, date_of_birth, nationality, height_cm, foot)
- `positions` (position_id, position_name, position_category)

## Technologies Used

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Express.js, Supabase (PostgreSQL)
- **HTTP Client:** Axios

