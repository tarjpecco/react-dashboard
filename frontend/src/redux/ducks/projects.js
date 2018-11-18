import { createDuck } from 'redux-duck';
import { List, fromJS } from 'immutable';
import { takeEvery, takeLatest, call, put, all, select } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  getProjects,
  createProject,
} from '../../api';

const projectsDuck = createDuck('projects-duck');

// actions
const GET_PROJECTS = projectsDuck.defineType('GET_PROJECTS');
const CREATE_PROJECT = projectsDuck.defineType('CREATE_PROJECT');
const GET_PROJECT_LIST_SUCCESS = projectsDuck.defineType('GET_PROJECT_LIST_SUCCESS');
const GET_PROJECT_LIST_FAILED = projectsDuck.defineType('GET_PROJECT_LIST_FAILED');
const GET_PROJECT_LIST_REQUEST = projectsDuck.defineType('GET_PROJECT_LIST_REQUEST');
const UPDATE_PROJECT_SUCCESS = projectsDuck.defineType('UPDATE_PROJECT_SUCCESS');
const UPDATE_PROJECT_FAILED = projectsDuck.defineType('UPDATE_PROJECT_FAILED');

// Selectors
export const stateSelector = state => state.projects;
export const getProjectsSelector = createSelector([stateSelector], state => {
  return state.get('projects').toJS();
});

// Action Creators
export const getProjectsAction = projectsDuck.createAction(GET_PROJECTS);
export const createProjectAction = projectsDuck.createAction(CREATE_PROJECT);

// Reducer Intial State
const initialState = fromJS({
  projects: [],
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const projectListReducer = projectsDuck.createReducer({
  [GET_PROJECT_LIST_SUCCESS]: (state, { payload }) =>
    state
      .update('projects', () => List(payload.userProjects))
      .set('loading', false),
  [GET_PROJECT_LIST_FAILED]: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [GET_PROJECT_LIST_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [UPDATE_PROJECT_SUCCESS]: (state, { payload }) =>
  state
    .update('projects', () => List(payload.projects))
    .set('saveloading', false),
  [UPDATE_PROJECT_FAILED]: (state, { error }) => ({
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
    yield put({
      type: GET_PROJECT_LIST_SUCCESS,
      payload: { projectList },
    });
  } catch (err) {
    const errorMessage = 'Listing Projects Failed';
    yield put({
      type: GET_PROJECT_LIST_FAILED,
      payload: { error: errorMessage },
    });
  }
}

function* createProjectSaga({ payload }) {
  try {
    const newItem = yield call(createProject, payload);
    const projectList = yield select(getProjectsSelector);
    projectList.push(newItem);
    yield put({
      type: GET_PROJECT_LIST_SUCCESS,
      payload: { projectList },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Creating Project Failed';
    yield put({
      type: UPDATE_PROJECT_FAILED,
      payload: { error: errorMessage },
    });
  }
}

export function* projectsSaga() {
  yield all([
    yield takeEvery(GET_PROJECTS, listProjectsSaga),
    yield takeLatest(CREATE_PROJECT, createProjectSaga),
  ]);
}
