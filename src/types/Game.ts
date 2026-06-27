export type Game = {
  id: number;
  name: string;
  summary?: string;
  cover?: { url: string };
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  total_rating?: number;
  total_rating_count?: number;
  screenshots?: { url: string }[];
  genres?: { name: string }[];
  platforms?: { name: string }[];
  first_release_date?: number;  // Unix timestamp
  involved_companies?: {
    company: { name: string };
    developer: boolean;
  }[];
};