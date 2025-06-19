import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  CircularProgress
} from '@mui/material';

import SearchBar from './components/SearchBar';         // Custom search input
import GameListItem from './components/GameListItem';   // Renders each game entry
import Pager from './components/Pager';                 // Pagination component

import { searchGames } from './api/searchGames';        // API call to backend
import type { SearchResponse } from './api/searchGames';// Type for API response

const pageSize = 10; // Number of games per page

const App: React.FC = () => {
  // State variables for query, page, results, total count, and loading state
  const [query, setQuery]         = useState('');
  const [page, setPage]           = useState(1);
  const [results, setResults]     = useState<any[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(false);

  // Fetch games when query or page changes
  useEffect(() => {
    const fetch = async () => {
      if (query.length < 3) {
        setResults([]);
        setTotal(0);
        return;
      }

      setLoading(true);
      try {
        const data: SearchResponse = await searchGames(query, page, pageSize);
        setResults(data.results);
        setTotal(data.number_of_total_results);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [query, page]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      {/* App title */}
      <Typography variant="h4" gutterBottom>
        Game Inventory
      </Typography>

      {/* Search input */}
      <SearchBar
        value={query}
        onChange={e => {
          setQuery(e.target.value); // Update query
          setPage(1);               // Reset to first page
        }}
      />

      {/* Loading indicator or game results */}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* List of games */}
          <List>
            {results.map(game => (
              <GameListItem key={game.id} game={game} />
            ))}
          </List>

          {/* Pagination control */}
          <Pager
            page={page}
            pageCount={Math.ceil(total / pageSize)}
            onChange={(_, p) => setPage(p)} // Update page
          />
        </>
      )}
    </Container>
  );
};

export default App;
