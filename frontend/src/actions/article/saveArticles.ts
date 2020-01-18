import axios from "axios";
import { serverIP } from "../../hosts";

export default () => {
  return async (dispatch: any, getState: any) => {
    const { articleIDs } = getState().articles;
    const HTMLMap = {};
    const promises = articleIDs.map((id: string) =>
      axios({
        method: "GET",
        url: `${serverIP}/article/${id}`
      }).then(res => {
        HTMLMap[id] = res.data.HTML;
      })
    );
    await Promise.all(promises);
    dispatch({
      type: "SAVE_ARTICLES",
      HTMLMap
    });
  };
};
