import React from 'react';
import { Route, Switch } from 'react-router-dom';

import LogIn from './screens/LogIn';
import SignUp from './screens/SignUp';
import AuthReminder from './screens/AuthReminder';
import AppTemplate from './screens/AppTemplate';
import './App.scss';

const App = () => (
	<Switch>
		<Route exact path="/" component={LogIn} />
		<Route exact path="/signup" component={SignUp} />
		<Route exact path="/authreminder" component={AuthReminder} />
		<Route component={AppTemplate} />
	</Switch>
);

export default App;
