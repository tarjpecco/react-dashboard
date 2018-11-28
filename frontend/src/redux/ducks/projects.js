import { createDuck } from 'redux-duck';
import { List, fromJS } from 'immutable';
import { takeEvery, takeLatest, call, put, all, select } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  getProjects,
  createProject,
} from '../../api';
import { actionNames, createActions } from '../helper';

const projectsDuck = createDuck('projects-duck');


export const actions = createActions(projectsDuck,
  'CREATE_PROJECT',
  ...actionNames('GET_PROJECTS'),
  ...actionNames('GET_USER_PROJECTS'),
  ...actionNames('UPDATE_PROJECT')
)

// Selectors
export const stateSelector = state => state.projects;
export const getProjectsSelector = createSelector([stateSelector], state => {
  return state.get('projects').toJS();
});

// Reducer Intial State
const initialState = fromJS({
  projects: [],
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const projectListReducer = projectsDuck.createReducer({
  [actions.GET_PROJECTS_SUCCESS]: (state, { payload }) =>
    state
      .update('projects', () => List(payload.projectList))
      .set('loading', false),
  [actions.GET_PROJECTS_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('loading', false),
  [actions.GET_PROJECTS_REQUEST]: (state) =>
    state
      .set('loading', true),
  [actions.UPDATE_PROJECT_SUCCESS]: (state, { payload }) =>
  state
    .update('projects', () => List(payload.projects))
    .set('saveloading', false),
  [actions.UPDATE_PROJECT_ERROR]: (state, { payload }) =>
  state
    .set('error', payload.error)
    .set('saveloading', false),
}, initialState);

export default projectListReducer;

// Sagas
function* listProjectsSaga() {
  try {
    const { results: projectList } = yield call(getProjects);
    yield put(actions.get_projects_success({ projectList }));
  } catch (err) {
    const errorMessage = 'Listing Projects Failed';
    yield put(actions.get_projects_error({ error: errorMessage }));
  }
}

function* createProjectSaga({ payload }) {
  try {
    const newItem = yield call(createProject, payload);
    const projectList = yield select(getProjectsSelector);
    projectList.push(newItem);
    yield put(actions.get_projects_success({ projectList }));
  } catch (err) {
    const errorMessage = 'Creating Project Failed';
    yield put(actions.get_projects_error({ error: errorMessage }));
  }
}

export function* projectsSaga() {
  yield all([
    yield takeEvery(actions.GET_PROJECTS, listProjectsSaga),
    yield takeLatest(actions.CREATE_PROJECT, createProjectSaga),
  ]);
}
