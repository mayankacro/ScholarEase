import { Navigate } from "react-router-dom";

function ProtectedRoute({ 
    children, 
    allowedRole,
}: {
    children: React.ReactNode; 
    allowedRole: string;
}) {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if(!token || !user){
        return <Navigate to="/login" />;
    }

    if(user.role !== allowedRole){
        return <Navigate to="/login" />;
    }
    return children;
}

export default ProtectedRoute;