'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    DragOverEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import Column from './Column';
import TaskCard from './TaskCard';
import SearchBar from './SearchBar';
import TaskDialog from './TaskDialog';
import ConfirmDialog from './ConfirmDialog';
import Snackbar from './Snackbar';
import { useTasksByColumn } from '@/hooks/useTaskQueries';
import { useUpdateTask } from '@/hooks/useTaskQueries';
import type { Task, ColumnType } from '@/types/task';
import { useAppDispatch } from '@/lib/hooks';
import { openDialog, setSelectedTask } from '@/features/tasks/tasksSlice';

const columns: { title: string; column: ColumnType }[] = [
    { title: 'Backlog', column: 'backlog' },
    { title: 'In Progress', column: 'in-progress' },
    { title: 'Review', column: 'review' },
    { title: 'Done', column: 'done' },
];

export default function KanbanBoard() {
    const dispatch = useAppDispatch();
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Fetch tasks for each column
    const backlogQuery = useTasksByColumn('backlog');
    const inProgressQuery = useTasksByColumn('in-progress');
    const reviewQuery = useTasksByColumn('review');
    const doneQuery = useTasksByColumn('done');

    const updateMutation = useUpdateTask();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;

        // Find the task being dragged
        const allTasks = [
            ...(backlogQuery.data || []),
            ...(inProgressQuery.data || []),
            ...(reviewQuery.data || []),
            ...(doneQuery.data || []),
        ];

        const task = allTasks.find((t) => t.id === active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveTask(null);

        if (!over) return;

        const taskId = active.id as number;
        const newColumn = over.id as ColumnType;

        // Find the task
        const allTasks = [
            ...(backlogQuery.data || []),
            ...(inProgressQuery.data || []),
            ...(reviewQuery.data || []),
            ...(doneQuery.data || []),
        ];

        const task = allTasks.find((t) => t.id === taskId);

        if (task && task.column !== newColumn) {
            // Update task column with optimistic update
            try {
                await updateMutation.mutateAsync({
                    id: taskId,
                    data: { column: newColumn },
                });
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }
    };

    const handleAddTask = () => {
        dispatch(
            setSelectedTask({
                id: 0,
                title: '',
                description: '',
                column: 'backlog',
            } as Task)
        );
        dispatch(openDialog());
    };

    const isLoading =
        backlogQuery.isLoading ||
        inProgressQuery.isLoading ||
        reviewQuery.isLoading ||
        doneQuery.isLoading;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                            📋 Kanban Board
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddTask}
                            sx={{ textTransform: 'none', px: 3 }}
                        >
                            New Task
                        </Button>
                    </Box>

                    <SearchBar />
                </Box>

                {/* Kanban Columns */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        },
                        gap: 2,
                    }}
                >
                    <Column
                        title="Backlog"
                        column="backlog"
                        tasks={backlogQuery.data || []}
                        isLoading={backlogQuery.isLoading}
                    />
                    <Column
                        title="In Progress"
                        column="in-progress"
                        tasks={inProgressQuery.data || []}
                        isLoading={inProgressQuery.isLoading}
                    />
                    <Column
                        title="Review"
                        column="review"
                        tasks={reviewQuery.data || []}
                        isLoading={reviewQuery.isLoading}
                    />
                    <Column
                        title="Done"
                        column="done"
                        tasks={doneQuery.data || []}
                        isLoading={doneQuery.isLoading}
                    />
                </Box>
            </Container>

            {/* Drag Overlay */}
            <DragOverlay dropAnimation={null}>
                {activeTask ? (
                    <Box sx={{ opacity: 0.8, transform: 'rotate(5deg)' }}>
                        <TaskCard task={activeTask} />
                    </Box>
                ) : null}
            </DragOverlay>

            {/* Dialogs */}
            <TaskDialog />
            <ConfirmDialog />
            <Snackbar />
        </DndContext>
    );
}