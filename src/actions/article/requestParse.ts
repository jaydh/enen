import { serverIP } from "../../hosts";
import axios from "axios";

export const requestServerParse = (url: string) => {
  return async dispatch => {
    const id = await axios({
      method: "POST",
      url: `${serverIP}/article/add`,
      data: { url }
    })
      .then(res => res.data)
      .catch(function(error) {
        console.log(error);
      });
  };
};
