'use client';

import { Snackbar as MUISnackbar, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { hideSnackbar } from '@/features/ui/uiSlice';

export default function Snackbar() {
    const dispatch = useAppDispatch();
    const { open, message, severity } = useAppSelector((state) => state.ui.snackbar);

    const handleClose = () => {
        dispatch(hideSnackbar());
    };

    return (
        <MUISnackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                sx={{ width: '100%' }}
                elevation={6}
                variant="filled"
            >
                {message}
            </Alert>
        </MUISnackbar>
    );
}