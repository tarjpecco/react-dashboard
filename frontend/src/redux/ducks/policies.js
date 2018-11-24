import { createDuck } from 'redux-duck';
import { List, fromJS } from 'immutable';
import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  createPoliciesForUser,
  getPoliciesForUser,
  getCurrentUser
} from '../../api';
import { actionNames, createActions } from '../helper';

const policiesDuck = createDuck('policies-duck');

// actions
export const actions = createActions(policiesDuck,
  'CREATE_POLICY',
  'REMOVE_POLICY',
  ...actionNames('GET_POLICIES'),
  ...actionNames('UPDATE_POLICY')
)

// Selectors
export const stateSelector = state => state.policies;
export const getPoliciesSelector = createSelector([stateSelector], state => {
  return state.get('policies').toJS();
});

// Reducer Intial State
const initialState = fromJS({
  policies: [],
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const policiesReducer = policiesDuck.createReducer({
  [actions.GET_POLICIES_SUCCESS]: (state, { payload }) =>
    state
      .update('policies', () => List(payload.policies))
      .set('loading', false),
  [actions.GET_POLICIES_ERROR]: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [actions.GET_POLICIES_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
}, initialState);

export default policiesReducer;

// Sagas
function* listPoliciesSaga() {
  try {
    const { results: policies } = yield call(getPoliciesForUser, 'me');
    yield put(actions.get_policies_success({ policies }));
  } catch (err) {
    const errorMessage = 'Listing Policies Failed';
    yield put(actions.get_policies_error({ error: errorMessage }));
  }
}

function* createPoliciesSaga({ payload }) {
  try {
    const userInfo = yield call(getCurrentUser);
    const newItem = yield call(createPoliciesForUser, 'me', { ...payload, user: userInfo.url });
    const policies = yield select(getPoliciesSelector);
    policies.push(newItem);
    yield put(actions.get_policies_success({ policies }));
  } catch (err) {
    console.error(err);
    const errorMessage = 'Creating Policy Failed';
    yield put(actions.get_policies_error({ error: errorMessage }));
  }
}


export function* policiesSaga() {
  yield all([
    yield takeLatest(actions.CREATE_POLICY, createPoliciesSaga),
    yield takeLatest(actions.GET_POLICIES, listPoliciesSaga),
  ]);
}
