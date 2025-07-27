import {
  ListItem,
  Avatar,
  Typography,
  Button,
  Box
} from '@mui/material';
import type { Game } from '../types/Game';

/**
 * Props interface for the GameListItem component
 */
interface Props {
  /** The game object containing all game information */
  game: Game;
  /** Optional callback function to handle adding game to user's list */
  onAdd?: (game: Game) => void;
}

/**
 * GameListItem component that displays a single game in a list format
 * Shows game image, name, description, release year, developers/publishers,
 * and optionally an "Add to My List" button
 */
const GameListItem: React.FC<Props> = ({ game, onAdd }) => {
  // Destructure game properties with default values for optional fields
  const {
    name,
    image,
    deck,
    original_release_date,
    developers = [],
    publishers = []
  } = game;

  // Extract release year from the original release date
  const releaseYear = original_release_date
    ? new Date(original_release_date).getFullYear()
    : null;

  // Combine developers and publishers into a single comma-separated string
  const studioNames = [...developers, ...publishers]
    .map((s: any) => s.name)
    .join(', ');

  /**
   * Handles the "Add to My List" button click
   * Checks for authentication token and calls the onAdd callback if provided
   */
  const handleAdd = () => {
    // Check if user is authenticated by looking for token in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save games to your list.');
      return;
    }

    // Call the onAdd callback if it exists
    if (onAdd) onAdd(game);
  };

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
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      {/* Game image/icon */}
      <Avatar
        src={image?.icon_url || ''}
        alt={name}
        sx={{
          width: '4rem',
          height: '4rem',
          mr: '1rem',
          border: '.2rem solid #3A353A',
          borderRadius: '0.5rem',
          backgroundColor: '#000',
        }}
        variant="rounded"
      />

      {/* Game information container */}
      <Box sx={{ flex: 1 }}>
        {/* Game title */}
        <Typography variant="h6" color="white" sx={{ fontSize: '1.25rem' }}>
          {name}
        </Typography>

        {/* Game details container */}
        <Box mt={1}>
          {/* Game description */}
          <Typography variant="body2" color="white" sx={{ mb: 0.5 }}>
            {deck || 'No description'}
          </Typography>

          {/* Release year - only shown if available */}
          {releaseYear && (
            <Typography variant="caption" color="#ccc" sx={{ display: 'block', mb: 0.5 }}>
              Released: {releaseYear}
            </Typography>
          )}

          {/* Developer/Publisher names - only shown if available */}
          {studioNames && (
            <Typography variant="caption" color="#ccc" sx={{ display: 'block', mb: 0.5 }}>
              {studioNames}
            </Typography>
          )}

          {/* Add to list button - only shown if onAdd callback is provided */}
          {onAdd && (
            <Button
              onClick={handleAdd}
              variant="outlined"
              color="secondary"
              sx={{
                borderColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                mt: 1,
                maxWidth: '50%',
              }}
            >
              Add to My List
            </Button>
          )}
        </Box>
      </Box>
    </ListItem>
  );
};

export default GameListItem;