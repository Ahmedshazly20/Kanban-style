'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { closeDeleteDialog, openDialog } from '@/features/ui/uiSlice';
import { useDeleteTask } from '@/hooks/useTaskQueries';

export default function ConfirmDialog() {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.ui.isDeleteDialogOpen);
    const taskToDelete = useAppSelector((state) => state.ui.taskToDelete);

    const deleteMutation = useDeleteTask();

    const handleClose = () => {
        dispatch(closeDeleteDialog());
    };

    const handleConfirm = async () => {
        if (taskToDelete) {
            try {
                await deleteMutation.mutateAsync(taskToDelete);
                handleClose();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                <WarningAmberIcon />
                Confirm Delete
            </DialogTitle>

            <DialogContent>
                <Typography>
                    Are you sure you want to delete this task? This action cannot be undone.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} disabled={deleteMutation.isPending}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    disabled={deleteMutation.isPending}
                    sx={{ minWidth: 100 }}
                >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}