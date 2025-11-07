'use client';

import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setSearchTerm, clearSearch } from '@/features/tasks/tasksSlice';

export default function SearchBar() {
    const dispatch = useAppDispatch();
    const searchTerm = useAppSelector((state) => state.tasks.searchTerm);

    return (
        <Box sx={{ width: '100%', maxWidth: 500 }}>
            <TextField
                fullWidth
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                        <InputAdornment position="end">
                            <IconButton size="small" onClick={() => dispatch(clearSearch())}>
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                    },
                }}
            />
        </Box>
    );
}