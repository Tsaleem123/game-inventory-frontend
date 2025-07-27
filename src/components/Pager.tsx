
import { Box, Pagination } from '@mui/material';

/**
 * Props interface for the Pager component
 */
interface Props {
  /** Current active page number (1-based) */
  page: number;
  /** Total number of pages available */
  pageCount: number;
  /** Callback function triggered when user changes page */
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

/**
 * Pager component that renders a Material UI pagination control
 * Provides navigation between pages with outlined styling and custom CSS class
 * Automatically hides when there's only one page or no pages
 */
const Pager: React.FC<Props> = ({ page, pageCount, onChange }) => {
  // Don't render pagination if there's only one page or no pages
  if (pageCount <= 1) return null;

  return (
    <Box>
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