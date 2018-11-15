import { all } from 'redux-saga/effects';


// actions
const RECEIVE_TOKEN_ERROR = 'RECEIVE_TOKEN_ERROR';
const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
const SIGNIN = 'SIGNIN';

// Action Creators


const initialState = {
  entity: null,
  error: null,
  showSideBar: true,
	username: '',
	password: '',
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
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        showSideBar: !state.showSideBar,
      };
    case SIGNIN:
      return {
        ...state,
        username: payload.username,
        password: payload.password,
      };
    default:
      return state;
  }
}

// Sagas

export function* watcherSaga() {
  yield all([
    // yield takeEvery(GET_TOKEN, ),
  ]);
}


