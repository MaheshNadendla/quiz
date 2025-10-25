// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function OpenRoute({ children }) {
  const { signupData } = useSelector((state) => state.auth);

  if (signupData === null) {
    return children;
  } else {
    return <Navigate to="/dashboard" />;
  }
}

export default OpenRoute;
