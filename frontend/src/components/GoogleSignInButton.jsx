import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { authenticateWithGoogle } from "../services/authService";
import { useDispatch } from "react-redux";
import { setToken, setSignupData } from "../slices/authSlice.jsx"; // Import actions
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { logout } from "../slices/authSlice.jsx";

function GoogleSignInButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLoginSuccess = async (response) => {
    console.log(response)
    const token = response.credential; // Google login token
    try {
      const res = await authenticateWithGoogle(token);
      console.log(res);
      // console.log(res.data.token);

      // Store in localStorage
      localStorage.setItem("token", JSON.stringify(res.data.token));
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update Redux state
      dispatch(setToken(res.data.token));
      dispatch(setSignupData(res.data.user));

      // Navigate to dashboard after successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => console.log("Login Failed")}
      width="170"
    />
  );
}

export default GoogleSignInButton;
