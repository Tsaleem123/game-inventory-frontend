import React, { useEffect, useState } from 'react';
import GameCarousel from './GameCarousel';
import { getCategoryGames, type Category } from '../api/explore';
import type { Game } from '../types/Game';

interface Props {
  category: Category;
  onAdd: (game: Game) => void;
}

/**
 * A single Explore carousel bound to one category (genre/theme).
 * Each row fetches its own games lazily, so adding more rows via "Load more"
 * doesn't block the rest of the page.
 */
const CategoryRow: React.FC<Props> = ({ category, onAdd }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getCategoryGames(category.type, category.id, 20)
      .then((data) => {
        if (!cancelled) setGames(data);
      })
      .catch(() => {
        if (!cancelled) setGames([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category.type, category.id]);

  // Hide rows that resolve to nothing so the page doesn't show empty sections.
  if (!loading && games.length === 0) return null;

  return (
    <GameCarousel title={category.name} games={games} loading={loading} onAdd={onAdd} />
  );
};

export default CategoryRow;
