import { serverIP } from "../../hosts";
import axios from "axios";
import { Dispatch } from "redux";

export interface ILogin {
  type: "LOGIN";
  token: string;
}

export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch<ILogin>) => {
    const token = await axios
      .post(`${serverIP}/auth/login`, {
        email,
        password
      })
      .then(res => res.data.accessToken)
      .catch(function(error) {
        console.log(error);
      });
    dispatch({ type: "LOGIN", token });
  };
};

export const register = (email: string, password: string) => {
  return async (dispatch: Dispatch<ILogin>) => {
    const data = await axios
      .post(`${serverIP}/auth/register`, {
        email,
        password
      })
      .then(res => res.data)
      .catch(function(error) {
        console.log(error);
      });
    console.log(data);
  };
};
