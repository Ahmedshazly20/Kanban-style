export type ColumnType = 'backlog' | 'in-progress' | 'review' | 'done';

export interface Task {
    id: number;
    title: string;
    description: string;
    column: ColumnType;
    createdAt?: string;
    updatedAt?: string;
}

export interface TasksState {
    searchTerm: string;
    selectedTask: Task | null;
    isDialogOpen: boolean;
    draggedTask: Task | null;
}