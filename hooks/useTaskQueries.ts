import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/lib/api';
import { useAppDispatch } from '@/lib/hooks';
import { showSnackbar } from '@/features/ui/uiSlice';
import type { Task, ColumnType } from '@/types/task';

// Query Keys Factory
export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (column: ColumnType) => [...taskKeys.lists(), column] as const,
    details: () => [...taskKeys.all, 'detail'] as const,
    detail: (id: number) => [...taskKeys.details(), id] as const,
};

export const useTasksByColumn = (column: ColumnType) => {
    return useQuery({
        queryKey: taskKeys.list(column),
        queryFn: () => tasksAPI.getAll({ column }),
        staleTime: 1000 * 60 * 5,
    });
};

export const useAllTasks = () => {
    return useQuery({
        queryKey: taskKeys.all,
        queryFn: () => tasksAPI.getAll(),
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: tasksAPI.create,
        onSuccess: () => {
            // Invalidate all task queries to refetch
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            dispatch(
                showSnackbar({
                    message: '✅ Task created successfully!',
                    severity: 'success',
                })
            );
        },
        onError: (error) => {
            console.error('Create task error:', error);
            dispatch(
                showSnackbar({
                    message: '❌ Failed to create task',
                    severity: 'error',
                })
            );
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) =>
            tasksAPI.update(id, data),

        // Optimistic Update
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: taskKeys.all });

            // Snapshot previous values
            const previousBacklog = queryClient.getQueryData(taskKeys.list('backlog'));
            const previousInProgress = queryClient.getQueryData(taskKeys.list('in-progress'));
            const previousReview = queryClient.getQueryData(taskKeys.list('review'));
            const previousDone = queryClient.getQueryData(taskKeys.list('done'));

            // Optimistically update all columns
            ['backlog', 'in-progress', 'review', 'done'].forEach((col) => {
                queryClient.setQueryData(
                    taskKeys.list(col as ColumnType),
                    (old: Task[] | undefined) => {
                        if (!old) return old;

                        // Remove task from old column
                        const filtered = old.filter((task) => task.id !== id);

                        // If this is the new column, add the task
                        if (data.column === col) {
                            const taskToUpdate = old.find((task) => task.id === id);
                            if (taskToUpdate) {
                                return [...filtered, { ...taskToUpdate, ...data }];
                            } else {
                                // Task was in another column, add it here
                                return filtered;
                            }
                        }

                        return filtered;
                    }
                );
            });

            return { previousBacklog, previousInProgress, previousReview, previousDone };
        },

        onError: (error, variables, context) => {
            // Rollback on error
            if (context) {
                queryClient.setQueryData(taskKeys.list('backlog'), context.previousBacklog);
                queryClient.setQueryData(taskKeys.list('in-progress'), context.previousInProgress);
                queryClient.setQueryData(taskKeys.list('review'), context.previousReview);
                queryClient.setQueryData(taskKeys.list('done'), context.previousDone);
            }
            console.error('Update task error:', error);
            dispatch(
                showSnackbar({
                    message: '❌ Failed to update task',
                    severity: 'error',
                })
            );
        },

        onSuccess: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            dispatch(
                showSnackbar({
                    message: '✅ Task updated successfully!',
                    severity: 'success',
                })
            );
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: tasksAPI.delete,

        // Optimistic Update
        onMutate: async (deletedId) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.all });

            // Snapshot previous values for all columns
            const previousBacklog = queryClient.getQueryData(taskKeys.list('backlog'));
            const previousInProgress = queryClient.getQueryData(taskKeys.list('in-progress'));
            const previousReview = queryClient.getQueryData(taskKeys.list('review'));
            const previousDone = queryClient.getQueryData(taskKeys.list('done'));

            // Remove from all columns
            ['backlog', 'in-progress', 'review', 'done'].forEach((col) => {
                queryClient.setQueryData(
                    taskKeys.list(col as ColumnType),
                    (old: Task[] | undefined) => {
                        if (!old) return old;
                        return old.filter((task) => task.id !== deletedId);
                    }
                );
            });

            return { previousBacklog, previousInProgress, previousReview, previousDone };
        },

        onError: (error, variables, context) => {
            if (context) {
                queryClient.setQueryData(taskKeys.list('backlog'), context.previousBacklog);
                queryClient.setQueryData(taskKeys.list('in-progress'), context.previousInProgress);
                queryClient.setQueryData(taskKeys.list('review'), context.previousReview);
                queryClient.setQueryData(taskKeys.list('done'), context.previousDone);
            }
            console.error('Delete task error:', error);
            dispatch(
                showSnackbar({
                    message: '❌ Failed to delete task',
                    severity: 'error',
                })
            );
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            dispatch(
                showSnackbar({
                    message: '✅ Task deleted successfully!',
                    severity: 'success',
                })
            );
        },
    });
};