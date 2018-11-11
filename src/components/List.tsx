import * as Fuse from 'fuse.js';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import getArticles from '../actions/getArticles';
import { IArticle } from '../reducers/articles';
import Article from './Article';

import MaterialList from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';

interface IProps {
  articles: IArticle[];
  getArticles: () => void;
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
  public componentDidMount() {
    this.props.getArticles();
  }
  public render() {
    const { articles } = this.props;
    return (
      <div id="list" className="aligner">
        <MaterialList className="aligner-item">
          {articles.map((t: IArticle) => (
            <div key={t.id}>
              <Article
                expanded={this.state.expandedPanel === t.id}
                handler={this.handleChange(
                  t.id,
                  this.state.expandedPanel === t.id
                )}
                id={t.id}
              />
            </div>
          ))}{' '}
        </MaterialList>
      </div>
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

const mapStateToProps = (state: any) => {
  return {
    articles: getSearchedArticles(state.articles.articles, state.ui.search)
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ getArticles }, dispatch);

const styles = {
  root: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(List));
