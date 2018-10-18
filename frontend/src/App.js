import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Dashboard from './screens/Dashboard';

import './App.scss';

const App = ({ store }) => (
	<Provider store={store}>
		<Router>
			<Route exact path="/" component={Dashboard} />
		</Router>
	</Provider>
);

const { shape } = PropTypes;
App.propTypes = {
	store: shape({}).isRequired,
};

export default App;
