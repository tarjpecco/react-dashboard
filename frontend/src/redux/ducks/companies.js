import { createDuck } from 'redux-duck';
import { List, Map, fromJS } from 'immutable';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  getCompanies,
  getCompany,
  updateCompany,
} from '../../api';
import { actionNames, createActions } from '../helper';

const companiesDuck = createDuck('companies-duck');

// actions
export const actions = createActions(companiesDuck,
  ...actionNames('GET_COMPANIES'),
  ...actionNames('UPDATE_COMPANY'),
  ...actionNames('GET_COMPANY'),
  'UPDATE_COMPANY_PARTIAL',
)

// Selectors
export const stateSelector = state => state.companies;
export const getCompaniesSelector = createSelector([stateSelector], state => {
  return state.get('companies').toJS();
});
export const getCompanySelector = createSelector([stateSelector], state => {
  return state.get('companyInfo').toJS();
});

// Reducer Intial State
const initialState = fromJS({
  companies: [],
  companyInfo: {},
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
      .update('companyInfo', () => Map(payload.companyInfo))
      .set('loading', false),
  [actions.UPDATE_COMPANY_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('loading', false),
  [actions.UPDATE_COMPANY_REQUEST]: (state) =>
    state
      .set('loading', true),
  [actions.UPDATE_COMPANY_PARTIAL]: (state, { payload }) =>
    state
      .update('companyInfo', () => Map(payload.companyInfo))
      .set('loading', false),
  [actions.GET_COMPANY_SUCCESS]: (state, { payload }) =>
    state
      .update('companyInfo', () => Map(payload.companyInfo))
      .set('loading', false),
  [actions.GET_COMPANY_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('loading', false),
  [actions.GET_COMPANY_REQUEST]: (state) =>
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

function* updateCompanySaga({ payload }) {
  try {
    const companyInfo = yield call(updateCompany, payload.id, payload.params);
    yield put(actions.get_company_success({ companyInfo }));
  } catch (err) {
    const errorMessage = 'Listing companies Failed';
    yield put(actions.get_company_error({ error: errorMessage }));
  }
}

function* getCompanySaga({ payload }) {
  try {
    const companyInfo = yield call(getCompany, payload.id);
    yield put(actions.get_company_success({ companyInfo }));
  } catch (err) {
    const errorMessage = 'Listing companies Failed';
    yield put(actions.get_company_error({ error: errorMessage }));
  }
}

export function* companiesSaga() {
  yield all([
    yield takeLatest(actions.GET_COMPANIES, listCompaniesSaga),
    yield takeLatest(actions.UPDATE_COMPANY, updateCompanySaga),
    yield takeLatest(actions.GET_COMPANY, getCompanySaga),
  ]);
}
