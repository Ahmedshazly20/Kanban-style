'use client';

import { Card, CardContent, Typography, IconButton, Box, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/types/task';
import { useAppDispatch } from '@/lib/hooks';
import { setSelectedTask } from '@/features/tasks/tasksSlice';
import { openDialog, openDeleteDialog } from '@/features/ui/uiSlice';

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
    const dispatch = useAppDispatch();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setSelectedTask(task));
        dispatch(openDialog());
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(openDeleteDialog(task.id));
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            sx={{
                mb: 2,
                cursor: isDragging ? 'grabbing' : 'grab',
                '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                },
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                        {task.title}
                    </Typography>
                    <Box>
                        <IconButton size="small" onClick={handleEdit} color="primary">
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={handleDelete} color="error">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {task.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                        label={`ID: ${task.id}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}