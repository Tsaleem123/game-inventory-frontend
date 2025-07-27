import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

/**
 * Props interface for the RatingDropdown component
 */
interface RatingDropdownProps {
  /** Current rating value (1-10) */
  value: number
  /** Callback function triggered when rating changes */
  onChange: (value: number) => void
  /** Optional label ID for accessibility and form association */
  labelId?: string
}

/**
 * RatingDropdown component that renders a dropdown selector for rating values
 * Provides a 1-10 rating scale in a Material UI Select component
 * Features outlined styling, compact size, and proper accessibility labels
 */
const RatingDropdown: React.FC<RatingDropdownProps> = ({ value, onChange, labelId }) => {
  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2 }}>
      {/* Label for the dropdown */}
      <InputLabel id={labelId}>Rating</InputLabel>
      
      {/* Rating selection dropdown */}
      <Select
        labelId={labelId}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))} // Convert string to number
        label="Rating"
      >
        {/* Generate rating options from 1 to 10 */}
        {[...Array(10)].map((_, i) => (
          <MenuItem key={i + 1} value={i + 1}>
            {i + 1}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default RatingDropdown