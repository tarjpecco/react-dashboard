import React from 'react';
import { Route, Switch } from 'react-router-dom';

import LogIn from './screens/LogIn';
import AppTemplate from './screens/AppTemplate';
import './App.scss';

const App = () => (
	<Switch>
		<Route exact path="/" component={LogIn} />
		<Route component={AppTemplate} />
	</Switch>
);

export default App;
