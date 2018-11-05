import { handleActions } from 'redux-actions';
import * as Actions from '../actions/global';

const initialState = {
	showSideBar: true,
	username: '',
	password: '',
};

const ACTION_HANDLERS = {
	[Actions.toggleSideBar]: state => ({
		...state,
		showSideBar: !state.showSideBar,
	}),
	[Actions.signIn]: (state, action) => ({
		...state,
		username: action.payload.username,
		password: action.payload.password,
	}),
};

export default handleActions(ACTION_HANDLERS, initialState);
