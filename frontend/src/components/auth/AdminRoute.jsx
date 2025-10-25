import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminRoute = ({ children }) => {
  const { signupData } = useSelector((state) => state.auth);
  if (signupData?.isAdmin === true) return children;
  toast.error("Not authorized to access this url");
  return <Navigate to="/" />;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;
