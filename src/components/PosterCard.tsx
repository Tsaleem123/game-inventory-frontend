import React from 'react';
import { Box, Typography, IconButton, Chip, Tooltip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import StarIcon from '@mui/icons-material/Star';
import type { Game } from '../types/Game';

interface Props {
  game: Game;
  /** Optional 1-based rank, rendered as a large badge (used by the Top 10 row). */
  rank?: number;
  onAdd: (game: Game) => void;
}

/** IGDB returns a protocol-relative thumb URL; upscale it to a poster-sized image. */
const toCoverUrl = (url: string) =>
  `https:${url.replace('t_thumb', 't_cover_big')}`;

export const POSTER_WIDTH = 150;

/**
 * Compact, poster-style game card used inside the Explore carousels.
 * Shows the cover art, name, release year and an overall score, plus a quick
 * "add to my list" action that mirrors the behaviour of the search results.
 */
const PosterCard: React.FC<Props> = ({ game, rank, onAdd }) => {
  const score =
    game.total_rating != null
      ? Math.round(game.total_rating)
      : game.rating != null
      ? Math.round(game.rating)
      : null;

  const releaseYear = game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : null;

  return (
    <Box
      sx={{
        position: 'relative',
        width: POSTER_WIDTH,
        flex: '0 0 auto',
        scrollSnapAlign: 'start',
        cursor: 'pointer',
        transition: 'transform 0.18s ease',
        '&:hover': { transform: 'translateY(-4px)' },
        '&:hover .poster-add': { opacity: 1 },
      }}
    >
      {/* Cover art */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'rgba(255,255,255,0.08)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        {game.cover ? (
          <Box
            component="img"
            src={toCoverUrl(game.cover.url)}
            alt={game.name}
            loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {game.name}
            </Typography>
          </Box>
        )}

        {/* Rank badge for the Top 10 row */}
        {rank != null && (
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              left: 6,
              fontWeight: 800,
              fontSize: 34,
              lineHeight: 1,
              color: 'white',
              textShadow: '0 2px 6px rgba(0,0,0,0.9)',
            }}
          >
            {rank}
          </Box>
        )}

        {/* Score chip */}
        {score != null && (
          <Chip
            icon={<StarIcon sx={{ fontSize: 13 }} />}
            label={score}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              height: 22,
              bgcolor: scoreColor(score),
              color: 'white',
              fontSize: 11,
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        )}

        {/* Quick add action (appears on hover) */}
        <Tooltip title="Add to my list">
          <IconButton
            className="poster-add"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(game);
            }}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              opacity: 0,
              transition: 'opacity 0.18s ease',
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.45)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <AddCircleIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Title + year */}
      <Typography
        variant="body2"
        sx={{
          color: 'white',
          mt: 0.75,
          fontWeight: 600,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.2,
        }}
      >
        {game.name}
      </Typography>
      {releaseYear && (
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          {releaseYear}
        </Typography>
      )}
    </Box>
  );
};

function scoreColor(score: number): string {
  if (score >= 75) return '#2e7d32';
  if (score >= 50) return '#e65100';
  return '#b71c1c';
}

export default PosterCard;
