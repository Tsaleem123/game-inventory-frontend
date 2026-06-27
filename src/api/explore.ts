import axios from 'axios';
import type { Game } from '../types/Game';

/**
 * API client for the Explore page.
 * All endpoints are served by the backend ExploreController, which proxies IGDB.
 */

const EXPLORE_BASE = `${import.meta.env.VITE_ENDPOINT}api/explore`;

/** A single Explore category (an IGDB genre or theme). */
export interface Category {
  type: 'genre' | 'theme';
  id: number;
  name: string;
}

interface GamesResponse {
  games: Game[];
}

interface CategoriesResponse {
  categories: Category[];
  total: number;
  hasMore: boolean;
}

/**
 * Fetches the "Top N popular today" games (IGDB trending, with backend fallback
 * to all-time rating count if the trending signal is unavailable).
 */
export async function getPopularGames(limit = 10): Promise<Game[]> {
  const res = await axios.get<GamesResponse>(`${EXPLORE_BASE}/popular`, {
    params: { limit },
  });
  return res.data.games ?? [];
}

/**
 * Fetches a page of category descriptors so the page can render / "load more" rows.
 */
export async function getCategories(
  page = 1,
  pageSize = 5
): Promise<CategoriesResponse> {
  const res = await axios.get<CategoriesResponse>(`${EXPLORE_BASE}/categories`, {
    params: { page, pageSize },
  });
  return res.data;
}

/**
 * Fetches every available category (genres + themes) in one call.
 * Used to populate the category picker dialog.
 */
export async function getAllCategories(): Promise<Category[]> {
  const res = await axios.get<CategoriesResponse>(`${EXPLORE_BASE}/categories`, {
    params: { page: 1, pageSize: 100 },
  });
  return res.data.categories ?? [];
}

/**
 * Fetches the games for a single category row, ranked by popularity.
 */
export async function getCategoryGames(
  type: 'genre' | 'theme',
  id: number,
  limit = 20
): Promise<Game[]> {
  const res = await axios.get<GamesResponse>(`${EXPLORE_BASE}/category`, {
    params: { type, id, limit },
  });
  return res.data.games ?? [];
}
