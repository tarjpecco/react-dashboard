import { createDuck } from 'redux-duck';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import { fromJS, List } from 'immutable';
import { createSelector } from 'reselect';

import {
  createInvite,
  getFriends,
} from '../../api';
import { createActions, actionNames } from '../helper';

const invitesDuck = createDuck('invites-duck');

// actions
export const actions = createActions(invitesDuck,
  ...actionNames('CREATE_INVITE'),
  ...actionNames('GET_FRIENDS'),
)


// Selectors
export const stateSelector = state => state.invites;
export const getFriendsSelector = createSelector([stateSelector], state => {
  const subs = state.get('subFriends').toJS();
  const agents = state.get('agentFriends').toJS();
  return { subs, agents }
});


// Reducer Intial State
const initialState = fromJS({
  loading: false,
  error: null,
  updateError: null,
  subFriends: [],
  agentFriends: [],
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
  [actions.GET_FRIENDS_REQUEST]: (state) =>
    state
    .set('loading', true),
  [actions.GET_FRIENDS_ERROR]: (state, { payload }) =>
    state
    .set('error', payload.error)
    .set('loading', false),
  [actions.GET_FRIENDS_SUCCESS]: (state, { payload }) => {
    const subs = payload.friends.filter(f => f.role === 'sub')
    const agents = payload.friends.filter(f => f.role === 'agent')
    return state
      .update('subFriends', () => List(subs))
      .update('agentFriends', () => List(agents))
  }
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


function* getFriendsSaga() {
  try {
    const { results } = yield call(getFriends)
    yield put(actions.get_friends_success({ friends: results }))
  } catch (err) {
    console.error(err);
    const errorMessage = 'Getting friends Failed';
    yield put(actions.get_friends_error({ error: errorMessage }));
  }
}


export function* invitesSaga() {
  yield all([
    yield takeLatest(actions.CREATE_INVITE, createInviteSaga),
    yield takeLatest(actions.GET_FRIENDS, getFriendsSaga),
  ]);
}
