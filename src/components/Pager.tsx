import { Box, Pagination } from '@mui/material';

// Props expected from the parent component
interface Props {
  page: number;                            // current page
  pageCount: number;                       // total number of pages
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void; // handler for page change
}

/**
 * Pager component
 * Renders a Material UI pagination bar centered in a Box,
 * but only if there’s more than one page.
 */
const Pager: React.FC<Props> = ({ page, pageCount, onChange }) => {
  // Only render if pagination is needed
  if (pageCount <= 1) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Pagination
        count={pageCount}
        page={page}
        onChange={onChange}
        variant="outlined"
        className="paginationWhite" 
      />
    </Box>
  );
};

export default Pager;