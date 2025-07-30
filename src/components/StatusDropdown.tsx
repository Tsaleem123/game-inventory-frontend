import { MenuItem, TextField } from '@mui/material';

/**
 * Props interface for the StatusDropdown component
 */
interface StatusDropdownProps {
  /** Current selected status value */
  value: string;
  /** Callback function called when status selection changes */
  onChange: (value: string) => void;
}

/**
 * Available status options for the dropdown
 * Represents different states of game/media consumption progress
 */
const statusOptions = ['To be played', 'In Progress', 'Dropped', 'Finished'];

/**
 * StatusDropdown component renders a Material-UI select dropdown
 * for choosing between different status options
 * 
 * @param value - Currently selected status value
 * @param onChange - Handler function for status changes
 * @returns JSX element containing the status dropdown
 */
const StatusDropdown: React.FC<StatusDropdownProps> = ({ value, onChange }) => {
  return (
    <TextField
    
      select // Enables dropdown/select behavior
      label="Status"
      value={value}
      onChange={(e) => onChange(e.target.value)} // Pass selected value to parent
      size="small" // Compact size variant
      sx={{ mr: 1, minWidth: 140 }} // Styling: right margin and minimum width
    >
      {/* Render each status option as a MenuItem */}
      {statusOptions.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default StatusDropdown;