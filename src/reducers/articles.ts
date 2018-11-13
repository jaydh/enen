import produce from 'immer';

export interface IArticle {
  id: string;
  link: string;
  addedAt: Date;
  bookmark?: string;
  metadata?: any;
  HTMLData?: string;
  completedOn?: Date;
}

export default (state = { articles: [] as IArticle[] }, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case 'GET_ARTICLES_FULFILLED':
        draft.articles = action.articles;
        break;
      case 'ADD_ARTICLE_FULFILLED':
        draft.articles.push({
          addedAt: action.addedAt,
          id: action.id,
          link: action.link
        });
        break;
      case 'DELETE_ARTICLE_FULFILLED':
        const index = draft.articles.findIndex(
          (t: IArticle) => t.id === action.id
        );
        if (index > 0) {
          draft.articles.splice(index, 1);
        }
        break;
      case 'UPDATE_ARTICLE':
        draft.articles = draft.articles.map(
          (t: IArticle) => (t.id === action.id ? action.data : t)
        );
        break;
      case 'SET_ARTICLE_COMPLETE_FULFILLED':
        draft.articles = draft.articles.map(
          (t: IArticle) =>
            t.id === action.id
              ? { ...t, completedOn: action.value ? new Date() : undefined }
              : t
        );
        break;
      case 'UPDATE_BOOKMARK_FULFILLED':
        draft.articles = draft.articles.map(
          (t: IArticle) =>
            t.id === action.id ? { ...t, bookmark: action.bookmark } : t
        );
        break;
    }
  });
