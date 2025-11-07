import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '../features/tasks/tasksAPI';
import { Task } from '../types/task';

export const useTaskMutations = () => {
    const queryClient = useQueryClient();

    const createTaskMutation = useMutation({
        mutationFn: (task: Omit<Task, 'id'>) => tasksAPI.createTask(task),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) =>
            tasksAPI.updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: (id: number) => tasksAPI.deleteTask(id),
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