import { createDuck } from 'redux-duck';
import { List, Map, fromJS } from 'immutable';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import {
  getBids,
  getBid,
  updateBid,
  createBid,
} from '../../api';
import { actionNames, createActions } from '../helper';

const bidsDuck = createDuck('bids-duck');

// actions
export const actions = createActions(bidsDuck,
  ...actionNames('GET_BIDS'),
  ...actionNames('UPDATE_BID'),
  ...actionNames('CREATE_BID'),
  ...actionNames('GET_BID'),
  'UPDATE_BID_PARTIAL',
)

// Selectors
export const stateSelector = state => state.bids;
export const getBidsSelector = createSelector([stateSelector], state => {
  return state.get('bids').toJS();
});
export const getBidSelector = createSelector([stateSelector], state => {
  return state.get('bidInfo').toJS();
});

// Reducer Intial State
const initialState = fromJS({
  bids: [],
  bidInfo: {},
  loading: false,
  error: null,
  updateError: null,
});

// Reducer
const bidListReducer = bidsDuck.createReducer({
  [actions.GET_BIDS_SUCCESS]: (state, { payload }) =>
    state
      .update('bids', () => List(payload.bidList))
      .set('loading', false),
  [actions.GET_BIDS_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('loading', false),
  [actions.GET_BIDS_REQUEST]: (state) =>
    state
      .set('loading', true),
  [actions.UPDATE_BID_SUCCESS]: (state, { payload }) =>
    state
      .update('bidInfo', () => Map(payload.bidInfo))
      .set('loading', false),
  [actions.UPDATE_BID_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('loading', false),
  [actions.UPDATE_BID_REQUEST]: (state) =>
    state
      .set('loading', true),
  [actions.UPDATE_BID_PARTIAL]: (state, { payload }) =>
    state
      .update('bidInfo', () => Map(payload.bidInfo))
      .set('loading', false),
  [actions.GET_BID_SUCCESS]: (state, { payload }) =>
    state
      .update('bidInfo', () => Map(payload.bidInfo))
      .set('loading', false),
  [actions.GET_BID_ERROR]: (state, { payload }) =>
    state
      .set('error', payload.error)
      .set('loading', false),
  [actions.GET_BID_REQUEST]: (state) =>
    state
      .set('loading', true),
  [actions.CREATE_BID_SUCCESS]: (state, { payload }) =>
    state
      .update('bids', (bids) => {
        bids.push(payload.bidInfo);
        return List(bids);
      })
      .set('loading', false),
}, initialState);

export default bidListReducer;

// Sagas
function* listBidsSaga({ payload }) {
  try {
    const { results: bidList } = yield call(getBids, payload);
    yield put(actions.get_bids_success({ bidList }));
  } catch (err) {
    const errorMessage = 'Listing bids Failed';
    yield put(actions.get_bids_error({ error: errorMessage }));
  }
}

function* createBidSaga({ payload }) {
  try {
    const bidInfo = yield call(createBid, payload.params);
    yield put(actions.create_bid_success({ bidInfo }));
  } catch (err) {
    const errorMessage = 'Listing bids Failed';
    yield put(actions.get_bid_error({ error: errorMessage }));
  }
}

function* updateBidSaga({ payload }) {
  try {
    const bidInfo = yield call(updateBid, payload.id, payload.params);
    yield put(actions.get_bid_success({ bidInfo }));
  } catch (err) {
    const errorMessage = 'Listing bids Failed';
    yield put(actions.get_bid_error({ error: errorMessage }));
  }
}

function* getBidSaga({ payload }) {
  try {
    const bidInfo = yield call(getBid, payload.id);
    yield put(actions.get_bid_success({ bidInfo }));
  } catch (err) {
    const errorMessage = 'Listing bids Failed';
    yield put(actions.get_bid_error({ error: errorMessage }));
  }
}

export function* bidsSaga() {
  yield all([
    yield takeLatest(actions.CREATE_BID, createBidSaga),
    yield takeLatest(actions.GET_BIDS, listBidsSaga),
    yield takeLatest(actions.UPDATE_BID, updateBidSaga),
    yield takeLatest(actions.GET_BID, getBidSaga),
  ]);
}
