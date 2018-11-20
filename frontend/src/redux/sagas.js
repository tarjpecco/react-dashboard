import { all } from 'redux-saga/effects';

import { authSaga } from './ducks/auth';

export default function* () {
  yield all([
    authSaga(),
  ]);
}
