import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ApplicationProvider } from "./context/ApplicationContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ProfileProvider>
          <ApplicationProvider>
            <App />
          </ApplicationProvider>
        </ProfileProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
