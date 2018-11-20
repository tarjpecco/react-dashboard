import { createDuck } from 'redux-duck';

const globalDuck = createDuck('global-duck');

// actions
const TOGGLE_SIDEBAR = globalDuck.defineType('TOGGLE_SIDEBAR');

// Action Creators
export const toggleSideBar = globalDuck.createAction(TOGGLE_SIDEBAR);


// Reducer Intial State
const initialState = {
  showSideBar: true,
};
  
// Reducer
const globalReducer = globalDuck.createReducer({
  [TOGGLE_SIDEBAR]: (state) => ({
    ...state,
    showSideBar: !state.showSideBar,
  }),
}, initialState);

export default globalReducer;
