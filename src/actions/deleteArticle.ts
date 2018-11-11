import { database } from '../firebase';

export interface IDeleteArticleRequested {
  type: 'DELETE_ARTICLE_REQUESTED';
}
export interface IDeleteArticleFulfilled {
  type: 'DELETE_ARTICLE_FULFILLED';
  id: string;
}
export interface IDeleteArticleRejected {
  reason: string;
  type: 'DELETE_ARTICLE_REJECTED';
}

function DeleteArticleRequested(): IDeleteArticleRequested {
  return {
    type: 'DELETE_ARTICLE_REQUESTED'
  };
}

function DeleteArticleRejected(reason: string): IDeleteArticleRejected {
  return {
    reason,
    type: 'DELETE_ARTICLE_REJECTED'
  };
}

function DeleteArticleFulfilled(id: string): IDeleteArticleFulfilled {
  return {
    id,
    type: 'DELETE_ARTICLE_FULFILLED'
  };
}

export default function deleteArticle(id: string) {
  return async (dispatch: any, getState: any) => {
    dispatch(DeleteArticleRequested());

    const userRef = database
      .collection('userData')
      .doc(getState().user.uid)
      .collection('articles')
      .doc(id);

    await userRef
      .delete()
      .then(() => dispatch(DeleteArticleFulfilled(id)))
      .catch((e: string) => dispatch(DeleteArticleRejected(e)));
  };
}
