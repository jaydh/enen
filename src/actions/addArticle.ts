import { database } from '../firebase';
import hasher from '../helpers/hash';

export interface IAddArticleRequested {
  type: 'ADD_ARTICLE_REQUESTED';
}
export interface IAddArticleFulfilled {
  type: 'ADD_ARTICLE_FULFILLED';
  link: string;
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
  link: string,
  id: string,
  addedAt: Date
): IAddArticleFulfilled {
  return {
    addedAt,
    id,
    link,
    type: 'ADD_ARTICLE_FULFILLED'
  };
}

export default function addArticle(link: string) {
  return async (dispatch: any, getState: any) => {
    dispatch(AddArticleRequested());

    const id = hasher(link).toString();

    const userRef = database
      .collection('userData')
      .doc(getState().user.uid)
      .collection('articles')
      .doc(id);

    const articleRef = database.collection('articleDB').doc(id);

    articleRef.get().then(doc => {
      if (doc.exists) {
        // nomalizer data and push to store
      } else {
        // trigger get data
        articleRef.set({ id, link });
      }
    });

    await userRef
      .set({
        addedAt: new Date().getTime(),
        id
      })
      .then(() => dispatch(AddArticleFulfilled(link, id, new Date())))
      .catch((e: string) => dispatch(AddArticleRejected(e)));

    // Listen for fetching done

    // tslint:disable-next-line:no-empty
    const unsubscribe = articleRef.onSnapshot(() => {});
    let startedFetching = false;
    articleRef.onSnapshot(doc => {
      const data = doc.data();
      if (data) {
        dispatch({ type: 'UPDATE_ARTICLE', id, data });
      }

      if (data && !startedFetching && data.fetching) {
        startedFetching = true;
      }
      if (data && startedFetching && !data.fetching) {
        unsubscribe();
      }
    });
  };
}
