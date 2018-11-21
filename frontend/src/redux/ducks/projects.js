import { createDuck } from 'redux-duck';
import { List, fromJS } from 'immutable';
import { takeEvery, call, put, all } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  getProjects,
} from '../../api';

const projectsDuck = createDuck('projects-duck');

// actions
const GET_PROJECTS = projectsDuck.defineType('GET_PROJECTS');
const GET_PROJECT_LIST_SUCCESS = projectsDuck.defineType('GET_PROJECT_LIST_SUCCESS');
const GET_PROJECT_LIST_FAILED = projectsDuck.defineType('GET_PROJECT_LIST_FAILED');
const GET_PROJECT_LIST_REQUEST = projectsDuck.defineType('GET_PROJECT_LIST_REQUEST');

// Selectors
export const stateSelector = state => state.projects;
export const getProjectsSelector = createSelector([stateSelector], state => {
  return state.get('projects').toJS();
});

// Action Creators
export const getProjectsAction = projectsDuck.createAction(GET_PROJECTS);

// Reducer Intial State
const initialState = fromJS({
  projects: [],
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const userProjectsReducer = projectsDuck.createReducer({
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
}, initialState);

export default userProjectsReducer;

// Sagas
function* listProjectsSaga() {
  try {
    const { results: userProjects } = yield call(getProjects);
    yield put({
      type: GET_PROJECT_LIST_SUCCESS,
      payload: { userProjects },
    });
  } catch (err) {
    const errorMessage = 'Listing Projects Failed';
    yield put({
      type: GET_PROJECT_LIST_FAILED,
      payload: { error: errorMessage },
    });
  }
}

export function* projectsSaga() {
  yield all([
    yield takeEvery(GET_PROJECTS, listProjectsSaga),
  ]);
}
