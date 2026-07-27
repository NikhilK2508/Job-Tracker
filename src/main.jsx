import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.jsx";
import store from "./store/store.js";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import "./index.css";
 
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <ProfileProvider>
            <App />
          </ProfileProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
