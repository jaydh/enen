import { serverIP } from '../../hosts';
import axios from 'axios';
import { Dispatch } from 'redux';

export const validateToken = () => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    const { token } = getState().user;
    return token
      ? axios
          .get(`${serverIP}/auth/token/${token}`)
          .then(res => dispatch({ type: 'VALIDATE_TOKEN', payload: res.data }))
          .catch(function(error) {
            dispatch({ type: 'VALIDATE_TOKEN_FAILED', payload: error });
          })
      : false;
  };
};
