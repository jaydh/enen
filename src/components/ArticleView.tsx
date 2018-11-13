import * as React from 'react';
import ReactHTMLParser from 'react-html-parser';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import updateBookmark from '../actions/updateBookmark';
import updateLastArticle from '../actions/updateLastArticle';
import Loader from '../components/Loader';
import { database } from '../firebase';
import { IArticle } from '../reducers/articles';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

interface IProps {
  article: IArticle;
  fontSize: number;
  classes: any;
  getHTML: () => void;
  match: any;
  updateBookmark: (id: string, bookmark: string) => void;
  updateLastArticle: (t: string) => void;
}

interface IState {
  HTMLData?: string;
  link?: string;
  metadata?: any;
  fetching: boolean;
  articleNodeList: any;
  intervalId: any;
}

class ArticleView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      articleNodeList: null,
      fetching: true,
      intervalId: null
    };
    this.getBookmark = this.getBookmark.bind(this);
  }

  public async componentDidMount() {
    // Remember last viewed article
    if (this.props.match.params.id) {
      this.props.updateLastArticle(this.props.match.params.id);
    }

    await database
      .collection('articleDB')
      .doc(this.props.match.params.id)
      .get()
      .then((doc: any) =>
        this.setState({
          HTMLData: doc.data() ? doc.data().HTMLData : undefined,
          fetching: false,
          link: doc.data() ? doc.data().link : undefined,
          metadata: doc.data() ? doc.data().metadata : undefined
        })
      );

    // Find all nodes in page with textContent
    this.setState({
      articleNodeList: Array.from(
        document.querySelectorAll('div.page p')
      ).filter(el => el.textContent),
      intervalId: setInterval(this.getBookmark, 20000)
    });
  }

  public componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  public render() {
    const { classes } = this.props;
    const { HTMLData, fetching, metadata, link } = this.state;
    const title =
      metadata && (metadata.title || metadata.ogTitle)
        ? metadata.title || metadata.ogTitle
        : link;

    const siteName = metadata && (metadata.siteName || metadata.ogSiteName);
    const description =
      metadata && (metadata.ogDescrption || metadata.description);
    const subtitle = `${siteName ? siteName : ''} ${
      description ? '-' + description : ''
    }`;

    return fetching || HTMLData ? (
      <Grid container={true} alignItems="center" justify="center">
        <Paper elevation={10} className={classes.root}>
          <Typography variant="title">{title}</Typography>
          <Typography variant="subtitle1">{subtitle}</Typography>
          <Divider className={classes.title} />
          {fetching ? (
            <Loader isLoading={fetching} />
          ) : (
            ReactHTMLParser(HTMLData, {
              transform: (node: any, index: number) => {
                if (node.name === 'img') {
                  node.attribs.class = 'img-fluid';
                  return undefined;
                }
                return undefined;
              }
            })
          )}
        </Paper>
      </Grid>
    ) : (
      <Grid container={true} alignItems="center" justify="center">
        <Typography variant="h3">Unavailable</Typography>
      </Grid>
    );
  }

  private getBookmark() {
    const elements = this.state.articleNodeList;
    const { article } = this.props;

    if (article) {
      for (let i = 0, max = elements.length; i < max; i++) {
        const element = elements[i];
        const rect = element.getBoundingClientRect();
        if (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement!.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement!.clientWidth) &&
          element.textContent !== article.bookmark &&
          element.textContent !== ''
        ) {
          // Use previous element unless first element
          this.props.updateBookmark(
            article.id,
            elements[i > 0 ? i - 1 : i].textContent
          );
          break;
        }
      }
    }
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    article: state.articles.articles.find(
      (t: IArticle) => t.id === ownProps.match.params.id
    )
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ updateLastArticle, updateBookmark }, dispatch);

const styles = {
  root: { maxWidth: '75vw', padding: '2em 4em' },
  title: { marginBottom: '4em' }
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ArticleView));
