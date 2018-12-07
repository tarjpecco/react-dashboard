import { takeLatest, call, put, all } from 'redux-saga/effects';
import { createDuck } from 'redux-duck';
import { createSelector } from 'reselect';

import { getAuthToken } from '../../api';
import { actionNames, createActions } from '../helper';

import { actions as userActions } from './user';
import { signUp } from "../../api/auth";

const authDuck = createDuck('auth-duck');

export const actions = createActions(authDuck,
	...actionNames('SIGNIN'),
	...actionNames('SIGNOUT'),
	...actionNames('SIGNUP'),
);

// selectors
export const getAuthState = (state) => state.auth;
export const getAuthLoading = createSelector(
	[getAuthState],
	(state) => state.loading,
);
export const getAuthError = createSelector(
	[getAuthState],
	(state) => state.error,
);

// Reducer Intial State
const initialState = {
	error: null,
	showSideBar: true,
	user: null,
	loading: false,
};

// Reducer
const authReducer = authDuck.createReducer({
	[actions.SIGNIN_SUCCESS]: (state) => {
		return {
			...state,
			error: null,
		}
	},
	[actions.SIGNIN_ERROR]: (state, { payload }) => ({
		...state,
		error: payload.error,
	}),
	[actions.SIGNIN_REQUEST]: (state) => ({
		...state,
		loading: true,
	}),
	[actions.SIGNOUT_SUCCESS]: (state) => ({
		...state,
		user: null,
		error: null,
	}),
	[actions.SIGNOUT_ERROR]: (state) => ({
		...state,
		error: null,
	}),
	[actions.SIGNUP_SUCCESS]: (state, { payload }) => ({
		...state,
		loading: false,
	}),
	[actions.SIGNUP_REQUEST]: (state) => ({
		...state,
		loading: true,
	}),
	[actions.SIGNUP_ERROR]: (state, { payload }) => ({
		...state,
		loading: false,
		error: payload.error.response.data,
	}),
}, initialState);

export default authReducer;

// sagas
function* signInSaga({ payload }) {
	try {
		const token = yield call(getAuthToken, payload);
		localStorage.setItem('id_token', token.access);
		yield put(userActions.get_user());
		yield put(actions.signin_success());
	} catch (err) {
		const errorMessage = 'User SignIn Failed';
		yield put(actions.signin_error({ error: errorMessage }));
	}
}

function* signOutSaga() {
	try {
		localStorage.removeItem('id_token');
		yield put(userActions.reset_user());
		yield put(actions.signout_success());
	} catch (err) {
		const errorMessage = 'User SingOut Failed';
		yield put(actions.signout_error({ error: errorMessage }));
	}
}

function* signUpSaga({ payload }) {
	try {
		const result = yield call(signUp, payload);
		const token = yield call(getAuthToken, { username: payload.username, password: payload.password });
		localStorage.setItem('id_token', token.access);
		yield put(userActions.get_user());
		yield put(actions.signup_success(result));
	} catch (error) {
		yield put(actions.signup_error({ error }))
	}
}

export function* authSaga() {
	yield all([
		yield takeLatest(actions.SIGNIN_REQUEST, signInSaga),
		yield takeLatest(actions.SIGNOUT_REQUEST, signOutSaga),
		yield takeLatest(actions.SIGNUP_REQUEST, signUpSaga),
	]);
}
