import { createStore, compose } from 'redux';
import Reducer from './reducers';

export default function configureStore(initialState = {}) {
	// Middleware and store enhancers
	// const middlewares = [];

	const enhancers = [];

	if (process.env.NODE_ENV === 'development') {
		// Enable DevTools only when rendering during development.
		if (window.devToolsExtension) {
			enhancers.push(window.devToolsExtension());
		}
	}

	const store = createStore(Reducer, initialState, compose(...enhancers));

	return store;
}
