import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { signupData } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(signupData);
  if (isLoggedIn) return children;
  return <Navigate to="/" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
