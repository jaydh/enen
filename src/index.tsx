import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import appReducer from './reducers/index';
import { unregister } from './registerServiceWorker';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

(window as any).__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

export const store = createStore(
  appReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

unregister();