import { handleActions } from 'redux-actions';
import * as Actions from '../actions/global';

const initialState = {
	showSideBar: true,
};

const ACTION_HANDLERS = {
	[Actions.toggleSideBar]: state => ({
		...state,
		showSideBar: !state.showSideBar,
	}),
};

export default handleActions(ACTION_HANDLERS, initialState);
