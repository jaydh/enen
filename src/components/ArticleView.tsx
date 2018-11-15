import * as React from 'react';
import ReactHTMLParser from 'react-html-parser';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import updateBookmark from '../actions/updateBookmark';
import updateLastArticle from '../actions/updateLastArticle';
import updateProgress from '../actions/updateProgress';
import Loader from '../components/Loader';
import { database } from '../firebase';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

interface IProps {
  fontSize: number;
  classes: any;
  getHTML: () => void;
  match: any;
  uid: string;
  updateBookmark: (id: string, bookmark: string) => void;
  updateProgress: (id: string, progress: number) => void;
  updateLastArticle: (t: string) => void;
}

interface IState {
  HTMLData?: string;
  bookmark?: string;
  link?: string;
  metadata?: any;
  progress?: number;
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
    this.scrollToBookmark = this.scrollToBookmark.bind(this);
    this.getProgress = this.getProgress.bind(this);
  }

  public async componentDidMount() {
    // Remember last viewed article
    if (this.props.match.params.id) {
      this.props.updateLastArticle(this.props.match.params.id);
    }
    const articleId = this.props.match.params.id;
    await database
      .collection('articleDB')
      .doc(articleId)
      .get()
      .then((doc: any) =>
        this.setState({
          HTMLData: doc.data() ? doc.data().HTMLData : undefined,
          fetching: false,
          link: doc.data() ? doc.data().link : undefined,
          metadata: doc.data() ? doc.data().metadata : undefined
        })
      );

    await database
      .collection('userData')
      .doc(this.props.uid)
      .collection('articles')
      .doc(articleId)
      .get()
      .then((doc: any) =>
        this.setState({
          bookmark: doc.data() ? doc.data().bookmark : undefined,
          progress: doc.data() ? doc.data().progress : undefined
        })
      );

    // Find all nodes in page with textContent
    await this.setState({
      articleNodeList: Array.from(
        document.querySelectorAll('div.page p')
      ).filter(el => el.textContent),
      intervalId: setInterval(() => {
        this.getBookmark();
        this.getProgress();
      }, 20000)
    });
    this.scrollToBookmark();
  }

  public componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  public render() {
    const { classes, fontSize } = this.props;
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
          <div style={{ fontSize }}>
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
          </div>
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
    const id = this.props.match.params.id;

    for (let i = 0, max = elements.length; i < max; i++) {
      const element = elements[i];
      const rect = element.getBoundingClientRect();
      if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement!.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement!.clientWidth)
      ) {
        // Use previous element unless first element
        const newBookmark = elements[i > 0 ? i - 1 : i].textContent;
        if (newBookmark !== this.state.bookmark) {
          this.props.updateBookmark(id, newBookmark);
        }
        return;
      }
    }
  }

  private scrollToBookmark() {
    const elements = this.state.articleNodeList;
    if (elements) {
      const target = Array.from(elements).find(
        (el: any) => el.textContent === this.state.bookmark
      ) as HTMLElement;
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }

  private getProgress() {
    const h = document.documentElement;
    if (h) {
      const id = this.props.match.params.id;
      const b = document.body;
      const st = 'scrollTop';
      const sh = 'scrollHeight';
      const newProgress =
        ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
      if (newProgress !== this.state.progress) {
        this.props.updateProgress(id, newProgress);
      }
    }
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    fontSize: state.ui.fontSize,
    uid: state.user.uid
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    { updateLastArticle, updateBookmark, updateProgress },
    dispatch
  );

const styles = {
  root: { maxWidth: '75vw', padding: '2em 4em' },
  title: { marginBottom: '4em' }
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ArticleView));
