import { parse } from "date-fns";
import axios from "axios";
import { Dispatch } from "redux";
import { serverIP } from "../../hosts";

interface IGetArticlesRequested {
  type: "GET_ARTICLES_REQUESTED";
}

interface IGetArticlesFulfilled {
  type: "GET_ARTICLES_FULFILLED";
  articles: any;
}

const getArticlesRequested = (): IGetArticlesRequested => {
  return {
    type: "GET_ARTICLES_REQUESTED"
  };
};

const getArticlesFulfilled = (articles: any): IGetArticlesFulfilled => {
  return { articles, type: "GET_ARTICLES_FULFILLED" };
};

export default () => {
  return async (
    dispatch: Dispatch<IGetArticlesFulfilled | IGetArticlesRequested>,
    getState: any
  ) => {
    const token = getState().user.token;
    dispatch(getArticlesRequested());
    const articleIDs =
      (await axios({
        method: "GET",
        url: `${serverIP}/user/articles`,
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.data)
        .catch(function(error) {
          console.log(error);
        })) || [];

    // Merge ids with content
    const articleDataPromises = articleIDs.map(
      async (article: { id: string }) => {
        return axios({
          method: "GET",
          url: `${serverIP}/article/id`,
          params: { id: article.id }
        })
          .then(
            res =>
              res.data &&
              Object.assign({}, article, {
                url: res.data.url,
                metadata: res.data.metadata
              })
          )
          .catch(function(error) {
            console.log(error);
          });
      }
    );

    const articles = await Promise.all(articleDataPromises);
    console.log(articles)
    dispatch(getArticlesFulfilled(articles));
  };
};
