import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import Loader from "./components/Loader";
import appReducer from "./reducers/index";
import register from "./registerServiceWorker";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native
import { Grid, CircularProgress } from "@material-ui/core";
import rootReducer from "./reducers";

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
export const persistor = persistStore(store);
ReactDOM.render(
  <Provider store={store}>
    <PersistGate
      loading={
        <Grid container={true} alignItems="center" justify="center">
          <CircularProgress />
        </Grid>
      }
      persistor={persistor}
    >
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

register();
