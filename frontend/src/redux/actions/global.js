import { createAction } from 'redux-actions';

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const SIGNIN = 'SIGNIN';

export const toggleSideBar = createAction(TOGGLE_SIDEBAR);
export const signIn = createAction(SIGNIN);
