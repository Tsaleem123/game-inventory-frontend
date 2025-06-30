import axios from 'axios';
import type { Game } from '../types/Game';
// Define the shape of the expected response from the backend API
export interface SearchResponse {
  results: Game[]
  number_of_total_results: number
  limit: number
  offset: number
}
/**
 * Sends a GET request to your .NET backend to search for games
 * using the Giant Bomb API (proxied through your backend).
 *
 * @param query     The user's search term (e.g. "zelda")
 * @param page      The current page of results (default: 1)
 * @param pageSize  How many results per page (default: 10)
 * @returns         A promise resolving to a SearchResponse object
 */
export async function searchGames(
  query: string,
  page: number = 1,
  pageSize: number = 10
): Promise<SearchResponse> {
  // Send request to your local backend API with query parameters
  const res = await axios.get('https://localhost:7098/api/search', {
    params: { query, page, pageSize }
  });

  // Return the data typed as a SearchResponse object
  return res.data as SearchResponse;
}