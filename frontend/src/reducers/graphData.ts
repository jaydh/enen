import produce from "immer";
import parseUri from "../helpers/parseURI";

export interface IArticle {
  id: string;
  link: string;
  addedAt: Date;
  metadata?: any;
  HTMLData?: string;
}

export default (state = { domains: {} }, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case "GET_ARTICLES_FULFILLED":
        draft.domains = {};
        action.articles.forEach((article: IArticle) => {
          const val =
            (article.metadata &&
              (article.metadata.ogSiteName || article.metadata.siteName)) ||
            (parseUri(article.link) as any).authority;
          draft.domains[val] = draft.domains[val] + 1 || 1;
        });
        break;
    }
  });
