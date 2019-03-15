import produce from "immer";

export interface IArticle {
  id: string;
  url: string;
  addedAt: Date;
  bookmark?: string;
  metadata?: any;
  HTMLData?: string;
  completedOn?: Date;
  progress?: number;
  fetching?: boolean;
}

interface ArticleMap {
  [key: string]: IArticle;
}

export default (
  state = {
    articleIDs: [] as string[],
    articleData: {} as ArticleMap,
    labels: [] as any[]
  },
  action: any
) =>
  produce(state, draft => {
    switch (action.type) {
      case "SAVE_ARTICLES":
        const { HTMLMap } = action;
        const ids = Object.keys(HTMLMap);
        ids.forEach(
          (id: string) => (draft.articleData[id].HTMLData = HTMLMap[id])
        );
        break;

      case "GET_ARTICLES_FULFILLED":
        // non-destructive with persisted articles
        draft.articleIDs = action.articles.map((t: IArticle) => t.id);
        action.articles.forEach((t: IArticle) => {
          const existingID = draft.articleIDs.find((id: string) => id === t.id);
          const existingArticle = existingID && draft.articleData[existingID];
          draft.articleData[t.id] = existingArticle
            ? { ...t, ...existingArticle }
            : { ...t };
        });
        break;

      case "ADD_ARTICLE_FULFILLED":
        draft.articleIDs.push(action.id);
        draft.articleData[action.id] = {
          addedAt: action.addedAt,
          id: action.id,
          url: action.url
        };
        break;

      case "DELETE_ARTICLE_FULFILLED":
        const index = draft.articleIDs.indexOf(action.id);
        if (index > -1) {
          draft.articleIDs.splice(index, 1);
          delete draft.articleData[index];
        }
        break;

      case "UPDATE_ARTICLE":
        const existingArticle = draft.articleData[action.id];
        draft.articleData[action.id] = Object.assign(
          {},
          existingArticle,
          action.data
        );
        break;

      case "SET_ARTICLE_COMPLETE_FULFILLED":
        draft.articleData[action.id] = {
          ...draft.articleData[action.id],
          completedOn: action.value ? new Date() : undefined
        };
        break;

      case "UPDATE_BOOKMARK_FULFILLED":
        draft.articleData[action.id] = {
          ...draft.articleData[action.id],
          bookmark: action.bookmark
        };
        break;

      case "UPDATE_PROGRESS_FULFILLED":
        draft.articleData[action.id] = {
          ...draft.articleData[action.id],
          progress: action.progress
        };
        break;
    }
  });
