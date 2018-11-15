// actions
const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';

// Action Creators
export const toggleSideBar = () => ({
  type: TOGGLE_SIDEBAR,
});


// Reducer Intial State
const initialState = {
  showSideBar: true,
};

// Reducer
export default function reducer(state = initialState, { type }) {
  switch (type){
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        showSideBar: !state.showSideBar,
      };
    default:
      return state;
  }
}
