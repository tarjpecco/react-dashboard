import { createDuck } from 'redux-duck';
import { List, fromJS } from 'immutable';
import { takeEvery, call, put, all } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  getCompanies,
} from '../../api';
import { actionNames, createActions } from '../helper';

const companiesDuck = createDuck('companies-duck');

// actions
export const actions = createActions(companiesDuck,
  'CREATE_COMPANY',
  ...actionNames('GET_COMPANIES'),
  ...actionNames('UPDATE_COMPANY')
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
  [actions.UPDATE_COMPANY_SUCCESS]: (state, { payload }) =>
  state
    .update('companies', () => List(payload.companies))
    .set('saveloading', false),
  [actions.UPDATE_COMPANY_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('saveloading', false),
}, initialState);

export default companyListReducer;

// Sagas
function* listCompaniesSaga({ payload }) {
  try {
    const { results: companyList } = yield call(getCompanies, payload.filter);
    yield put(actions.get_companies_success({ companyList }));
  } catch (err) {
    const errorMessage = 'Listing companies Failed';
    yield put(actions.get_companies_error({ error: errorMessage }));
  }
}

export function* companiesSaga() {
  yield all([
    yield takeEvery(actions.GET_COMPANIES, listCompaniesSaga),
  ]);
}
