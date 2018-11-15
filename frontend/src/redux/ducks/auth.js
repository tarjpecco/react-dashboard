import { all } from 'redux-saga/effects';

// actions
const RECEIVE_TOKEN_ERROR = 'RECEIVE_TOKEN_ERROR';
const SIGNIN = 'SIGNIN';

// Action Creators
export const signIn = payload => ({
  type: SIGNIN,
  payload
});

// Reducer Intial State
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
