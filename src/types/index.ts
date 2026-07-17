export type UserRole = "user" | "admin" | "scorer";

export interface Match {
  id: number;
  team1: string;
  team2: string;
  status: "Live" | "Upcoming" | "Completed";
  score: string;
}

export interface UserStats {
  matchesTracked: number;
  winsPredicted: number;
}

export interface ReduxUser {
  username: string;
  email: string;
  role: UserRole;
  favoriteTeams: string[];
  bookmarkedMatches: string[];
  stats: UserStats;
}