import { createDuck } from 'redux-duck';
import { List, fromJS } from 'immutable';
import { takeLatest, takeEvery, call, put, all, select } from 'redux-saga/effects';
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
  'REMOVE_LICENSE',
  'UPDATE_LICENSE_STATE',
  ...actionNames('GET_LICENSES'),
  ...actionNames('UPDATE_LICENSE')
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
  [actions.GET_LICENSES_ERROR]: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [actions.GET_LICENSES_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [actions.UPDATE_LICENSE_SUCCESS]: (state, { payload }) =>
    state
      .update('userLicenses', () => List(payload.userLicenses))
      .set('saveloading', false),
  [actions.UPDATE_LICENSE_ERROR]: (state, { error }) => ({
    ...state,
    saveloading: false,
    error
  }),
  [actions.UPDATE_LICENSE_REQUEST]: (state) => ({
    ...state,
    saveloading: true,
  }),
  [actions.UPDATE_LICENSE_STATE]: (state, { payload }) => {
    const { id, params } = payload;
    return state
      .updateIn(['userLicenses', id], () => params)
  }
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
    console.error(err);
    const errorMessage = 'Removing User-license Failed';
    yield put(actions.get_licenses_error({ error: errorMessage }));
  }
}

function* updateUserLicenseSaga({ payload }) {
  const { userId, licenseId, params } = payload;
  try {
    yield call(updateUserLicenseForUser, userId, licenseId, params);
    yield call(listUserLicensesSaga);
  } catch (err) {
    console.error(err);
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
    console.error(err);
    const errorMessage = 'Creating User-license Failed';
    yield put(actions.get_licenses_error({ error: errorMessage }));
  }
}


export function* userLicensesSaga() {
  yield all([
    yield takeLatest(actions.REMOVE_LICENSE, removeUserLicenseSaga),
    yield takeLatest(actions.CREATE_LICENSE, createUserLicenseSaga),
    yield takeEvery(actions.UPDATE_LICENSE, updateUserLicenseSaga),
    yield takeLatest(actions.GET_LICENSES, listUserLicensesSaga),
  ]);
}
