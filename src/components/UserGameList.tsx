
import { useEffect, useState } from 'react';
import {
  fetchUserGameList,
  removeFromUserList,
  updateGameRating,
  updateGameStatus
} from '../api/userGames';
import { searchGameById } from '../api/searchGameById';
import { Button, Typography, Box, CircularProgress, Card, CardContent } from '@mui/material';
import type { Game } from '../types/Game';
import { useNavigate } from '@tanstack/react-router';
import RatingDropdown from './RatingDropdown';
import StatusDropdown from './StatusDropdown';

interface UserGameEntry {
  gameId: number;
  status: string;
  rating: number | null;
}

const UserGameList = () => {
  const [games, setGames] = useState<UserGameEntry[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert('Please log in to view your saved games.');
      return;
    }

    const fetchData = async () => {
      try {
        const userGames: UserGameEntry[] = await fetchUserGameList(token);
        setGames(userGames);
      } catch {
        setError('Could not load game list.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRemove = async (gameId: number) => {
    if (!token) return;
    await removeFromUserList(token, gameId);
    setGames(games.filter((g) => g.gameId !== gameId));
  };

  const handleRatingChange = async (gameId: number, newRating: number) => {
    if (!token) return;
    try {
      await updateGameRating(token, gameId, newRating);
      setGames((prev) =>
        prev.map((g) =>
          g.gameId === gameId ? { ...g, rating: newRating } : g
        )
      );
    } catch {
      console.error('Failed to update rating');
    }
  };

  const handleStatusChange = async (gameId: number, newStatus: string) => {
    if (!token) return;
    try {
      await updateGameStatus(token, gameId, newStatus);
      setGames((prev) =>
        prev.map((g) =>
          g.gameId === gameId ? { ...g, status: newStatus } : g
        )
      );
    } catch {
      console.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>

    <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          pt: 2,
          pr: 3,
          boxSizing: 'border-box',
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate({ to: '/app' })}
          sx={{ borderColor: 'white' }}
        >
          Back To Search
        </Button>

      </Box>
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        My Game List
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {games.map((entry) => (
          <UserGameItem
            key={entry.gameId}
            entry={entry}
            onRemove={handleRemove}
            onRatingChange={handleRatingChange}
            onStatusChange={handleStatusChange}
          />
        ))}
      </Box>
    </Box>
    </>
  );
  
};

const UserGameItem = ({
  entry,
  onRemove,
  onRatingChange,
  onStatusChange
}: {
  entry: UserGameEntry;
  onRemove: (gameId: number) => void;
  onRatingChange: (gameId: number, rating: number) => void;
  onStatusChange: (gameId: number, status: string) => void;
}) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const g = await searchGameById(entry.gameId);
        if (mounted) setGame(g);
      } catch {
        if (mounted) setGame(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, [entry.gameId]);

  if (loading) {
    return (
      <Card
        variant="outlined"
        sx={{
          backgroundColor: '#1e1e1e',
          color: 'white',
          borderRadius: 2,
          border: '1px solid #333',
          p: 2
        }}
      >
        <Typography>Loading...</Typography>
      </Card>
    );
  }

  return (

    <Card
      variant="outlined"
      sx={{
        backgroundColor: '#121012',
        color: 'white',
        borderRadius: 2,
        border: '1px solid #333',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Game Image */}
          <Box
            component="img"
            src={game?.image?.icon_url || '/placeholder.png'}
            alt={game?.name}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 1,
              objectFit: 'cover',
              backgroundColor: '#2a2a2a',
              flexShrink: 0
            }}
          />

          {/* Game Title */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {game?.name ?? 'Unknown Game'}
            </Typography>
          </Box>

          {/* Status and Rating Dropdowns */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexShrink: 0 }}>
            <Box sx={{ minWidth: 120 }}>
              <StatusDropdown
                value={entry.status}
                onChange={(status) => onStatusChange(entry.gameId, status)}
              />
            </Box>

            <Box sx={{ minWidth: 100 }}>
              <RatingDropdown
                value={entry.rating ?? 0}
                onChange={(rating) => onRatingChange(entry.gameId, rating)}
                labelId={`rating-${entry.gameId}`}
              />
            </Box>

            {/* Remove Button - Grouped with controls */}
            <Button
              onClick={() => onRemove(entry.gameId)}
              variant="outlined"
              sx={{
                height: 36,
                minWidth: 80,
                color: 'error.main',
                borderColor: 'error.main',
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserGameList;