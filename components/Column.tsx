'use client';

import { Paper, Typography, Box, CircularProgress, Button } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from './TaskCard';
import type { Task, ColumnType } from '@/types/task';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { openDialog, setSelectedTask } from '@/features/tasks/tasksSlice';
import { useState, useMemo } from 'react';

interface ColumnProps {
    title: string;
    column: ColumnType;
    tasks: Task[];
    isLoading?: boolean;
}

const columnColors: Record<ColumnType, string> = {
    backlog: '#f44336',
    'in-progress': '#ff9800',
    review: '#2196f3',
    done: '#4caf50',
};

export default function Column({ title, column, tasks, isLoading }: ColumnProps) {
    const dispatch = useAppDispatch();
    const searchTerm = useAppSelector((state) => state.tasks.searchTerm);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const { setNodeRef, isOver } = useDroppable({
        id: column,
    });

    // Filter tasks based on search term
    const filteredTasks = useMemo(() => {
        if (!searchTerm) return tasks;

        const lowerSearch = searchTerm.toLowerCase();
        return tasks.filter(
            (task) =>
                task.title.toLowerCase().includes(lowerSearch) ||
                task.description.toLowerCase().includes(lowerSearch)
        );
    }, [tasks, searchTerm]);

    // Paginate tasks
    const paginatedTasks = useMemo(() => {
        return filteredTasks.slice(0, page * ITEMS_PER_PAGE);
    }, [filteredTasks, page]);

    const hasMore = paginatedTasks.length < filteredTasks.length;

    const handleAddTask = () => {
        dispatch(setSelectedTask({
            id: 0,
            title: '',
            description: '',
            column
        } as Task));
        dispatch(openDialog());
    };

    const loadMore = () => {
        setPage((prev) => prev + 1);
    };

    return (
        <Paper
            ref={setNodeRef}
            elevation={isOver ? 8 : 2}
            sx={{
                p: 2,
                minHeight: '500px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: isOver ? 'action.hover' : 'background.paper',
                transition: 'all 0.2s ease-in-out',
                borderTop: `4px solid ${columnColors[column]}`,
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                        {title}
                    </Typography>
                    <Box
                        sx={{
                            backgroundColor: columnColors[column],
                            color: 'white',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                        }}
                    >
                        {filteredTasks.length}
                    </Box>
                </Box>

                <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddTask}
                    variant="outlined"
                    sx={{ textTransform: 'none' }}
                >
                    Add
                </Button>
            </Box>

            {/* Tasks List */}
            <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredTasks.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                        <Typography variant="body2">
                            {searchTerm ? 'No tasks found' : 'No tasks yet'}
                        </Typography>
                    </Box>
                ) : (
                    <SortableContext items={paginatedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {paginatedTasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </SortableContext>
                )}

                {/* Load More Button */}
                {hasMore && !isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button onClick={loadMore} variant="text" size="small">
                            Load More ({filteredTasks.length - paginatedTasks.length} remaining)
                        </Button>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}