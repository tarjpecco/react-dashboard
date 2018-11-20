import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import auth from './ducks/auth';
import global from './ducks/global';
import userlicenses from './ducks/userlicenses';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const history = createBrowserHistory();

export default function configureStore(initialState = {}) {
	// Middleware and store enhancers

	const enhancers = [applyMiddleware(routerMiddleware(history), sagaMiddleware)];

	if (process.env.NODE_ENV === 'development') {
		// Enable DevTools only when rendering during development.
		if (window.devToolsExtension) {
			enhancers.push(window.devToolsExtension());
		}
	}

	const reducer = combineReducers({
		auth,
		global,
		userlicenses
	});
	
	const store = createStore(connectRouter(history)(reducer), initialState, compose(...enhancers));
	sagaMiddleware.run(rootSaga);

	return store;
}
