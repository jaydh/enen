import * as firebase from 'firebase';
import { database } from '../firebase';

export interface ISetArticleCompleteRequested {
  type: 'SET_ARTICLE_COMPLETE_REQUESTED';
}
export interface ISetArticleCompleteRejected {
  reason: string;
  type: 'SET_ARTICLE_COMPLETE_REJECTED';
}

export interface ISetArticleCompleteFulfilled {
  type: 'SET_ARTICLE_COMPLETE_FULFILLED';
  id: string;
  value: boolean;
}

function setArticleCompleteRequested(): ISetArticleCompleteRequested {
  return {
    type: 'SET_ARTICLE_COMPLETE_REQUESTED'
  };
}

function setArticleCompleteRejected(
  reason: string
): ISetArticleCompleteRejected {
  return {
    reason,
    type: 'SET_ARTICLE_COMPLETE_REJECTED'
  };
}

function setArticleCompleteFulfilled(
  id: string,
  value: boolean
): ISetArticleCompleteFulfilled {
  return {
    id,
    type: 'SET_ARTICLE_COMPLETE_FULFILLED',
    value
  };
}

export default function setArticleComplete(id: string, value: boolean) {
  return async (dispatch: any, getState: any) => {
    dispatch(setArticleCompleteRequested());

    const userRef = database
      .collection('userData')
      .doc(getState().user.uid)
      .collection('articles')
      .doc(id);

    return userRef
      .update({
        completedOn: value
          ? new Date().getTime()
          : firebase.firestore.FieldValue.delete()
      })
      .then(() => dispatch(setArticleCompleteFulfilled(id, value)))
      .catch((e: string) => dispatch(setArticleCompleteRejected(e)));
  };
}
