import { createSelector } from "reselect";
import sortBy from "lodash.sortby";

import { SUBJECT_FETCHED } from "../constants/actionTypes";

const reshapeSubject = ({ subject: subjectHash, tabs, fields }) => {
  const subject = Object.values(subjectHash)[0];
  return { _id: subject._id, description: subject.description, tabs, fields };
};

export default function currentSubject(state = {}, action = {}) {
  switch (action.type) {
    case SUBJECT_FETCHED:
      return reshapeSubject(action.data.entities);
    default:
      return state;
  }
}

// SELECTORS
export const getSubject = state => state.currentSubject;
export const getSubjectDescription = createSelector(
  getSubject,
  subject => subject.description || ""
);
export const getSubjectId = createSelector(
  getSubject,
  subject => subject._id || ""
);
export const getTabsArray = state =>
  sortBy(Object.values(state.currentSubject.tabs || {}), ["description"]);
export const getFieldsArray = state =>
  sortBy(Object.values(state.currentSubject.fields || {}), ["description"]);
export const getFieldsHash = createSelector(
  getSubject,
  subject => subject.fields
);