// GameListItem.tsx
import React from 'react';
import {
  ListItem, ListItemAvatar, Avatar,
   IconButton, Chip,
  Box, Typography, Tooltip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import type { Game } from '../types/Game';

interface Props {
  game: Game;
  onAdd: (game: Game) => void;
}

// Converts IGDB thumb URL → a larger screenshot size
const toScreenshotUrl = (url: string) =>
  `https:${url.replace('t_thumb', 't_screenshot_med')}`;

const toCoverUrl = (url: string) =>
  `https:${url.replace('t_thumb', 't_cover_big')}`;

const GameListItem: React.FC<Props> = ({ game, onAdd }) => {
  const userScore = game.rating != null
    ? Math.round(game.rating) : null;
  const criticScore = game.aggregated_rating != null
    ? Math.round(game.aggregated_rating) : null;
  const releaseYear = game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : null;
  const developer = game.involved_companies
    ?.find(c => c.developer)?.company.name;

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        bgcolor: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        mb: 1,
        flexDirection: 'column',
        gap: 1,
      }}
      secondaryAction={
        <IconButton edge="end" onClick={() => onAdd(game)} sx={{ color: 'white' }}>
          <AddCircleOutlineIcon />
        </IconButton>
      }
    >
      {/* Top row: cover + main info */}
      <Box display="flex" gap={2} width="100%">
        <ListItemAvatar>
          <Avatar
            variant="rounded"
            src={game.cover ? toCoverUrl(game.cover.url) : undefined}
            sx={{ width: 56, height: 80, borderRadius: 1 }}
          />
        </ListItemAvatar>

        <Box flex={1}>
          <Typography variant="subtitle1" color="white" fontWeight={600}>
            {game.name}
            {releaseYear && (
              <Typography component="span" variant="body2"
                sx={{ color: 'rgba(255,255,255,0.5)', ml: 1 }}>
                ({releaseYear})
              </Typography>
            )}
          </Typography>

          {developer && (
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {developer}
            </Typography>
          )}

          {/* Ratings row */}
          <Box display="flex" gap={1} mt={0.5} flexWrap="wrap">
            {userScore != null && (
              <Tooltip title={`${game.rating_count ?? 0} user ratings`}>
                <Chip
                  icon={<StarIcon sx={{ fontSize: 14 }} />}
                  label={`User: ${userScore}`}
                  size="small"
                  sx={{ bgcolor: scoreColor(userScore), color: 'white', fontSize: 11 }}
                />
              </Tooltip>
            )}
            {criticScore != null && (
              <Tooltip title={`${game.aggregated_rating_count ?? 0} critic reviews`}>
                <Chip
                  label={`Critics: ${criticScore}`}
                  size="small"
                  sx={{ bgcolor: scoreColor(criticScore), color: 'white', fontSize: 11 }}
                />
              </Tooltip>
            )}
          </Box>

          {/* Genres */}
          {game.genres && game.genres.length > 0 && (
            <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
              {game.genres.map(g => (
                <Chip key={g.name} label={g.name} size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: 10 }} />
              ))}
            </Box>
          )}

          {/* Platforms */}
          {game.platforms && (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', mt: 0.5, display: 'block' }}>
              {game.platforms.map(p => p.name).join(' · ')}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Screenshot strip */}
      {game.screenshots && game.screenshots.length > 0 && (
        <Box display="flex" gap={1} overflow="hidden" width="100%">
          {game.screenshots.slice(0, 3).map((s, i) => (
            <Box
              key={i}
              component="img"
              src={toScreenshotUrl(s.url)}
              alt={`Screenshot ${i + 1}`}
              sx={{ height: 72, borderRadius: 1, objectFit: 'cover', flex: 1, maxWidth: '33%' }}
            />
          ))}
        </Box>
      )}

      {/* Summary */}
      {game.summary && (
        <Typography variant="body2"
          sx={{ color: 'rgba(255,255,255,0.6)', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {game.summary}
        </Typography>
      )}
    </ListItem>
  );
};

function scoreColor(score: number): string {
  if (score >= 75) return '#2e7d32';
  if (score >= 50) return '#e65100';
  return '#b71c1c';
}

export default GameListItem;