import { createDuck } from 'redux-duck';
import { List, fromJS } from 'immutable';
import { takeEvery, takeLatest, call, put, all, select } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { isUndefined } from 'lodash';

import {
  getJobsForProject,
  createJob,
  getJobsByStatus,
} from '../../api';
import { actionNames, createActions } from '../helper';

const jobsDuck = createDuck('jobs-duck');

// actions
export const actions = createActions(jobsDuck,
  'CREATE_JOB',
  ...actionNames('GET_JOBS'),
  ...actionNames('GET_RFQ_JOBS'),
  ...actionNames('GET_PROGRESS_JOBS'),
  ...actionNames('UPDATE_JOB')
)

// Selectors
export const stateSelector = state => state.jobs;
export const getJobsSelector = createSelector([stateSelector], state => {
  return state.get('jobs').toJS();
});
export const getRFQJobsSelector = createSelector([stateSelector], state => {
  return state.get('rfqJobs').toJS();
});
export const getProgressJobsSelector = createSelector([stateSelector], state => {
  return state.get('progressJobs').toJS();
});

// Reducer Intial State
const initialState = fromJS({
  jobs: [],
  rfqJobs: [],
  progressJobs: [],
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const jobListReducer = jobsDuck.createReducer({
  [actions.GET_JOBS_SUCCESS]: (state, { payload }) =>
    state
      .update('jobs', () => List(payload.jobList))
      .set('loading', false),
  [actions.GET_RFQ_JOBS_SUCCESS]: (state, { payload }) =>
    state
      .update('rfqJobs', () => List(payload.jobList))
      .set('loading', false),
  [actions.GET_PROGRESS_JOBS_SUCCESS]: (state, { payload }) =>
    state
      .update('progressJobs', () => List(payload.jobList))
      .set('loading', false),
  [actions.GET_JOBS_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('loading', false),
  [actions.GET_JOBS_REQUEST]: (state) =>
    state
      .set('loading', true),
  [actions.UPDATE_JOB_SUCCESS]: (state, { payload }) =>
  state
    .update('jobs', () => List(payload.jobs))
    .set('saveloading', false),
  [actions.UPDATE_JOB_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('saveloading', false),
}, initialState);

export default jobListReducer;

// Sagas
function* listJobsSaga({ payload }) {
  try {
    let jobList = [];
    if (!isUndefined(payload.id)) {
      const { results } = yield call(getJobsForProject, payload.id, payload.status);
      jobList = results;
    } else {
      const { results } = yield call(getJobsByStatus, payload.status);
      jobList = results;
    }
    yield put(actions.get_jobs_success({ jobList }));

  } catch (err) {
    const errorMessage = 'Listing jobs Failed';
    yield put(actions.get_jobs_error({ error: errorMessage }));
  }
}

function* createJobSaga({ payload }) {
  try {
    const newItem = yield call(createJob, payload);
    const jobList = yield select(getJobsSelector);
    jobList.push(newItem);
    yield put(actions.get_jobs_success({ jobList }));
  } catch (err) {
    const errorMessage = 'Creating Job Failed';
    yield put(actions.get_jobs_error({ error: errorMessage }));
  }
}

function* listRFQJobsSaga() {
  try {
    const { results } = yield call(getJobsByStatus, 'rfq');
    yield put(actions.get_rfq_jobs_success({ jobList: results }));
  } catch (err) {
    const errorMessage = 'Listing jobs Failed';
    yield put(actions.get_jobs_error({ error: errorMessage }));
  }
}

function* listProgressJobsSaga() {
  try {
    const { results } = yield call(getJobsByStatus, 'in_progress');
    yield put(actions.get_progress_jobs_success({ jobList: results }));
  } catch (err) {
    const errorMessage = 'Listing jobs Failed';
    yield put(actions.get_jobs_error({ error: errorMessage }));
  }
}

export function* jobsSaga() {
  yield all([
    yield takeEvery(actions.GET_JOBS, listJobsSaga),
    yield takeEvery(actions.GET_RFQ_JOBS, listRFQJobsSaga),
    yield takeEvery(actions.GET_PROGRESS_JOBS, listProgressJobsSaga),
    yield takeLatest(actions.CREATE_JOB, createJobSaga),
  ]);
}
