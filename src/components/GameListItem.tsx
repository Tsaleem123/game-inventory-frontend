import {
  ListItem,
  Avatar,
  ListItemText,
  Typography,
  Stack
} from '@mui/material';

interface Props {
  game: any; 
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
    <ListItem divider alignItems="flex-start">
      {/* Game thumbnail */}
      <Avatar
        src={image?.icon_url || ''}
        alt={name}
        sx={{ width: 64, height: 64, mr: 2 }}
        variant="rounded"
      />

      <ListItemText
        primary={
          <Typography variant="h6" color="white">
            {name}
          </Typography>
        }
        secondary={
          <Stack spacing={0.5}>
            {/* Description */}
            <Typography variant="body2" color="white">
              {deck || 'No description'}
            </Typography>

            {/* Release year */}
            {releaseYear && (
              <Typography variant="caption" color="#ccc">
                Released: {releaseYear}
              </Typography>
            )}

            {/* Studios / publishers */}
            {studioNames && (
              <Typography variant="caption" color="#ccc">
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
