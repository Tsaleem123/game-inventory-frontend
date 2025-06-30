import {
  ListItem,
  Avatar,
  ListItemText,
  Typography,
  Stack
} from '@mui/material';
import type { Game } from '../types/Game';

interface Props {
  game: Game;
}

const GameListItem: React.FC<Props> = ({ game }) => {
  const {
    name,
    image,
    deck,
    original_release_date,
    developers = [],
    publishers = []
  } = game;

  const releaseYear = original_release_date
    ? new Date(original_release_date).getFullYear()
    : null;

  const studioNames = [...developers, ...publishers]
    .map((s: any) => s.name)
    .join(', ');

  return (
    <ListItem
      divider
      alignItems="flex-start"
      sx={{
  py: '1rem',
  px: '1.5rem',
  border: '1px solid white',
  borderRadius: '0.75rem',
  mb: '1rem',
  backgroundColor: '#1D191D',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
    borderColor: '#a78bfa', // optional light purple hover border
    cursor: 'pointer'
  }
}}
    >
      {/* Game thumbnail */}
      <Avatar
        src={image?.icon_url || ''}
        alt={name}
        sx={{
          width: '4rem',         // 64px
          height: '4rem',
          mr: '1rem',
          border: '.2rem solid #3A353A;',
          borderRadius: '0.5rem',        // Keep it consistent with ListItem
          backgroundColor: '#000'        // Optional: fallback bg color if image fails
        }}
        variant="rounded"
      />

      <ListItemText
        primary={
          <Typography variant="h6" color="white" sx={{ fontSize: '1.25rem' }}>
            {name}
          </Typography>
        }
        secondary={
          <Stack spacing={0.5}>
            {/* Description */}
            <Typography
              variant="body2"
              color="white"
              sx={{ fontSize: '0.875rem' }}
            >
              {deck || 'No description'}
            </Typography>

            {/* Release year */}
            {releaseYear && (
              <Typography
                variant="caption"
                color="#ccc"
                sx={{ fontSize: '0.75rem' }}
              >
                Released: {releaseYear}
              </Typography>
            )}

            {/* Studios / publishers */}
            {studioNames && (
              <Typography
                variant="caption"
                color="#ccc"
                sx={{ fontSize: '0.75rem' }}
              >
                {studioNames}
              </Typography>
            )}
          </Stack>
        }
      />
    </ListItem>
  );
};

export default GameListItem;
