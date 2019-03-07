import axios from "axios";
import { serverIP } from "../../hosts";

export interface IDeleteArticleRequested {
  type: "DELETE_ARTICLE_REQUESTED";
}
export interface IDeleteArticleFulfilled {
  type: "DELETE_ARTICLE_FULFILLED";
  id: string;
}
export interface IDeleteArticleRejected {
  reason: string;
  type: "DELETE_ARTICLE_REJECTED";
}

function DeleteArticleRequested(): IDeleteArticleRequested {
  return {
    type: "DELETE_ARTICLE_REQUESTED"
  };
}

function DeleteArticleRejected(reason: string): IDeleteArticleRejected {
  return {
    reason,
    type: "DELETE_ARTICLE_REJECTED"
  };
}

function DeleteArticleFulfilled(id: string): IDeleteArticleFulfilled {
  return {
    id,
    type: "DELETE_ARTICLE_FULFILLED"
  };
}

export default function deleteArticle(id: string) {
  return async (dispatch: any, getState: any) => {
    dispatch(DeleteArticleRequested());
    const token = getState().user.token;
    axios({
      method: "POST",
      url: `${serverIP}/user/delete`,
      headers: { Authorization: `Bearer ${token}` },
      data: { id }
    })
      .then(res => res.data)
      .catch(function(error) {
        dispatch(DeleteArticleRejected(error));
      });
    dispatch(DeleteArticleFulfilled(id));
  };
}
