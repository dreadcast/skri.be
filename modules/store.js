import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import RootReducer from './RootReducer.js';

var storePlugins = [
	applyMiddleware(thunkMiddleware)
];

let store = compose(...storePlugins)(createStore)(RootReducer);

export default store;
