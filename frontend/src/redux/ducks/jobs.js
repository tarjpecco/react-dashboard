import { createDuck } from 'redux-duck';
import { List, fromJS } from 'immutable';
import { takeEvery, takeLatest, call, put, all, select } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  getJobsForProject,
  createJob,
} from '../../api';
import { actionNames } from '../helper';

const jobsDuck = createDuck('jobs-duck');

// actions
const CONSTANT_ACTIONS = [
  'GET_JOBS',
  'CREATE_JOB',
  ...actionNames('GET_JOB_LIST'),
  ...actionNames('UPDATE_JOB')
];
const JOB_ACTIONS = {};
CONSTANT_ACTIONS.forEach(action => {
  jobsDuck.defineType(action);
  JOB_ACTIONS[action] = jobsDuck.defineType(action);
});

// Selectors
export const stateSelector = state => state.jobs;
export const getJobsSelector = createSelector([stateSelector], state => {
  return state.get('jobs').toJS();
});

// Action Creators
export const listJobsAction = jobsDuck.createAction(JOB_ACTIONS.GET_JOBS);
export const createJobAction = jobsDuck.createAction(JOB_ACTIONS.CREATE_JOB);
export const getJobListSuccessAction = jobsDuck.createAction(JOB_ACTIONS.GET_JOB_LIST_SUCCESS);
export const getJobListFailedAction = jobsDuck.createAction(JOB_ACTIONS.GET_JOB_LIST_FAILED);

// Reducer Intial State
const initialState = fromJS({
  jobs: [],
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const jobListReducer = jobsDuck.createReducer({
  [JOB_ACTIONS.GET_JOB_LIST_SUCCESS]: (state, { payload }) =>
    state
      .update('jobs', () => List(payload.jobList))
      .set('loading', false),
  [JOB_ACTIONS.GET_JOB_LIST_FAILED]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('loading', false),
  [JOB_ACTIONS.GET_JOB_LIST_REQUEST]: (state) =>
    state
      .set('loading', true),
  [JOB_ACTIONS.UPDATE_JOB_SUCCESS]: (state, { payload }) =>
  state
    .update('jobs', () => List(payload.jobs))
    .set('saveloading', false),
  [JOB_ACTIONS.UPDATE_JOB_FAILED]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('saveloading', false),
}, initialState);

export default jobListReducer;

// Sagas
function* listJobsSaga({ payload }) {
  try {
    const { results: jobList } = yield call(getJobsForProject, payload.id, payload.status);
    yield put(getJobListSuccessAction({ jobList }));
  } catch (err) {
    const errorMessage = 'Listing jobs Failed';
    yield put(getJobListFailedAction({ error: errorMessage }));
  }
}

function* createJobSaga({ payload }) {
  try {
    const newItem = yield call(createJob, payload);
    const jobList = yield select(getJobsSelector);
    jobList.push(newItem);
    yield put(getJobListSuccessAction({ jobList }));
  } catch (err) {
    const errorMessage = 'Creating Job Failed';
    yield put(getJobListFailedAction({ error: errorMessage }));
  }
}

export function* jobsSaga() {
  yield all([
    yield takeEvery(JOB_ACTIONS.GET_JOBS, listJobsSaga),
    yield takeLatest(JOB_ACTIONS.CREATE_JOB, createJobSaga),
  ]);
}
