import { takeLatest, call, put, all } from 'redux-saga/effects';
import { createDuck } from 'redux-duck';

import { getAuthToken, getCurrentUser } from '../../api';
import { actionNames, createActions } from '../helper';

const authDuck = createDuck('auth-duck');

export const actions = createActions(authDuck,
  ...actionNames('SIGNIN'),
  'SIGNOUT'
)

// Reducer Intial State
const initialState = {
  error: null,
  showSideBar: true,
	user: null,
};

// Reducer
const authReducer = authDuck.createReducer({
  [actions.SIGNIN_SUCCESS]: (state, { payload }) => {
    localStorage.setItem('user', JSON.stringify(payload));
    return {
      ...state,
      user: payload,
      error: null,
    }},
  [actions.SIGNIN_ERROR]: (state, { payload }) => ({
    ...state,
    error: payload.error,
  }),
  [actions.SIGNIN_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [actions.SIGNOUT]: (state) => {
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
    yield put(actions.signin_success(userInfo));
  } catch (err) {
    const errorMessage = 'User SignIn Failed';
    yield put(actions.signin_error({ error: errorMessage }));
  }
}

export function* authSaga() {
  yield all([
    yield takeLatest(actions.SIGNIN_REQUEST, signInSaga),
  ]);
}
