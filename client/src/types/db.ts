export interface League {
  league_id: number;
  league_name: string;
  country: string;
}

export interface Season {
  season_id: number;
  league_id: number;
  season_year: string;
  start_date: string;
  end_date: string;
}

export interface Team {
  team_id: number;
  league_id: number;
  team_name: string;
  city: string;
  stadium: string;
  founded_year: number;
}

export interface Position {
  position_id: number;
  position_name: string;
  position_category: string;
}

export interface Player {
  player_id: number;
  default_position_id: number;
  player_name: string;
  date_of_birth: string;
  nationality: string;
  height_cm: number;
  foot: string;
}

// Add other interfaces as needed based on the schema
