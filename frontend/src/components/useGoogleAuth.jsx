// src/hooks/useGoogleAuth.js
import { useGoogleLogin } from "@react-oauth/google";
import { authenticateWithGoogle } from "../services/authService";
import { useDispatch } from "react-redux";
import { setToken, setSignupData } from "../slices/authSlice.jsx";
import { useNavigate } from "react-router-dom";

function useGoogleAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // response has access_token, exchange with backend
        const res = await authenticateWithGoogle(response.access_token);

        localStorage.setItem("token", JSON.stringify(res.data.token));
        localStorage.setItem("user", JSON.stringify(res.data.user));

        dispatch(setToken(res.data.token));
        dispatch(setSignupData(res.data.user));

        navigate("/");
      } catch (err) {
        console.error("Login error:", err);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  return login;
}

export default useGoogleAuth;
