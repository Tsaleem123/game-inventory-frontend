import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PosterCard, { POSTER_WIDTH } from './PosterCard';
import type { Game } from '../types/Game';

interface Props {
  title: string;
  games: Game[];
  loading?: boolean;
  onAdd: (game: Game) => void;
  /** Render 1-based rank badges (used by the Top 10 row). */
  showRank?: boolean;
  /** Auto-advance the row on a timer (used by the Top 10 row). */
  autoPlay?: boolean;
}

const GAP = 16; // px between cards, matches the `gap` below
const SCROLL_STEP = (POSTER_WIDTH + GAP) * 3; // scroll ~3 cards per arrow click

/**
 * A horizontally-scrolling row of poster cards with arrow controls.
 * Optionally auto-advances (for the featured Top 10 row) and shows rank badges.
 */
const GameCarousel: React.FC<Props> = ({
  title,
  games,
  loading = false,
  onAdd,
  showRank = false,
  autoPlay = false,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // Recompute which arrows should be enabled based on scroll position.
  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
  }, [games]);

  const scrollBy = (dir: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -SCROLL_STEP : SCROLL_STEP, behavior: 'smooth' });
  };

  // Auto-play: gently advance, looping back to the start once the end is reached.
  useEffect(() => {
    if (!autoPlay || games.length === 0) return;
    const id = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
      }
    }, 4000);
    return () => clearInterval(id);
  }, [autoPlay, games]);

  return (
    <Box sx={{ mb: 4, position: 'relative' }}>
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1.5, px: 0.5 }}>
        {title}
      </Typography>

      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: 220 }}>
          <CircularProgress size={28} />
        </Box>
      ) : games.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', px: 0.5 }}>
          No games found for this category.
        </Typography>
      ) : (
        <Box sx={{ position: 'relative' }}>
          {/* Left arrow */}
          <IconButton
            onClick={() => scrollBy('left')}
            disabled={!canLeft}
            sx={arrowSx('left', canLeft)}
            aria-label="Scroll left"
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Scroller */}
          <Box
            ref={scrollerRef}
            onScroll={updateArrows}
            sx={{
              display: 'flex',
              gap: `${GAP}px`,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              pb: 1,
              px: 0.5,
              // Hide scrollbar for a cleaner carousel look
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {games.map((game, i) => (
              <PosterCard
                key={game.id}
                game={game}
                rank={showRank ? i + 1 : undefined}
                onAdd={onAdd}
              />
            ))}
          </Box>

          {/* Right arrow */}
          <IconButton
            onClick={() => scrollBy('right')}
            disabled={!canRight}
            sx={arrowSx('right', canRight)}
            aria-label="Scroll right"
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

function arrowSx(side: 'left' | 'right', enabled: boolean) {
  return {
    position: 'absolute' as const,
    top: '40%',
    [side]: -8,
    zIndex: 2,
    transform: 'translateY(-50%)',
    color: 'white',
    bgcolor: 'rgba(0,0,0,0.55)',
    opacity: enabled ? 1 : 0,
    pointerEvents: enabled ? 'auto' : 'none',
    transition: 'opacity 0.2s ease',
    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
    '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' },
  };
}

export default GameCarousel;
