import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext"


const RoleRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}

export default RoleRoute
