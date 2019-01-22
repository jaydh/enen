import { database } from '../firebase';
export default () => {
  return async (dispatch: any, getState: any) => {
    const { articles } = getState().articles;
    const ids = articles.map((t: any) => t.id);
    const promises = ids.map((id: string) =>
      database
        .collection('articleDB')
        .doc(id)
        .get()
        .then((doc: any) =>
          doc.data()
            ? { id: doc.data().id, HTMLData: doc.data().HTMLData }
            : undefined
        )
    );
    dispatch({ type: 'SAVE_ARTICLES', articlesHTML: await Promise.all(promises) });
  };
};
