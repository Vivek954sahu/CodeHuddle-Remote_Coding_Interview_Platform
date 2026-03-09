import { createBrowserRouter } from "react-router";

import LandingPage from "../pages/LandingPage";

import CandidateDashboard from "../pages/dashboards/CandidateDashboard";
import AdminDashboard from "../pages/dashboards/AdminDashboard";

import InterviewRoom from "../pages/interview/InterviewRoom";

import ProtectedRoute from "../routes/ProtectedRoute";
import RoleRoute from "../routes/RoleRoute";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import InterviewerDashBoard from "../pages/dashboards/InterviewerDashBoard";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },

    {
        path: "/login",
        element: <Login />,
    },

    {
        path: "/signup",
        element: <SignUp />,
    },

    /* Protected routes */
    {
        element: <ProtectedRoute />,
        children: [

            {
                element: <RoleRoute allowedRoles={["interviewer"]} />,
                children: [
                    {
                        path: "/interviewer/dashboard",
                        element: <InterviewerDashBoard />,
                    }
                ],
            },

            {
                element: <RoleRoute allowedRoles={["candidate"]} />,
                children: [
                    {
                        path: "/candidate/dashboard",
                        element: <CandidateDashboard />,
                    }
                ],
            },

            {
                element: <RoleRoute allowedRoles={["admin"]} />,
                children: [
                    {
                        path: "/admin/dashboard",
                        element: <AdminDashboard />,
                    }
                ],
            },

            {
                element: <RoleRoute allowedRoles={["interviewer", "candidate"]} />,
                children: [
                    {
                        path: "/interview/:id",
                        element: <InterviewRoom />,
                    }
                ],
            }
        ],
    }
]);