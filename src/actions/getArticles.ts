import { database } from '../firebase';

interface IGetArticlesRequested {
  type: 'GET_ARTICLES_REQUESTED';
}

interface IGetArticlesFulfilled {
  type: 'GET_ARTICLES_FULFILLED';
  articles: any;
}

const getArticlesRequested = (): IGetArticlesRequested => {
  return {
    type: 'GET_ARTICLES_REQUESTED'
  };
};

const getArticlesFulfilled = (articles: any): IGetArticlesFulfilled => {
  // tslint:disable-next-line:no-console
  return { articles, type: 'GET_ARTICLES_FULFILLED' };
};

export default () => {
  return async (dispatch: any, getState: any) => {
    dispatch(getArticlesRequested());
    const user = getState().user.uid;
    if (user) {
      const articlesRef = database
        .collection('userData')
        .doc(user)
        .collection('articles');

      // Get ids and timestamp data
      let articles = await articlesRef.get().then(querySnapshot => {
        const data: any = [];
        querySnapshot.forEach(doc => data.push(doc.data()));
        return data;
      });
      // Merge user article data with db data
      articles = await Promise.all(
        articles.map(async (article: { id: string }) => {
          const data = await database
            .collection('articleDB')
            .doc(article.id)
            .get()
            .then((doc: any) => doc.data());

          return (
            article &&
            Object.assign({}, article, {
              link: data.link,
              metadata: data.metadata
            })
          );
        })
      );
      dispatch(getArticlesFulfilled(articles));
    }
  };
};
