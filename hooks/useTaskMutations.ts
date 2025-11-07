import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/features/tasks/tasksAPI';
import { Task } from '@/types/task';

export const useTaskMutations = () => {
    const queryClient = useQueryClient();

    const createTaskMutation = useMutation({
        mutationFn: tasksAPI.createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: tasksAPI.updateTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: tasksAPI.deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    return {
        createTaskMutation,
        updateTaskMutation,
        deleteTaskMutation,
    };
};