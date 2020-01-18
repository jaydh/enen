import { combineReducers } from 'redux';
import articles from './articles';
import graphData from './graphData';
import ui from './ui';
import user from './userReducer';

const appReducer = combineReducers({ articles, graphData, ui, user });

const rootReducer = (state: any, action: any) => {
  if (action.type === 'SIGN_OUT' || action.type === 'DELETE_USER_DATA') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
