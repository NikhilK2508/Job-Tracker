import { configureStore } from "@reduxjs/toolkit";
import applicationsReducer from "./applicationsSlice.js";

const STORAGE_KEY = "trackwell_applications_v1";

const store = configureStore({
  reducer: {
    applications: applicationsReducer,
  },
});

// this used to be a useEffect inside ApplicationContext, but redux store
// doesnt have useEffect so using store.subscribe instead - runs on every
// state change and just saves whatever the current items are
store.subscribe(() => {
  try {
    var state = store.getState();
    // console.log("saving to localstorage", state.applications.items.length, "items")
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.applications.items));
  } catch (err) {
    console.error("Failed to persist applications:", err);
  }
});

export default store;
