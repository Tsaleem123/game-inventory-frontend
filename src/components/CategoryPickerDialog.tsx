import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Chip,
  Typography,
} from '@mui/material';
import type { Category } from '../api/explore';

interface Props {
  open: boolean;
  categories: Category[];
  selectedKeys: string[];
  onClose: () => void;
  onApply: (keys: string[]) => void;
}

/** Stable key for a category (type + id). */
const keyOf = (c: Category) => `${c.type}-${c.id}`;

/**
 * Dialog that lets the user choose exactly which category carousels appear on
 * the Explore page. Selection is held in local temp state and only committed
 * when "Apply" is pressed, so cancelling discards changes.
 */
const CategoryPickerDialog: React.FC<Props> = ({
  open,
  categories,
  selectedKeys,
  onClose,
  onApply,
}) => {
  const [temp, setTemp] = useState<string[]>(selectedKeys);

  // Re-seed the working selection every time the dialog opens.
  useEffect(() => {
    if (open) setTemp(selectedKeys);
  }, [open, selectedKeys]);

  const toggle = (key: string) =>
    setTemp((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const genres = categories.filter((c) => c.type === 'genre');
  const themes = categories.filter((c) => c.type === 'theme');

  const renderGroup = (label: string, list: Category[]) =>
    list.length > 0 && (
      <Box mb={2.5}>
        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.55)' }}>
          {label}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
          {list.map((c) => {
            const k = keyOf(c);
            const selected = temp.includes(k);
            return (
              <Chip
                key={k}
                label={c.name}
                onClick={() => toggle(k)}
                variant={selected ? 'filled' : 'outlined'}
                sx={{
                  color: 'white',
                  bgcolor: selected ? '#1976d2' : 'transparent',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    bgcolor: selected ? '#1565c0' : 'rgba(255,255,255,0.08)',
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>
    );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { bgcolor: '#1e1e1e', color: 'white', backgroundImage: 'none' } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Select categories</DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.12)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            {temp.length} selected
          </Typography>
          <Box display="flex" gap={0.5}>
            <Button
              size="small"
              onClick={() => setTemp(categories.map(keyOf))}
              sx={{ color: '#90caf9' }}
            >
              Select all
            </Button>
            <Button size="small" onClick={() => setTemp([])} sx={{ color: '#90caf9' }}>
              Clear
            </Button>
          </Box>
        </Box>

        {renderGroup('Genres', genres)}
        {renderGroup('Themes', themes)}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Cancel
        </Button>
        <Button onClick={() => onApply(temp)} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryPickerDialog;
