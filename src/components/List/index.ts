import { isBefore } from "date-fns";
import Fuse from "fuse.js";
import { connect } from "react-redux";
import { IArticle } from "../../reducers/articles";
import component from "./component";

const getSearchedArticles = (articles: IArticle[], search: string) => {
  if (!search) {
    return articles;
  }
  const options = {
    distance: articles.length,
    keys: [
      "metadata.title",
      "metadata.excerpt",
      "metadata.ogDescription",
      "metadata.siteName",
      "link",
      "projects"
    ],
    location: 0,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    shouldSort: false,
    threshold: 0.4,
    tokenize: true
  };
  const fuse = new Fuse(
    articles.map((t: IArticle) => {
      return {
        ...t,
        metadata: t.metadata
      };
    }),
    options as any
  );
  return fuse.search(search);
};

const getSortedArticles = (articles: IArticle[], sort: string) => {
  return [...articles].sort((a: IArticle, b: IArticle) => {
    const aTitle =
      a.metadata && (a.metadata.title || a.metadata.ogTitle)
        ? a.metadata.title || a.metadata.ogTitle
        : a.url;

    const bTitle =
      b.metadata && (b.metadata.title || b.metadata.ogTitle)
        ? b.metadata.title || b.metadata.ogTitle
        : b.url;
    switch (sort) {
      case "title":
        return aTitle.localeCompare(bTitle);
      case "date":
        return isBefore(a.addedAt, b.addedAt) ? 1 : -1;
      case "title-reverse":
        return bTitle.localeCompare(aTitle);
      case "date-reverse":
        return isBefore(b.addedAt, a.addedAt) ? 1 : -1;
    }
    return 1;
  });
};

const mapStateToProps = (state: any) => {
  const articles = state.articles.articleIDs.map(
    (id: string) => state.articles.articleData[id]
  );
  const filtered = articles.filter(
    (t: IArticle) => state.ui.showCompleted || !t.completedOn
  );
  const searched = getSearchedArticles(filtered, state.ui.search);
  const sorted = getSortedArticles(searched, state.ui.sort);
  return {
    articles: sorted
  };
};

export default connect(mapStateToProps)(component);
