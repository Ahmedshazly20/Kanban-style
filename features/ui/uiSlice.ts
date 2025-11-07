import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    isDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    taskToDelete: number | null;
    snackbar: {
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    };
}

const initialState: UIState = {
    isDialogOpen: false,
    isDeleteDialogOpen: false,
    taskToDelete: null,
    snackbar: {
        open: false,
        message: '',
        severity: 'info',
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openDialog: (state) => {
            state.isDialogOpen = true;
        },
        closeDialog: (state) => {
            state.isDialogOpen = false;
        },
        openDeleteDialog: (state, action: PayloadAction<number>) => {
            state.isDeleteDialogOpen = true;
            state.taskToDelete = action.payload;
        },
        closeDeleteDialog: (state) => {
            state.isDeleteDialogOpen = false;
            state.taskToDelete = null;
        },
        showSnackbar: (
            state,
            action: PayloadAction<{ message: string; severity: 'success' | 'error' | 'info' }>
        ) => {
            state.snackbar = { ...action.payload, open: true };
        },
        hideSnackbar: (state) => {
            state.snackbar.open = false;
        },
    },
});

export const {
    openDialog,
    closeDialog,
    openDeleteDialog,
    closeDeleteDialog,
    showSnackbar,
    hideSnackbar,
} = uiSlice.actions;

export default uiSlice.reducer;