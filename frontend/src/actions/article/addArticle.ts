import axios from 'axios';
import { serverIP } from '../../hosts';

export interface IAddArticleRequested {
  type: 'ADD_ARTICLE_REQUESTED';
}
export interface IAddArticleFulfilled {
  type: 'ADD_ARTICLE_FULFILLED';
  url: string;
  id: string;
  addedAt: Date;
}
export interface IAddArticleRejected {
  reason: string;
  type: 'ADD_ARTICLE_REJECTED';
}

export interface IAddArticle {
  type: 'ADD_ARTICLE';
  articleLink: string;
  project?: string;
}

function AddArticleRequested(): IAddArticleRequested {
  return {
    type: 'ADD_ARTICLE_REQUESTED'
  };
}

function AddArticleRejected(reason: string): IAddArticleRejected {
  return {
    reason,
    type: 'ADD_ARTICLE_REJECTED'
  };
}

function AddArticleFulfilled(
  url: string,
  id: string,
  addedAt: Date
): IAddArticleFulfilled {
  return {
    addedAt,
    id,
    url,
    type: 'ADD_ARTICLE_FULFILLED'
  };
}

export default function addArticle(url: string) {
  return async (dispatch: any, getState: any) => {
    dispatch(AddArticleRequested());
    const token = getState().user.token;
    const data = await axios({
      method: 'POST',
      url: `${serverIP}/user/save`,
      headers: { Authorization: `Bearer ${token}` },
      data: { url }
    })
      .then(res => {
        return res && res.data;
      })
      .catch(function(error) {
        console.log(error);
      });
    const { _id } = data;
    dispatch(AddArticleFulfilled(url, _id, new Date()));
    const request = async () => {
      const article = await axios({
        method: 'GET',
        url: `${serverIP}/article/id`,
        params: { id: _id }
      })
        .then(res => res.data)
        .catch(function(error) {
          console.log(error);
        });
      console.log(article);

      // Stop polling after server signals done fetching
      if (article && !article.fetching) {
        window.clearInterval(interval);
        dispatch({ type: 'UPDATE_ARTICLE', id: _id, data: article });
      }
    };
    const interval = window.setInterval(request, 1500);
  };
}
