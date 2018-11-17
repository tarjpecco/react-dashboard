import { createDuck } from 'redux-duck';
import { List, fromJS } from 'immutable';
import { message } from 'antd';
import { takeLatest, takeEvery, call, put, all, select } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  createUserLicenseForUser,
  getUserLicensesForUser,
  updateUserLicenseForUser,
  removeUserLicenseForUser,
  getCurrentUser
} from '../../api';

const userLicensesDuck = createDuck('userLicenses-duck');

// actions
const GET_USER_LICENSES = userLicensesDuck.defineType('GET_USER_LICENSES');
const CREATE_USER_LICENSE = userLicensesDuck.defineType('CREATE_USER_LICENSE');
const REMOVE_USER_LICENSE = userLicensesDuck.defineType('REMOVE_USER_LICENSE');
const UPDATE_USER_LICENSE = userLicensesDuck.defineType('UPDATE_USER_LICENSE');
const GET_USER_LICENSE_LIST_SUCCESS = userLicensesDuck.defineType('GET_USER_LICENSE_LIST_SUCCESS');
const GET_USER_LICENSE_LIST_FAILED = userLicensesDuck.defineType('GET_USER_LICENSE_LIST_FAILED');
const GET_USER_LICENSE_LIST_REQUEST = userLicensesDuck.defineType('GET_USER_LICENSE_LIST_REQUEST');
const UPDATE_USER_LICENSE_SUCCESS = userLicensesDuck.defineType('UPDATE_USER_LICENSE_SUCCESS');
const UPDATE_USER_LICENSE_FAILED = userLicensesDuck.defineType('UPDATE_USER_LICENSE_FAILED');
const UPDATE_USER_LICENSE_REQUEST = userLicensesDuck.defineType('UPDATE_USER_LICENSE_REQUEST');
const UPDATE_USER_LICENSE_STATE = userLicensesDuck.defineType('UPDATE_USER_LICENSE_STATE');

// Selectors
export const stateSelector = state => state.userlicenses;
export const getLicensesSelector = createSelector([stateSelector], state => {
  return state.get('userLicenses').toJS();
});

// Action Creators
export const getUserLicenses = userLicensesDuck.createAction(GET_USER_LICENSES);
export const createUserLicense = userLicensesDuck.createAction(CREATE_USER_LICENSE);
export const removeUserLicense = userLicensesDuck.createAction(REMOVE_USER_LICENSE);
export const updateUserLicense = userLicensesDuck.createAction(UPDATE_USER_LICENSE);
export const updateUserLicenseState = userLicensesDuck.createAction(UPDATE_USER_LICENSE_STATE);


// Reducer Intial State
const initialState = fromJS({
  userLicenses: [],
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const userLicensesReducer = userLicensesDuck.createReducer({
  [GET_USER_LICENSE_LIST_SUCCESS]: (state, { payload }) =>
    state
      .update('userLicenses', () => List(payload.userLicenses))
      .set('loading', false),
  [GET_USER_LICENSE_LIST_FAILED]: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [GET_USER_LICENSE_LIST_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [UPDATE_USER_LICENSE_SUCCESS]: (state, { payload }) =>
    state
      .update('userLicenses', () => List(payload.userLicenses))
      .set('saveloading', false),
  [UPDATE_USER_LICENSE_FAILED]: (state, { error }) => ({
    ...state,
    saveloading: false,
    error
  }),
  [UPDATE_USER_LICENSE_REQUEST]: (state) => ({
    ...state,
    saveloading: true,
  }),
  [UPDATE_USER_LICENSE_STATE]: (state, { payload }) => {
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
    yield put({
      type: GET_USER_LICENSE_LIST_SUCCESS,
      payload: { userLicenses },
    });
  } catch (err) {
    const errorMessage = 'Listing User-licenses Failed';
    yield put({
      type: GET_USER_LICENSE_LIST_FAILED,
      payload: { error: errorMessage },
    });
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
    yield call(message.error, errorMessage);
    yield put({
      type: UPDATE_USER_LICENSE_FAILED,
      payload: { error: errorMessage },
    });
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
    yield call(message.error, errorMessage);
    yield put({
      type: UPDATE_USER_LICENSE_FAILED,
      payload: { error: errorMessage },
    });
  }
}


function* createUserLicenseSaga({ payload }) {
  try {
    const userInfo = yield call(getCurrentUser);
    const newItem = yield call(createUserLicenseForUser, 'me', { ...payload, user: userInfo.url });
    const userLicenses = yield select(getLicensesSelector);
    userLicenses.push(newItem);
    yield put({
      type: GET_USER_LICENSE_LIST_SUCCESS,
      payload: { userLicenses },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Creating User-license Failed';
    yield call(message.error, errorMessage);
    yield put({
      type: UPDATE_USER_LICENSE_FAILED,
      payload: { error: errorMessage },
    });
  }
}


export function* userLicensesSaga() {
  yield all([
    yield takeLatest(REMOVE_USER_LICENSE, removeUserLicenseSaga),
    yield takeLatest(CREATE_USER_LICENSE, createUserLicenseSaga),
    yield takeEvery(UPDATE_USER_LICENSE, updateUserLicenseSaga),
    yield takeLatest(GET_USER_LICENSES, listUserLicensesSaga),
  ]);
}
