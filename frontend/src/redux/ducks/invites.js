import { createDuck } from 'redux-duck';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import { fromJS } from 'immutable';

import {
  createInvite,
} from '../../api';
import { createActions, actionNames } from '../helper';

const invitesDuck = createDuck('invites-duck');

// actions
export const actions = createActions(invitesDuck,
  ...actionNames('CREATE_INVITE'),
)

// Reducer Intial State
const initialState = fromJS({
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const invitesReducer = invitesDuck.createReducer({
  [actions.CREATE_INVITE_SUCCESS]: (state) =>
    state
      .set('error', null)
      .set('loading', false),
  [actions.CREATE_INVITE_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('loading', false),
  [actions.CREATE_INVITE_REQUEST]: (state) =>
    state
      .set('loading', true),
}, initialState);

export default invitesReducer;

// Sagas
function* createInviteSaga({ payload }) {
  try {
    yield call(createInvite, payload);
    yield put(actions.create_invite_success());
  } catch (err) {
    console.error(err);
    const errorMessage = 'Creating Invite Failed';
    yield put(actions.create_invite_error({ error: errorMessage }));
  }
}


export function* invitesSaga() {
  yield all([
    yield takeLatest(actions.CREATE_INVITE, createInviteSaga),
  ]);
}
