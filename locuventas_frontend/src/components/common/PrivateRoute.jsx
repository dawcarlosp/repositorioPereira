import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth"; // ajustá si tu hook está en otro archivo

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
