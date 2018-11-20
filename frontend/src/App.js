import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import LogIn from './screens/LogIn';
import SignUp from './screens/SignUp';
import AuthReminder from './screens/AuthReminder';
import AppTemplate from './screens/AppTemplate';
import './App.scss';

const App = () => (
	<Switch>
		<Route exact path="/login" component={LogIn} />
		<Route exact path="/signup" component={SignUp} />
		<Route exact path="/authreminder" component={AuthReminder} />
		<Route path="/"
			render={() => {
				if (localStorage.getItem('id_token') !== null) {
					console.log('log:',localStorage.getItem('id_token'));
					return <AppTemplate />;
				}
				return <Redirect to="login" />;
			}}
		/>
	</Switch>
);

export default App;
