import { serverIP } from '../../hosts';
import axios from 'axios';
import { Dispatch } from 'redux';

export interface ILogin {
  type: 'LOGIN';
  token: string;
}

export const login = (username: string, password: string) => {
  return async (dispatch: Dispatch<any>) => {
    return axios
      .post(`${serverIP}/auth/login`, {
        username,
        password
      })
      .then(res =>
        dispatch({
          type: 'LOGIN',
          payload: res.data
        })
      )
      .catch(function(error) {
        console.log(error);
      });
  };
};

export const register = (username: string, password: string) => {
  return async (dispatch: Dispatch<any>) => {
    return await axios
      .post(`${serverIP}/auth/register`, {
        username,
        password
      })
      .then(res =>
        dispatch({
          type: 'LOGIN',
          payload: res.data
        })
      )
      .catch(function(error) {
        console.log(error);
      });
  };
};
