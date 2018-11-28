import { createDuck } from 'redux-duck';
import { List, fromJS } from 'immutable';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  getCompanies,
} from '../../api';
import { actionNames, createActions } from '../helper';

const companiesDuck = createDuck('companies-duck');

// actions
export const actions = createActions(companiesDuck,
  ...actionNames('GET_COMPANIES'),
)

// Selectors
export const stateSelector = state => state.companies;
export const getCompaniesSelector = createSelector([stateSelector], state => {
  return state.get('companies').toJS();
});

// Reducer Intial State
const initialState = fromJS({
  companies: [],
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const companyListReducer = companiesDuck.createReducer({
  [actions.GET_COMPANIES_SUCCESS]: (state, { payload }) =>
    state
      .update('companies', () => List(payload.companyList))
      .set('loading', false),
  [actions.GET_COMPANIES_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('loading', false),
  [actions.GET_COMPANIES_REQUEST]: (state) =>
    state
      .set('loading', true),
}, initialState);

export default companyListReducer;

// Sagas
function* listCompaniesSaga({ payload }) {
  try {
    const { results: companyList } = yield call(getCompanies, payload);
    yield put(actions.get_companies_success({ companyList }));
  } catch (err) {
    const errorMessage = 'Listing companies Failed';
    yield put(actions.get_companies_error({ error: errorMessage }));
  }
}

export function* companiesSaga() {
  yield all([
    yield takeLatest(actions.GET_COMPANIES, listCompaniesSaga),
  ]);
}
