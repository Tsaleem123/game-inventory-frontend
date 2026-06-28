import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { useNavigate } from '@tanstack/react-router';
import GameCarousel from './GameCarousel';
import CategoryRow from './CategoryRow';
import CategoryPickerDialog from './CategoryPickerDialog';
import { getPopularGames, getAllCategories, type Category } from '../api/explore';
import { addToUserList } from '../api/userGames';
import type { Game } from '../types/Game';

/** How many categories are shown by default before the user customizes them. */
const DEFAULT_VISIBLE = 8;

/** Stable key for a category (type + id). */
const keyOf = (c: Category) => `${c.type}-${c.id}`;

/**
 * Explore page: a featured "Top 10 Popular Today" carousel followed by the
 * category carousels the user has chosen. Users pick which categories appear
 * via the "Select categories" dialog.
 */
const ExplorePage: React.FC = () => {
  const navigate = useNavigate();

  const [popular, setPopular] = useState<Game[]>([]);
  const [popularLoading, setPopularLoading] = useState(true);

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('token')));
  }, []);

  // Load the featured Top 10.
  useEffect(() => {
    let cancelled = false;
    getPopularGames(30)
      .then((data) => {
        if (!cancelled) setPopular(data);
      })
      .catch(() => {
        if (!cancelled) setPopular([]);
      })
      .finally(() => {
        if (!cancelled) setPopularLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load every category once; default to showing the first few.
  useEffect(() => {
    let cancelled = false;
    getAllCategories()
      .then((cats) => {
        if (cancelled) return;
        setAllCategories(cats);
        setSelectedKeys(cats.slice(0, DEFAULT_VISIBLE).map(keyOf));
      })
      .catch(() => {
        if (!cancelled) setAllCategories([]);
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the rendered order aligned with the curated ordering from the backend.
  const selectedCategories = allCategories.filter((c) =>
    selectedKeys.includes(keyOf(c))
  );

  const handleAdd = async (game: Game) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add games to your list.');
      return;
    }
    try {
      await addToUserList(token, game.id, 'to be played', 0);
      alert(`${game.name} added to your list!`);
    } catch {
      alert('Failed to add game. It might already be in your list.');
    }
  };

  return (
    <>
      {/* Top navigation bar */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'flex-end' },
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5 },
          pt: { xs: 1.5, sm: 2 },
          pr: { xs: 2, sm: 3 },
          pl: { xs: 2, sm: 0 },
          boxSizing: 'border-box',
          flexWrap: 'wrap',
        }}
      >
        <Button variant="outlined" size="small" onClick={() => navigate({ to: '/app' })} sx={navBtnSx}>
          Search
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            if (!localStorage.getItem('token')) {
              alert('Please log in to view your saved games.');
            } else {
              navigate({ to: '/my-games' });
            }
          }}
          sx={navBtnSx}
        >
          View My Games
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            if (isLoggedIn) {
              localStorage.removeItem('token');
              setIsLoggedIn(false);
              navigate({ to: '/' });
            } else {
              navigate({ to: '/' });
            }
          }}
          sx={navBtnSx}
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 1, pb: 6 }}>
        {/* Heading + category picker trigger */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          flexWrap="wrap"
          gap={2}
          mb={3}
          px={0.5}
        >
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, m: 0 }}>
            Explore
          </Typography>
          <Button
            variant="outlined"
            startIcon={<TuneIcon />}
            onClick={() => setPickerOpen(true)}
            disabled={categoriesLoading || allCategories.length === 0}
            sx={{
              ...navBtnSx,
              mt: '0 !important',
              alignSelf: 'center',
              // Use the same full-white border while disabled/loading as when
              // active, so the outline never changes (no light-to-bold animation
              // when categories finish loading). Only the text/icon is dimmed.
              '&.Mui-disabled': {
                borderColor: 'white',
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            Select categories
          </Button>
        </Box>

        {/* Featured: Top 10 Popular Today */}
        <GameCarousel
          title="Top 30 Popular Today"
          games={popular}
          loading={popularLoading}
          onAdd={handleAdd}
          showRank
          autoPlay
        />

        {/* Chosen category carousels */}
        {categoriesLoading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress size={28} sx={{ color: '#a99fd0' }} />
          </Box>
        ) : selectedCategories.length === 0 ? (
          <Box textAlign="center" mt={6}>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
              No categories selected yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<TuneIcon />}
              onClick={() => setPickerOpen(true)}
            >
              Select categories
            </Button>
          </Box>
        ) : (
          selectedCategories.map((cat) => (
            <CategoryRow key={keyOf(cat)} category={cat} onAdd={handleAdd} />
          ))
        )}
      </Container>

      {/* Category picker dialog */}
      <CategoryPickerDialog
        open={pickerOpen}
        categories={allCategories}
        selectedKeys={selectedKeys}
        onClose={() => setPickerOpen(false)}
        onApply={(keys) => {
          setSelectedKeys(keys);
          setPickerOpen(false);
        }}
      />
    </>
  );
};

const navBtnSx = {
  borderColor: 'white',
  color: 'white',
  fontSize: { xs: '0.75rem', sm: '0.875rem' },
  px: { xs: 1.5, sm: 2 },
  py: { xs: 0.5, sm: 0.75 },
  minWidth: 'fit-content',
  whiteSpace: 'nowrap',
  '&:hover': {
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
} as const;

export default ExplorePage;
