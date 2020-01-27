import axios from "axios";
import { Dispatch } from "redux";
import { serverIP } from "../../hosts";

export const connectEmail = (email_address: string) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    return axios({
      method: "POST",
      url: `${serverIP}/user/connectEmail`,
      data: { email_address }
    })
      .then(res =>
        dispatch({ type: "CONNECT_EMAIL_SUCCESS", payload: res.data })
      )
      .catch(function(error) {
        dispatch({ type: "CONNECT_EMAIL_FAILED", payload: error });
      });
  };
};
