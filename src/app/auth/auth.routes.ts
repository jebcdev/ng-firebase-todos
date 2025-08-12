import { Routes } from "@angular/router";

export const authRoutes: Routes = [
    {
        title: "Register",
        path: "register",
        loadComponent: () => import("./pages/register/auth-register-page")
    },
    {
        title: "Login",
        path: "login",
        loadComponent: () => import("./pages/login/auth-login-page")
    },
    {
        title:"Redirecting...",
        path: "**",
        redirectTo: "login",
        pathMatch: "full"
    }
]

export default authRoutes;