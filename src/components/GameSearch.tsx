import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  List,
  TextField
} from '@mui/material';
import GameListItem from './GameListItem';
import Pager from './Pager';
import { searchGames } from '../api/searchGames';
import { addToUserList } from '../api/userGames';
import type { Game } from '../types/Game';
import type { SearchResponse } from '../api/searchGames';

// Number of games to display per page
const pageSize = 10;

/**
 * GameSearch component that provides a search interface for games
 * Features debounced search input, pagination, and the ability to add games to user's list
 */
const GameSearch: React.FC = () => {
  // State for the current search query input
  const [query, setQuery] = useState('');
  
  // State for the debounced search query (used for actual API calls)
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  
  // State for the current page number
  const [page, setPage] = useState(1);
  
  // State for storing search results
  const [results, setResults] = useState<Game[]>([]);
  
  // State for storing total number of results (for pagination)
  const [total, setTotal] = useState(0);
  
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  
  /**
   * Effect for debouncing the search query
   * Delays the API call by 500ms after user stops typing
   */
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timeout);
  }, [query]);

  /**
   * Effect for performing the actual search API call
   * Triggers when debounced query or page changes
   */
  useEffect(() => {
    // Don't search if query is too short
    if (debouncedQuery.trim().length < 3) {
      setResults([]);
      setTotal(0);
      return;
    }

    /**
     * Async function to fetch search results from the API
     */
    const fetch = async () => {
      setLoading(true);
      try {
        const data: SearchResponse = await searchGames(debouncedQuery, page, pageSize);
        setResults(data.results);
        setTotal(data.number_of_total_results);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [debouncedQuery, page]);

  /**
   * Handles adding a game to the user's list
   * Checks for authentication and calls the API to add the game
   * @param game - The game object to add to the user's list
   */
  const handleAddGame = async (game: Game) => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add games to your list.');
      return;
    }

    try {
      // Add game to user's list with default status and rating
      await addToUserList(token, game.id, 'to be played', 0);
      alert(`${game.name} added to your list!`);
    } catch {
      // Handle errors (likely duplicate entries)
      alert('Failed to add game. It might already be in your list.');
    }
  };

  return (
    <>
      {/* Search input section */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <TextField
          label="Search games"
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // Reset to first page when search query changes
            setPage(1);
          }}
          sx={{
            width: 400,
            // Styling for dark theme compatibility
            input: { color: 'white' }, // Input text color
            label: { color: 'rgba(255, 255, 255, 0.7)' }, // Label color
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1976d2' // Focused label color
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
              '& fieldset': { 
                borderColor: 'rgba(255, 255, 255, 0.23)' // Default border color
              },
              '&:hover fieldset': { 
                borderColor: 'rgba(255, 255, 255, 0.5)' // Hover border color
              },
              '&.Mui-focused fieldset': { 
                borderColor: '#1976d2' // Focused border color
              }
            }
          }}
        />
      </Box>

      {/* Results section */}
      <Box display="flex" justifyContent="center">
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          {/* Loading indicator */}
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Game results list */}
              <List sx={{ mt: 2 }}>
                {results.map((game) => (
                  <GameListItem key={game.id} game={game} onAdd={handleAddGame} />
                ))}
              </List>

              {/* Pagination component - only shown if there are results */}
              {results.length > 0 && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Pager
                    page={page}
                    pageCount={Math.ceil(total / pageSize)}
                    onChange={(_, p) => setPage(p)}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default GameSearch;