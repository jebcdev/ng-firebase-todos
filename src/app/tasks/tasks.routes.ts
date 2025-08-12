import { Routes } from "@angular/router";

export const tasksRoutes: Routes = [
    {
        title: 'Tasks',
        path: '',
        loadComponent: () => import("@app/tasks/pages/index/tasks-index-page")
    },
    {
        title: 'Create Task',
        path: 'create',
        loadComponent: () => import("@app/tasks/pages/create/tasks-create-page")
    },
    {
        title: 'Edit Task',
        path: 'edit/:taskId',
        loadComponent: () => import("@app/tasks/pages/edit/task-edit-page")
    }
]

export default tasksRoutes;