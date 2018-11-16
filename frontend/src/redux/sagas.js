import { all } from 'redux-saga/effects';

import { authSaga } from './ducks/auth';
import { userLicensesSaga } from './ducks/userlicenses';

export default function* () {
  yield all([
    authSaga(),
    userLicensesSaga(),
  ]);
}
