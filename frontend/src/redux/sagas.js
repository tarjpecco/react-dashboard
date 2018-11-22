import { all } from 'redux-saga/effects';

import { authSaga } from './ducks/auth';
import { userLicensesSaga } from './ducks/userlicenses';
import { projectsSaga } from './ducks/projects';
import { jobsSaga } from './ducks/jobs';


export default function* () {
  yield all([
    authSaga(),
    userLicensesSaga(),
    projectsSaga(),
    jobsSaga(),
  ]);
}
