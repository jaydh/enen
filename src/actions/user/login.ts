import { serverIP } from "../../hosts";
import axios from "axios";
import { Dispatch } from "redux";

export interface ILogin {
  type: "LOGIN";
  token: string;
}

export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch<any>) => {
    return axios
      .post(`${serverIP}/auth/login`, {
        email,
        password
      })
      .then(res =>
        dispatch({ type: "LOGIN", token: res.data && res.data.accessToken })
      )
      .catch(function(error) {
        console.log(error);
      });
  };
};

export const register = (email: string, password: string) => {
  return async (dispatch: Dispatch<any>) => {
    return await axios
      .post(`${serverIP}/auth/register`, {
        email,
        password
      })
      .then(res =>
        dispatch({ type: "LOGIN", token: res.data && res.data.accessToken })
      )
      .catch(function(error) {
        console.log(error);
      });
  };
};
