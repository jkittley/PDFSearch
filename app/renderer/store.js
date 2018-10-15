import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerMiddleware, routerReducer as routing, push } from 'react-router-redux';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';

import dirs from './reducers/dirs';
import dirsActions from './actions/dirs';

import files from './reducers/files';
import filesActions from './actions/files';

import tags from './reducers/tags';
import tagActions from './actions/tags';


export default function configureStore(initialState, routerHistory) {
  const router = routerMiddleware(routerHistory);

  const actionCreators = {
    ...dirsActions,
    ...filesActions,
    ...tagActions,
    push,
  };

  const reducers = {
    dirs,
    files,
    tags,
    routing,
  };

  const middlewares = [thunk, router];

  const composeEnhancers = (() => {
    const compose_ = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (process.env.NODE_ENV === 'development' && compose_) {
      return compose_({ actionCreators });
    }
    return compose;
  })();

  const enhancer = composeEnhancers(applyMiddleware(...middlewares), persistState());
  const rootReducer = combineReducers(reducers);


  return createStore(rootReducer, initialState, enhancer);
}
