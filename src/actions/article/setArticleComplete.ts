import axios from "axios";
import { serverIP } from "../../hosts";

export interface ISetArticleCompleteRequested {
  type: "SET_ARTICLE_COMPLETE_REQUESTED";
}
export interface ISetArticleCompleteRejected {
  reason: string;
  type: "SET_ARTICLE_COMPLETE_REJECTED";
}

export interface ISetArticleCompleteFulfilled {
  type: "SET_ARTICLE_COMPLETE_FULFILLED";
  id: string;
  value: boolean;
}

function setArticleCompleteRequested(): ISetArticleCompleteRequested {
  return {
    type: "SET_ARTICLE_COMPLETE_REQUESTED"
  };
}

function setArticleCompleteRejected(
  reason: string
): ISetArticleCompleteRejected {
  return {
    reason,
    type: "SET_ARTICLE_COMPLETE_REJECTED"
  };
}

function setArticleCompleteFulfilled(
  id: string,
  value: boolean
): ISetArticleCompleteFulfilled {
  return {
    id,
    type: "SET_ARTICLE_COMPLETE_FULFILLED",
    value
  };
}

export default function setArticleComplete(id: string, value: boolean) {
  return async (dispatch: any, getState: any) => {
    dispatch(setArticleCompleteRequested());
    const token = getState().user.token;
    axios({
      method: "POST",
      url: `${serverIP}/user/complete`,
      headers: { Authorization: `Bearer ${token}` },
      data: { id }
    })
      .then(res => res.data)
      .catch(function(error) {
        dispatch(setArticleCompleteRejected(error));
      });
    dispatch(setArticleCompleteFulfilled(id, value));
  };
}
