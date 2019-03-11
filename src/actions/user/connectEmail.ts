import axios from "axios";
import { Dispatch } from "redux";
import { serverIP } from "../../hosts";

export const connectEmail = (email: string) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    const { token } = getState().user;
    return token
      ? axios({
          method: "POST",
          url: `${serverIP}/user/connectEmail`,
          headers: { Authorization: `Bearer ${token}` },
          data: { email }
        })
          .then(res =>
            dispatch({ type: "CONNECT_EMAIL_SUCCESS", payload: res.data })
          )
          .catch(function(error) {
            dispatch({ type: "CONNECT_EMAIL_FAILED", payload: error });
          })
      : false;
  };
};
