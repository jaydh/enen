import { combineReducers } from 'redux';
import articles from './articles';
import ui from './ui';
import user from './userReducer';

const appReducer = combineReducers({ articles, ui, user });

const rootReducer = (state: any, action: any) => {
  if (action.type === 'USER_LOGOUT' || action.type === 'DELETE_USER_DATA') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
