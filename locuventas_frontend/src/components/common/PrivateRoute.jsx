import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function PrivateRoute({ children }) {
  const { auth } = useAuth();
  const token = auth?.token;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
