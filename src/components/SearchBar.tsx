import TextField from '@mui/material/TextField';

// Props expected from the parent component
interface Props {
  value: string;                                       // current input value
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // handler for input change
}

/**
 * SearchBar component
 * A styled Material UI TextField used for typing search queries.
 * Uses a custom CSS class to apply dark theme styling.
 */
const SearchBar: React.FC<Props> = ({ value, onChange }) => (
  <TextField
    sx={{
      maxWidth: { xs: '100%', sm: '80%', md: '60%' },
      '& .MuiInputBase-root': {
        fontSize: { xs: '14px', sm: '16px' }
      }
    }}

    fullWidth                  // spans the container width
    placeholder="Search for a game"
    value={value}              // controlled input value
    onChange={onChange}        // updates parent state on change
    variant="outlined"         // outlined style input box
    className="textFieldDark"  // custom dark styling from CSS
  />
);

export default SearchBar;