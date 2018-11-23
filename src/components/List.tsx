import { isBefore } from 'date-fns';
import * as Fuse from 'fuse.js';
import * as React from 'react';
import { connect } from 'react-redux';
import { IArticle } from '../reducers/articles';
import Article from './Article';

import MaterialList from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';

interface IProps {
  articles: IArticle[];
  classes: any;
}

interface IState {
  expandedPanel: string;
}

class List extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { expandedPanel: '' };
    this.handleChange = this.handleChange.bind(this);
  }
  public render() {
    const { articles } = this.props;
    return (
      <MaterialList>
        {articles.map((t: IArticle) => (
          <Article
            key={t.id}
            expanded={this.state.expandedPanel === t.id}
            handler={this.handleChange(t.id, this.state.expandedPanel === t.id)}
            id={t.id}
          />
        ))}{' '}
      </MaterialList>
    );
  }

  private handleChange = (id: string, expanded: boolean) => (event: any) => {
    this.setState({
      expandedPanel: expanded ? '' : id
    });
  };
}

const getSearchedArticles = (articles: IArticle[], search: string) => {
  if (!search) {
    return articles;
  }
  const options = {
    distance: articles.length,
    keys: [
      'metadata.title',
      'metadata.ogTitle',
      'metadata.description',
      'metadata.ogDescription',
      'metadata.siteName',
      'metadata.ogSiteName',
      'link',
      'projects'
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
        : a.link;

    const bTitle =
      b.metadata && (b.metadata.title || b.metadata.ogTitle)
        ? b.metadata.title || b.metadata.ogTitle
        : b.link;
    switch (sort) {
      case 'title':
        return aTitle.localeCompare(bTitle);
      case 'date':
        return isBefore(a.addedAt, b.addedAt) ? 1 : -1;
      case 'title-reverse':
        return bTitle.localeCompare(aTitle);
      case 'date-reverse':
        return isBefore(b.addedAt, a.addedAt) ? 1 : -1;
    }
    return 1;
  });
};

const mapStateToProps = (state: any) => {
  const filtered = state.articles.articles.filter(
    (t: IArticle) => state.ui.showCompleted || !t.completedOn
  );
  const searched = getSearchedArticles(filtered, state.ui.search);
  const sorted = getSortedArticles(searched, state.ui.sort);
  return {
    articles: sorted
  };
};

const styles = {
  root: {}
};

export default connect(mapStateToProps)(withStyles(styles)(List));
