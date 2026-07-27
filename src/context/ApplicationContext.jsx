import { useSelector, useDispatch } from "react-redux";
import {
  STAGES,
  FOLLOW_UP_DAYS,
  daysSince,
  needsFollowUp,
  addApplication as addApplicationAction,
  updateApplication as updateApplicationAction,
  deleteApplication as deleteApplicationAction,
  addNote as addNoteAction,
  togglePin as togglePinAction,
} from "../store/applicationsSlice.js";

// switched applications over to redux (used to be plain context + useState)
// keeping this file around as a wrapper so Dashboard/EditApplication/etc dont
// need to import from redux directly - saved me from changing like 6 files

export { STAGES, FOLLOW_UP_DAYS, daysSince, needsFollowUp };

export function useApplications() {
  const applications = useSelector((state) => state.applications.items);
  const dispatch = useDispatch();

  function addApplication(entry) {
    const action = dispatch(addApplicationAction(entry));
    return action.payload.id;
  }

  function updateApplication(id, updates) {
    dispatch(updateApplicationAction({ id, updates }));
  }

  function deleteApplication(id) {
    dispatch(deleteApplicationAction(id));
  }

  function addNote(id, note) {
    dispatch(addNoteAction({ id, note }));
  }

  // pin/unpin - is company ko apne column me sabse upar la do
  function togglePin(id) {
    dispatch(togglePinAction(id));
  }

  function getApplication(id) {
    // console.log("looking for app with id", id)
    for (let i = 0; i < applications.length; i++) {
      if (applications[i].id == id) {
        return applications[i];
      }
    }
    return undefined;
  }

  return {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    addNote,
    getApplication,
    togglePin,
  };
}
