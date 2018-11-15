import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import ducks, { watcherSaga as rootSaga } from './ducks';

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
		ducks
	});
	
	const store = createStore(reducer, initialState, compose(...enhancers));
	sagaMiddleware.run(rootSaga);

	return store;
}
