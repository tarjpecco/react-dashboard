import { createDuck } from 'redux-duck';
import { List, fromJS } from 'immutable';
import { takeEvery, takeLatest, call, put, all, select } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  getProjects,
  createProject,
} from '../../api';
import { actionNames } from '../helper';

const projectsDuck = createDuck('projects-duck');

// actions
const CONSTANT_ACTIONS = [
  'GET_PROJECTS',
  'CREATE_PROJECT',
  ...actionNames('GET_PROJECT_LIST'),
  ...actionNames('UPDATE_PROJECT')
];
const PROJECT_ACTIONS = {};
CONSTANT_ACTIONS.forEach(action => {
  projectsDuck.defineType(action);
  PROJECT_ACTIONS[action] = projectsDuck.defineType(action);
});

// Selectors
export const stateSelector = state => state.projects;
export const getProjectsSelector = createSelector([stateSelector], state => {
  return state.get('projects').toJS();
});

// Action Creators
export const getProjectsAction = projectsDuck.createAction(PROJECT_ACTIONS.GET_PROJECTS);
export const createProjectAction = projectsDuck.createAction(PROJECT_ACTIONS.CREATE_PROJECT);
export const getProjectListSuccessAction = projectsDuck.createAction(PROJECT_ACTIONS.GET_PROJECT_LIST_SUCCESS);
export const getProjectListFailedAction = projectsDuck.createAction(PROJECT_ACTIONS.GET_PROJECT_LIST_FAILED);

// Reducer Intial State
const initialState = fromJS({
  projects: [],
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const projectListReducer = projectsDuck.createReducer({
  [PROJECT_ACTIONS.GET_PROJECT_LIST_SUCCESS]: (state, { payload }) =>
    state
      .update('projects', () => List(payload.projectList))
      .set('loading', false),
  [PROJECT_ACTIONS.GET_PROJECT_LIST_FAILED]: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [PROJECT_ACTIONS.GET_PROJECT_LIST_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [PROJECT_ACTIONS.UPDATE_PROJECT_SUCCESS]: (state, { payload }) =>
  state
    .update('projects', () => List(payload.projects))
    .set('saveloading', false),
  [PROJECT_ACTIONS.UPDATE_PROJECT_FAILED]: (state, { error }) => ({
    ...state,
    saveloading: false,
    error
  }),
}, initialState);

export default projectListReducer;

// Sagas
function* listProjectsSaga() {
  try {
    const { results: projectList } = yield call(getProjects);
    yield put(getProjectListSuccessAction({ projectList }));
  } catch (err) {
    const errorMessage = 'Listing Projects Failed';
    yield put(getProjectListFailedAction({ error: errorMessage }));
  }
}

function* createProjectSaga({ payload }) {
  try {
    const newItem = yield call(createProject, payload);
    const projectList = yield select(getProjectsSelector);
    projectList.push(newItem);
    yield put(getProjectListSuccessAction({ projectList }));
  } catch (err) {
    console.error(err);
    const errorMessage = 'Creating Project Failed';
    yield put(getProjectListFailedAction({ error: errorMessage }));
  }
}

export function* projectsSaga() {
  yield all([
    yield takeEvery(PROJECT_ACTIONS.GET_PROJECTS, listProjectsSaga),
    yield takeLatest(PROJECT_ACTIONS.CREATE_PROJECT, createProjectSaga),
  ]);
}
