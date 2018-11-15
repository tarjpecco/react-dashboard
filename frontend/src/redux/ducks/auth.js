import { takeLatest, call, put, all } from 'redux-saga/effects';

import { getAuthToken, getCurrentUser } from '../../api';

// actions
const RECEIVE_TOKEN_ERROR = 'RECEIVE_TOKEN_ERROR';
const SIGNIN = 'SIGNIN';
const SIGNIN_SUCCEED = 'SIGNIN_SUCCEED';
const SIGNIN_FAILD = 'SIGNIN_FAILD';
const SIGNOUT = 'SIGNOUT';

// Action Creators
export const signInAction = payload => ({
  type: SIGNIN,
  payload
});

export const signOutAcion = payload => ({
  type: SIGNOUT,
  payload
});

// Reducer Intial State
const initialState = {
  error: null,
  showSideBar: true,
	user: null,
};
  
// Reducer
export default function reducer(state = initialState, { type, payload }) {
  switch (type){
    case RECEIVE_TOKEN_ERROR:
      return Object.assign(
        {},
        {
          ...state,
          error: payload.error
        }
      );
    case SIGNIN_SUCCEED:
      localStorage.setItem('user', JSON.stringify(payload));
      return {
        ...state,
        user: payload,
        error: null,
      };
    case SIGNIN_FAILD:
      return {
        ...state,
        error: payload.error,
      };
    case SIGNOUT:
      localStorage.removeItem('id_token');
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function* signInSaga({ payload }) {
  try {
    yield call(getAuthToken, payload);
    const userInfo = yield call(getCurrentUser);
    yield put({
      type: SIGNIN_SUCCEED,
      payload: { ...userInfo },
    });
  } catch (err) {
    const errorMessage = 'User SignIn Failed';
    yield put({
      type: SIGNIN_FAILD,
      payload: { error: errorMessage },
    });
  }
}

export function* authSaga() {
  yield all([
    yield takeLatest(SIGNIN, signInSaga),
  ]);
}
