import axios from "axios";
import { serverIP } from "../../hosts";

export default () => {
  return async (dispatch: any, getState: any) => {
    const { articles } = getState().articles;
    const ids = articles.map((t: any) => t.id);
    const promises = ids.map((id: string) =>
      axios({
        method: "GET",
        url: `${serverIP}/article/${id}`
      }).then(res => res.data && { id, HTMLData: res.data.HTML })
    );
    dispatch({
      type: "SAVE_ARTICLES",
      articlesHTML: await Promise.all(promises)
    });
  };
};
