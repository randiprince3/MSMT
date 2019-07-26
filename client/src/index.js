import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//redux imports
import {createStore, applyMiddleware, compose, combineReducers} from "redux";
import {Provider} from "react-redux";
import authReducer from './store/reducers/auth';
import workOrdersReducer from './store/reducers/workOrders';
import thunk from 'redux-thunk';
import history from './history';
import {reducer as formReducer} from 'redux-form';

//bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const rootReducer = combineReducers({
    auth: authReducer,
    workOrders: workOrdersReducer,
    form: formReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

const app = (
    <Provider store = {store}>
        <Router history={history}>
            <App/> 
        </Router> 
    </Provider>
); 

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();

