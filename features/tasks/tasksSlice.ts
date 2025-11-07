import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '@/types/task';


interface TasksState {
    searchTerm: string;
    selectedTask: Task | null;
    draggedTask: Task | null;
    isDialogOpen: boolean;
}

const initialState: TasksState = {
    searchTerm: '',
    selectedTask: null,
    draggedTask: null,
    isDialogOpen: false,
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setSelectedTask: (state, action: PayloadAction<Task | null>) => {
            state.selectedTask = action.payload;
        },
        setDraggedTask: (state, action: PayloadAction<Task | null>) => {
            state.draggedTask = action.payload;
        },
        clearSearch: (state) => {
            state.searchTerm = '';
        },

        openDialog: (state) => {
            state.isDialogOpen = true;
        },
        closeDialog: (state) => {
            state.isDialogOpen = false;
        },
    },
});

export const {
    setSearchTerm,
    setSelectedTask,
    setDraggedTask,
    clearSearch,
    openDialog,
    closeDialog
} = tasksSlice.actions;

export default tasksSlice.reducer;

// Selectors
export const selectSearchTerm = (state: { tasks: TasksState }) => state.tasks.searchTerm;
export const selectSelectedTask = (state: { tasks: TasksState }) => state.tasks.selectedTask;
export const selectDraggedTask = (state: { tasks: TasksState }) => state.tasks.draggedTask;
export const selectIsDialogOpen = (state: { tasks: TasksState }) => state.tasks.isDialogOpen;