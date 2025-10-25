import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import rootReducer from "./reducer";
import { configureStore } from "@reduxjs/toolkit";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import the provider
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const store = configureStore({
  reducer: rootReducer,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
