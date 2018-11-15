import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import auth from './ducks/auth';
import global from './ducks/global';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}) {
	// Middleware and store enhancers

	const enhancers = [applyMiddleware(sagaMiddleware)];

	if (process.env.NODE_ENV === 'development') {
		// Enable DevTools only when rendering during development.
		if (window.devToolsExtension) {
			enhancers.push(window.devToolsExtension());
		}
	}

	const reducer = combineReducers({
		auth,
		global
	});
	
	const store = createStore(reducer, initialState, compose(...enhancers));
	// sagaMiddleware.run(rootSaga);

	return store;
}
