import { serverIP } from '../../hosts';
import axios from 'axios';
import { Dispatch } from 'redux';

export interface ILogin {
  type: 'LOGIN';
  token: string;
}

export const login = (userName: string, password: string) => {
  return async (dispatch: Dispatch<any>) => {
    return axios
      .post(`${serverIP}/auth/login`, {
        userName,
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

export const register = (userName: string, password: string) => {
  return async (dispatch: Dispatch<any>) => {
    return await axios
      .post(`${serverIP}/auth/register`, {
        userName,
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
