/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { createDuck } from 'redux-duck';
import { List, fromJS } from 'immutable';
import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  createUserLicenseForUser,
  getUserLicensesForUser,
  updateUserLicenseForUser,
  removeUserLicenseForUser,
  getCurrentUser
} from '../../api';
import { actionNames, createActions } from '../helper';

const userLicensesDuck = createDuck('userLicenses-duck');

// actions
export const actions = createActions(userLicensesDuck,
  'CREATE_LICENSE',
  'ADD_LICENSE',
  'EDIT_LICENSE',
  'DELETE_LICENSE',
  'REMOVE_LICENSE',
  'UPDATE_LICENSE_STATE',
  ...actionNames('GET_LICENSES'),
  ...actionNames('UPDATE_LICENSES'),
)

// Selectors
export const stateSelector = state => state.userlicenses;
export const getLicensesSelector = createSelector([stateSelector], state => {
  return state.get('userLicenses').toJS();
});

// Reducer Intial State
const initialState = fromJS({
  userLicenses: [],
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const userLicensesReducer = userLicensesDuck.createReducer({
  [actions.GET_LICENSES_SUCCESS]: (state, { payload }) =>
    state
      .update('userLicenses', () => List(payload.userLicenses))
      .set('loading', false),
  [actions.GET_LICENSES_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('loading', false),
  [actions.GET_LICENSES_REQUEST]: (state) =>
    state
      .set('loading', true),
  [actions.UPDATE_LICENSES_SUCCESS]: (state, { payload }) =>
    state
      .set('saveloading', false),
  [actions.UPDATE_LICENSES_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('saveloading', false),
  [actions.UPDATE_LICENSES_REQUEST]: (state) =>
    state
      .set('saveloading', true),
  [actions.UPDATE_LICENSE_STATE]: (state, { payload }) =>
    state
      .updateIn(['userLicenses', payload.id], () => payload.params),
  [actions.ADD_LICENSE]: (state, { payload }) =>
    state
      .update('userLicenses', (userLicenses) => userLicenses.push(payload))
      .set('loading', false),
  [actions.EDIT_LICENSE]: (state, { payload }) =>
    state
    .updateIn(['userLicenses', payload.id], () => payload.params)
    .set('loading', false),
  [actions.DELETE_LICENSE]: (state, { payload }) =>
    state
    .update('userLicenses', (userLicenses) => List(userLicenses.splice(payload.id, 1)))
    .set('loading', false),
}, initialState);

export default userLicensesReducer;

// Sagas
function* listUserLicensesSaga() {
  try {
    const { results: userLicenses } = yield call(getUserLicensesForUser, 'me');
    yield put(actions.get_licenses_success({ userLicenses }));
  } catch (err) {
    const errorMessage = 'Listing User-licenses Failed';
    yield put(actions.get_licenses_error({ error: errorMessage }));
  }
}

function* removeUserLicenseSaga({ payload }) {
  try {
    const { userId, licenseId } = payload;
    yield call(removeUserLicenseForUser, userId, licenseId);
    yield call(listUserLicensesSaga);
  } catch (err) {
    const errorMessage = 'Removing User-license Failed';
    yield put(actions.get_licenses_error({ error: errorMessage }));
  }
}

function* updateLicensesSaga() {
  try {
    const { results: exLicenses } = yield call(getUserLicensesForUser, 'me');
    const userLicenses = yield select(getLicensesSelector);
    const userLicensesUrls = userLicenses.map(license => license.url);
    yield all(exLicenses.map(license => {
      const index = userLicensesUrls.findIndex(url => url === license.url);
      const licenseId = license.url.slice(0, -1).split('/').pop();
      if (index >= 0) {
        return call(updateUserLicenseForUser, 'me', licenseId, userLicenses[index]);
      }
      return call(removeUserLicenseForUser, 'me', licenseId);
    }));
    const exLicensesUrls = exLicenses.map(license => license.url);
    // eslint-disable array-callback-return
    yield all(userLicenses.map(license => {
      const index = exLicensesUrls.findIndex(url => url === license.url);
      if (index < 0 || userLicenses.length === 0) {
        return call(createUserLicenseForUser, 'me', { ...license });
      }
    }));
    yield call(listUserLicensesSaga);
  } catch (err) {
    const errorMessage = 'Updating User-license Failed';
    yield put(actions.get_licenses_error({ error: errorMessage }));
  }
}

function* createUserLicenseSaga({ payload }) {
  try {
    const userInfo = yield call(getCurrentUser);
    const newItem = yield call(createUserLicenseForUser, 'me', { ...payload, user: userInfo.url });
    const userLicenses = yield select(getLicensesSelector);
    userLicenses.push(newItem);
    yield put(actions.get_licenses_success({ userLicenses }));
  } catch (err) {
    const errorMessage = 'Creating User-license Failed';
    yield put(actions.get_licenses_error({ error: errorMessage }));
  }
}

export function* userLicensesSaga() {
  yield all([
    yield takeLatest(actions.REMOVE_LICENSE, removeUserLicenseSaga),
    yield takeLatest(actions.CREATE_LICENSE, createUserLicenseSaga),
    yield takeLatest(actions.UPDATE_LICENSES, updateLicensesSaga),
    yield takeLatest(actions.GET_LICENSES, listUserLicensesSaga),
  ]);
}
