import axios, { AxiosError } from 'axios';
import type { Task, ColumnType } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/tasks';

// Custom error handler
const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        throw new Error(
            axiosError.response?.data
                ? JSON.stringify(axiosError.response.data)
                : axiosError.message
        );
    }
    throw error;
};

export const tasksAPI = {
    getAll: async (params?: {
        column?: ColumnType;
        _page?: number;
        _limit?: number;
        q?: string;
    }) => {
        try {
            const { data } = await axios.get<Task[]>(API_URL, { params });
            return data;
        } catch (error) {
            handleApiError(error);
            return [];
        }
    },

    getById: async (id: number) => {
        try {
            const { data } = await axios.get<Task>(`${API_URL}/${id}`);
            return data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    create: async (task: Omit<Task, 'id'>) => {
        try {
            const { data } = await axios.post<Task>(API_URL, {
                ...task,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            return data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    update: async (id: number, task: Partial<Task>) => {
        try {
            const { data } = await axios.patch<Task>(`${API_URL}/${id}`, {
                ...task,
                updatedAt: new Date().toISOString(),
            });
            return data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    delete: async (id: number) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },
};