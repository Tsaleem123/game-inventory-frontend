import type { Game } from '../types/Game';
/**
 * Fetches a single game's details from your .NET backend
 * which proxies the Giant Bomb API by ID.
 *
 * @param id The Giant Bomb game ID
 * @returns A Game object with detailed info
 */
export async function searchGameById(id: number): Promise<Game> {
  const res = await fetch(`${import.meta.env.VITE_ENDPOINT}api/search/by-id/${id}`);
  if (!res.ok) throw new Error('Game not found');

  const json = await res.json();
  return json.results || json.results?.[0] || json.game || json;
}
