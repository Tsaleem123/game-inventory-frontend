import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  List,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import GameListItem from './GameListItem';
import Pager from './Pager';
import { searchGames } from '../api/searchGames';
import { addToUserList } from '../api/userGames';
import type { Game } from '../types/Game';

const pageSize = 10;

/**
 * Strips filler words ("game"/"games") from the query.
 * All genre/theme/keyword resolution is handled entirely on the backend.
 */
function cleanCategory(query: string): string {
  return query.trim().replace(/\bgames?\b/gi, '').trim();
}

// Shared dark-theme styles for MUI inputs
const darkInputSx = {
  input: { color: 'white' },
  label: { color: 'rgba(255, 255, 255, 0.7)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#1976d2' },
  },
};

const darkSelectSx = {
  ...darkInputSx,
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.7)' },
  '& .MuiSelect-select': { color: 'white' },
};

const dropdownMenuProps = {
  PaperProps: {
    sx: {
      backgroundColor: '#1e1e1e',
      color: 'white',
      '& .MuiMenuItem-root:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
      '& .MuiMenuItem-root.Mui-selected': { backgroundColor: 'rgba(25,118,210,0.2)' },
    },
  },
};

type SearchMode = 'category' | 'name';

const GameSearch: React.FC = () => {
  const [mode, setMode]                = useState<SearchMode>('category');
  const [query, setQuery]              = useState('');
  const [debouncedQuery, setDebounced] = useState('');
  const [page, setPage]                = useState(1);
  const [results, setResults]          = useState<Game[]>([]);
  const [total, setTotal]              = useState(0);
  const [loading, setLoading]          = useState(false);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 500);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < 3) {
      setResults([]);
      setTotal(0);
      return;
    }

    const run = async () => {
      setLoading(true);
      try {
        if (mode === 'name') {
          const data = await searchGames(trimmed, page, pageSize);
          setResults(data.games);
          setTotal(data.total);
        } else {
          const category = cleanCategory(trimmed);
          if (!category) { setResults([]); setTotal(0); return; }
          const data = await searchGames('', page, pageSize, category);
          setResults(data.games);
          setTotal(data.total);
        }
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [debouncedQuery, mode, page]);

  const handleAddGame = async (game: Game) => {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please log in to add games to your list.'); return; }
    try {
      await addToUserList(token, game.id, 'to be played', 0);
      alert(`${game.name} added to your list!`);
    } catch {
      alert('Failed to add game. It might already be in your list.');
    }
  };

  const inputLabel = mode === 'category' ? 'Search by category' : 'Search by game name';
  const placeholder = mode === 'category'
    ? 'e.g. horror, racing, dance'
    : 'e.g. Marvel Rivals, FIFA';

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="center"
        gap={2}
        mb={3}
      >
        {/* Mode selector dropdown */}
        <FormControl
          size="small"
          sx={{ minWidth: 180, ...darkSelectSx }}
        >
          <InputLabel>Search by</InputLabel>
          <Select
            label="Search by"
            value={mode}
            onChange={(e: SelectChangeEvent) => {
              setMode(e.target.value as SearchMode);
              setQuery('');
              setPage(1);
              setResults([]);
              setTotal(0);
            }}
            MenuProps={dropdownMenuProps}
          >
            <MenuItem value="category">Category</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>

        {/* Search input */}
        <TextField
          key={mode}
          label={inputLabel}
          placeholder={placeholder}
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          sx={{
            flex: 1,
            maxWidth: { sm: '55%' },
            ...darkInputSx,
          }}
        />
      </Box>

      {/* Results */}
      <Box display="flex" justifyContent="center">
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress sx={{ color: '#a99fd0' }} />
            </Box>
          ) : (
            <>
              <List sx={{ mt: 2 }}>
                {results.map((game) => (
                  <GameListItem key={game.id} game={game} onAdd={handleAddGame} />
                ))}
              </List>

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