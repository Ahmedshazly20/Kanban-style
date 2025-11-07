'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { closeDialog } from '@/features/ui/uiSlice';
import { setSelectedTask } from '@/features/tasks/tasksSlice';
import { useCreateTask, useUpdateTask } from '@/hooks/useTaskQueries';
import type { ColumnType } from '@/types/task';

const columns: { value: ColumnType; label: string }[] = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' },
];

export default function TaskDialog() {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.ui.isDialogOpen);
    const selectedTask = useAppSelector((state) => state.tasks.selectedTask);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [column, setColumn] = useState<ColumnType>('backlog');
    const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask();

    const isEditMode = selectedTask && selectedTask.id > 0;

    useEffect(() => {
        if (selectedTask) {
            setTitle(selectedTask.title || '');
            setDescription(selectedTask.description || '');
            setColumn(selectedTask.column || 'backlog');
        } else {
            setTitle('');
            setDescription('');
            setColumn('backlog');
            setErrors({});
        }
    }, [selectedTask, isOpen]);

    const handleClose = () => {
        dispatch(closeDialog());
        dispatch(setSelectedTask(null));
        setTitle('');
        setDescription('');
        setColumn('backlog');
        setErrors({});
    };

    const validate = () => {
        const newErrors: { title?: string; description?: string } = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        } else if (description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            if (isEditMode && selectedTask) {
                // Update existing task
                await updateMutation.mutateAsync({
                    id: selectedTask.id,
                    data: {
                        title: title.trim(),
                        description: description.trim(),
                        column,
                    },
                });
            } else {
                // Create new task (don't send id)
                await createMutation.mutateAsync({
                    title: title.trim(),
                    description: description.trim(),
                    column,
                });
            }
            handleClose();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
                {isEditMode ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                    <TextField
                        label="Task Title"
                        fullWidth
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) setErrors({ ...errors, title: undefined });
                        }}
                        error={!!errors.title}
                        helperText={errors.title}
                        placeholder="e.g., Design homepage"
                        autoFocus
                    />

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            if (errors.description) setErrors({ ...errors, description: undefined });
                        }}
                        error={!!errors.description}
                        helperText={errors.description}
                        placeholder="e.g., Include hero section and contact form"
                    />

                    <TextField
                        select
                        label="Column"
                        fullWidth
                        value={column}
                        onChange={(e) => setColumn(e.target.value as ColumnType)}
                    >
                        {columns.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isLoading}
                    sx={{ minWidth: 100 }}
                >
                    {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}