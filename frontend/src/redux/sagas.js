import { all } from 'redux-saga/effects';

import { authSaga } from './ducks/auth';
import { userLicensesSaga } from './ducks/userlicenses';
import { projectsSaga } from './ducks/projects';
import { jobsSaga } from './ducks/jobs';
import { userSaga } from './ducks/user';
import { companiesSaga } from './ducks/companies';


export default function* () {
  yield all([
    authSaga(),
    userLicensesSaga(),
    projectsSaga(),
    jobsSaga(),
    userSaga(),
    companiesSaga(),
  ]);
}
