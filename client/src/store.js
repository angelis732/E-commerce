import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/reducerProducts.js';
import cartReducer from './reducers/reducerCart.js';
import orderReducer from './reducers/reducerOrders';
import authReducer from './reducers/reducerAuth'

const reducer = combineReducers({
    product: rootReducer,
    cart: cartReducer,
    orderStore: orderReducer,
    auth: authReducer
})

//REDUX DETVOOLS en google, instalar thunk
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    composeEnhancer(applyMiddleware(thunk))
);

export default store;
