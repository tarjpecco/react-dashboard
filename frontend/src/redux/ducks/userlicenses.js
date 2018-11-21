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
import { actionNames } from '../helper';

const userLicensesDuck = createDuck('userLicenses-duck');

// actions
const CONSTANT_ACTIONS = [
  'CREATE_USER_LICENSE',
  'REMOVE_USER_LICENSE',
  'UPDATE_USER_LICENSE',
  'UPDATE_USER_LICENSE_STATE',
  ...actionNames('GET_USER_LICENSES'),
  ...actionNames('UPDATE_USER_LICENSE')
];
const USERLICENSE_ACTIONS = {};
CONSTANT_ACTIONS.forEach(action => {
  userLicensesDuck.defineType(action);
  USERLICENSE_ACTIONS[action] = userLicensesDuck.defineType(action);
});

// Selectors
export const stateSelector = state => state.userlicenses;
export const getLicensesSelector = createSelector([stateSelector], state => {
  return state.get('userLicenses').toJS();
});

// Action Creators
export const getUserLicenses = userLicensesDuck.createAction(USERLICENSE_ACTIONS.GET_USER_LICENSES);
export const createUserLicense = userLicensesDuck.createAction(USERLICENSE_ACTIONS.CREATE_USER_LICENSE);
export const removeUserLicense = userLicensesDuck.createAction(USERLICENSE_ACTIONS.REMOVE_USER_LICENSE);
export const updateUserLicense = userLicensesDuck.createAction(USERLICENSE_ACTIONS.UPDATE_USER_LICENSE);
export const updateUserLicenseState = userLicensesDuck.createAction(USERLICENSE_ACTIONS.UPDATE_USER_LICENSE_STATE);


// Reducer Intial State
const initialState = fromJS({
  userLicenses: [],
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const userLicensesReducer = userLicensesDuck.createReducer({
  [USERLICENSE_ACTIONS.GET_USER_LICENSES_SUCCESS]: (state, { payload }) =>
    state
      .update('userLicenses', () => List(payload.userLicenses))
      .set('loading', false),
  [USERLICENSE_ACTIONS.GET_USER_LICENSES_FAILED]: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [USERLICENSE_ACTIONS.GET_USER_LICENSES_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [USERLICENSE_ACTIONS.UPDATE_USER_LICENSE_SUCCESS]: (state, { payload }) =>
    state
      .update('userLicenses', () => List(payload.userLicenses))
      .set('saveloading', false),
  [USERLICENSE_ACTIONS.UPDATE_USER_LICENSE_FAILED]: (state, { error }) => ({
    ...state,
    saveloading: false,
    error
  }),
  [USERLICENSE_ACTIONS.UPDATE_USER_LICENSE_REQUEST]: (state) => ({
    ...state,
    saveloading: true,
  }),
  [USERLICENSE_ACTIONS.UPDATE_USER_LICENSE_STATE]: (state, { payload }) => {
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
      type: USERLICENSE_ACTIONS.GET_USER_LICENSES_SUCCESS,
      payload: { userLicenses },
    });
  } catch (err) {
    const errorMessage = 'Listing User-licenses Failed';
    yield put({
      type: USERLICENSE_ACTIONS.UPDATE_USER_LICENSE_FAILED,
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
      type: USERLICENSE_ACTIONS.UPDATE_USER_LICENSE_FAILED,
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
      type: USERLICENSE_ACTIONS.UPDATE_USER_LICENSE_FAILED,
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
      type: USERLICENSE_ACTIONS.GET_USER_LICENSES_SUCCESS,
      payload: { userLicenses },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Creating User-license Failed';
    yield call(message.error, errorMessage);
    yield put({
      type: USERLICENSE_ACTIONS.UPDATE_USER_LICENSE_FAILED,
      payload: { error: errorMessage },
    });
  }
}


export function* userLicensesSaga() {
  yield all([
    yield takeLatest(USERLICENSE_ACTIONS.REMOVE_USER_LICENSE, removeUserLicenseSaga),
    yield takeLatest(USERLICENSE_ACTIONS.CREATE_USER_LICENSE, createUserLicenseSaga),
    yield takeEvery(USERLICENSE_ACTIONS.UPDATE_USER_LICENSE, updateUserLicenseSaga),
    yield takeLatest(USERLICENSE_ACTIONS.GET_USER_LICENSES, listUserLicensesSaga),
  ]);
}
