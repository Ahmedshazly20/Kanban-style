import { tasksAPI as libTasksAPI } from '@/lib/api';

// Adapter to match the function names used across the app
export const tasksAPI = {
    // list / query
    getTasks: libTasksAPI.getAll,

    // CRUD
    createTask: libTasksAPI.create,
    updateTask: libTasksAPI.update,
    deleteTask: libTasksAPI.delete,
};