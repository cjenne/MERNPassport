import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};
const middleware = [thunk];
const store = createStore(
  // () => [],
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
export default store;

// import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';
// import rootReducer from "./reducers";


// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export default () => {
//   const store = createStore(
//     combineReducers({
//       // your reducers here...
//       rootReducer,
//       initialState
//     }),
//     composeEnhancers(applyMiddleware(thunk))
//   );

//   return store;
// };
// corrected above per https://stackoverflow.com/questions/53807189/configuring-redux-to-display-on-all-browsers-is-not-working-correctly