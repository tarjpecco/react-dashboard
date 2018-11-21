import { takeLatest, call, put, all } from 'redux-saga/effects';
import { createDuck } from 'redux-duck';

import { getAuthToken, getCurrentUser } from '../../api';
import { actionNames } from '../helper';

const authDuck = createDuck('auth-duck');

// actions
const CONSTANT_ACTIONS = [...actionNames('SIGNIN'), 'SIGNOUT'];
const AUTH_ACTIONS = {};
CONSTANT_ACTIONS.forEach(action => {
  authDuck.defineType(action);
  AUTH_ACTIONS[action] = authDuck.defineType(action);
});

// Action Creators
export const signInAction = authDuck.createAction(AUTH_ACTIONS.SIGNIN);
export const signOutAcion = authDuck.createAction(AUTH_ACTIONS.SIGNOUT);

// Reducer Intial State
const initialState = {
  error: null,
  showSideBar: true,
	user: null,
};
  
// Reducer
const authReducer = authDuck.createReducer({
  [AUTH_ACTIONS.SIGNIN_SUCCESS]: (state, { payload }) => {
    localStorage.setItem('user', JSON.stringify(payload));
    return {
      ...state,
      user: payload,
      error: null,
    }},
  [AUTH_ACTIONS.SIGNIN_FAILED]: (state, { payload }) => ({
    ...state,
    error: payload.error,
  }),
  [AUTH_ACTIONS.SIGNIN_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [AUTH_ACTIONS.SIGNOUT]: (state) => {
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
    return {
      ...state,
      user: null,
    };
  }
}, initialState);

export default authReducer;

// sagas
function* signInSaga({ payload }) {
  try {
    yield call(getAuthToken, payload);
    const userInfo = yield call(getCurrentUser);
    yield put({
      type: AUTH_ACTIONS.SIGNIN_SUCCESS,
      payload: { ...userInfo },
    });
  } catch (err) {
    const errorMessage = 'User SignIn Failed';
    yield put({
      type: AUTH_ACTIONS.SIGNIN_FAILED,
      payload: { error: errorMessage },
    });
  }
}

export function* authSaga() {
  yield all([
    yield takeLatest(AUTH_ACTIONS.SIGNIN, signInSaga),
  ]);
}
