import { createDuck } from 'redux-duck';
import { Map, fromJS } from 'immutable';
import { takeLatest, takeEvery, call, put, all } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  getCurrentUser,
  updateCurrentUser,
  getAddressById,
} from '../../api';
import { actionNames, createActions } from '../helper';

const userDuck = createDuck('user-duck');

// actions
export const actions = createActions(userDuck,
  ...actionNames('GET_USER'),
  ...actionNames('UPDATE_USER')
)

// Selectors
export const stateSelector = state => state.user;
export const getUserSelector = createSelector([stateSelector], state => {
  return state.get('user').toJS();
});

// Reducer Intial State
const initialState = fromJS({
  user: {},
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const userReducer = userDuck.createReducer({
  [actions.GET_USER_SUCCESS]: (state, { payload }) =>
    state
      .update('user', () => Map(payload.user))
      .set('loading', false),
  [actions.GET_USER_ERROR]: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [actions.GET_USER_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [actions.UPDATE_USER_SUCCESS]: (state, { payload }) =>
    state
      .update('user', () => Map(payload.user))
      .set('saveloading', false),
  [actions.UPDATE_USER_ERROR]: (state, { error }) => ({
    ...state,
    saveloading: false,
    error
  }),
  [actions.UPDATE_USER_REQUEST]: (state) => ({
    ...state,
    saveloading: true,
  }),
}, initialState);

export default userReducer;

const getIdFromUrl = (url) => url.slice(0, -1).split('/').pop();

// Sagas
function* getUserInfoSaga() {
  try {
    const user = yield call(getCurrentUser);
    const address = yield call(getAddressById, getIdFromUrl(user.address));
    yield put(actions.get_user_success({ user: { ...user, address }}));
  } catch (err) {
    const errorMessage = 'GET USER Failed';
    yield put(actions.get_user_error({ error: errorMessage }));
  }
}

function* updateUserSaga({ payload }) {
  const { params } = payload;
  try {
    const user = yield call(updateCurrentUser, params);
    console.log('update user info saga:', user);
  } catch (err) {
    console.error(err);
    const errorMessage = 'Updating User Failed';
    yield put(actions.get_user_error({ error: errorMessage }));
  }
}

export function* userSaga() {
  yield all([
    yield takeEvery(actions.UPDATE_USER, updateUserSaga),
    yield takeLatest(actions.GET_USER, getUserInfoSaga),
  ]);
}
