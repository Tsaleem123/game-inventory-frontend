// Base URL for all game-related API endpoints
const BASE_URL = `${import.meta.env.VITE_ENDPOINT}api/games`;

/**
 * Adds a game to the user's personal game list
 * @param token - JWT authentication token
 * @param gameId - Unique identifier for the game
 * @param status - Current status of the game (e.g., 'to be played', 'playing', 'completed')
 * @param rating - User's rating for the game (0-10 scale)
 * @returns Promise that resolves to the API response data
 * @throws Error if the request fails
 */
export const addToUserList = async (token: string, gameId: number, status: string, rating: number) => {
  const res = await fetch(`${BASE_URL}/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ gameId, status, rating }),
  });
  
  if (!res.ok) throw new Error('Failed to add game');
  return res.json();
};

/**
 * Fetches the user's complete game list from the server
 * @param token - JWT authentication token
 * @returns Promise that resolves to an array of user's games with their statuses and ratings
 * @throws Error if the request fails or user is not authenticated
 */
export const fetchUserGameList = async (token: string) => {
  const res = await fetch(`${BASE_URL}/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) throw new Error('Failed to fetch list');
  return res.json();
};

/**
 * Removes a game from the user's personal game list
 * @param token - JWT authentication token
 * @param gameId - Unique identifier for the game to remove
 * @returns Promise that resolves when the game is successfully removed
 * @throws Error if the request fails or game is not found
 */
export const removeFromUserList = async (token: string, gameId: number) => {
  const res = await fetch(`${BASE_URL}/list/${gameId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) throw new Error('Failed to remove game');
};

/**
 * Updates the user's rating for a specific game in their list
 * @param token - JWT authentication token
 * @param gameId - Unique identifier for the game
 * @param rating - New rating value (typically 0-10 scale)
 * @returns Promise that resolves when the rating is successfully updated
 * @throws Error if the request fails or game is not found in user's list
 */
export const updateGameRating = async (
  token: string,
  gameId: number,
  rating: number
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/usergames/${gameId}/rating`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ rating })
  });

  if (!response.ok) {
    throw new Error('Failed to update rating');
  }
};

/**
 * Updates the status of a specific game in the user's list
 * @param token - JWT authentication token
 * @param gameId - Unique identifier for the game
 * @param status - New status value (e.g., 'to be played', 'playing', 'completed', 'dropped')
 * @returns Promise that resolves when the status is successfully updated
 * @throws Error if the request fails or game is not found in user's list
 */
export const updateGameStatus = async (
  token: string,
  gameId: number,
  status: string
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/usergames/${gameId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error('Failed to update status');
  }
};