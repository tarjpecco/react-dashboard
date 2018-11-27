import { createDuck } from 'redux-duck';
import { Map, fromJS } from 'immutable';
import { takeLatest, takeEvery, call, put, all } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { isUndefined } from 'lodash';

import {
  getCurrentUser,
  updateCurrentUser,
  getAddressById,
  updateAddressById,
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
  [actions.GET_USER_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('loading', false),
  [actions.GET_USER_REQUEST]: (state) =>
    state
      .set('loading', true),
  [actions.UPDATE_USER_SUCCESS]: (state, { payload }) =>
    state
      .update('user', () => Map(payload.user))
      .set('saveloading', false),
  [actions.UPDATE_USER_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('saveloading', false),
}, initialState);

export default userReducer;

const getIdFromUrl = (url) => url.slice(0, -1).split('/').pop();

// Sagas
function* getUserInfoSaga() {
  try {
    const user = yield call(getCurrentUser);
    const address = yield call(getAddressById, getIdFromUrl(user.address));
    yield put(actions.get_user_success({ user: { ...user, addressObj: address }}));
  } catch (err) {
    const errorMessage = 'GET USER Failed';
    yield put(actions.get_user_error({ error: errorMessage }));
  }
}

function* updateUserSaga({ payload }) {
  try {
    const user = yield call(updateCurrentUser, payload.user);
    if (!isUndefined(payload.user.addressObj)) yield call(updateAddressById, getIdFromUrl(user.address), { ...payload.user.addressObj });
    const address = yield call(getAddressById, getIdFromUrl(user.address));
    yield put(actions.get_user_success({ user: { ...user, addressObj: address, }}));
  } catch (err) {
    const errorMessage = 'Updating User Failed';
    yield put(actions.get_user_error({ error: errorMessage }));
  }
}

export function* userSaga() {
  yield all([
    yield takeLatest(actions.UPDATE_USER, updateUserSaga),
    yield takeLatest(actions.GET_USER, getUserInfoSaga),
  ]);
}
