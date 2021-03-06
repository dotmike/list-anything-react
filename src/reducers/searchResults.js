import { SEARCH_RESULTS, USER_LOGGED_OUT } from "../constants/actionTypes";

export const initialState = [];

export default function searchResults(state = initialState, action = {}) {
  switch (action.type) {
    case SEARCH_RESULTS:
      return action.data;
    case USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
}

// SELECTORS
export const getResults = state => state.searchResults || initialState;
