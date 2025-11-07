import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/lib/api';
import { useAppDispatch } from '@/lib/hooks';
import { showSnackbar } from '@/features/ui/uiSlice';
import type { Task, ColumnType } from '@/types/task';

// Query Keys Factory (Best Practice for React Query v5)
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

            // Snapshot previous value
            const previousTasks = queryClient.getQueryData(taskKeys.all);

            // Optimistically update
            queryClient.setQueriesData({ queryKey: taskKeys.all }, (old: Task[] | undefined) => {
                if (!old) return old;
                return old.map((task) =>
                    task.id === id ? { ...task, ...data } : task
                );
            });

            return { previousTasks };
        },

        onError: (error, variables, context) => {
            // Rollback on error
            if (context?.previousTasks) {
                queryClient.setQueryData(taskKeys.all, context.previousTasks);
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

            const previousTasks = queryClient.getQueryData(taskKeys.all);

            queryClient.setQueriesData({ queryKey: taskKeys.all }, (old: Task[] | undefined) => {
                if (!old) return old;
                return old.filter((task) => task.id !== deletedId);
            });

            return { previousTasks };
        },

        onError: (error, variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(taskKeys.all, context.previousTasks);
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